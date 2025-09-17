// src/features/check/hooks/useCheck.ts
import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { Device } from "../../mstDevice/types/device";
import type { Sheet } from "../../mstSheet/types/sheet";
import type {
    CheckResult,
    CreateCheckResultRequestDTO,
    ItemNode,
    ItemAnswer,
    AnswerValue,
} from "../types/CheckResult";
import { getSheetByCode } from "../../mstSheet/services/sheetServices";
import { getDeviceByCode } from "../../mstDevice/services/deviceServices";
import { getListItemBySheetId } from "../../mstSheetItem/services/item.service";
import {
    createResult,
    getListResultDayBySDCode,
    confirm as apiConfirmResults,
    getListResultBySDCodeAndDate,
    editResults,
} from "../services/checkServices";
import { buildEditResultsPayload } from "../types/CheckResult";
import type { AlertColor } from "@mui/material";
import type { User } from "../../users/types/users";
import { getListUser } from "../../users/services/users.service";

/**
 * useCheck
 * - Trả về: isComplete, dirty, canSubmit, canConfirm, submitAll, confirmAll
 * - Quy tắc isComplete: tất cả leaf nodes (không có children) phải được trả lời
 *   BOOLEAN: cần status OK/NG
 *   NUMBER: cần value là số hợp lệ (không rỗng)
 *   TEXT: cần value không rỗng
 */

export const useEditPage = (rawCode?: string, user?: any) => {
    const navigate = useNavigate();

    const [deviceCode, setDeviceCode] = useState<string>("");
    const [sheetCode, setSheetCode] = useState<string>("");
    const [dayRef, setDayRef] = useState<string>("");

    const [template, setTemplate] = useState<Sheet | undefined>();
    const [device, setDevice] = useState<Device | undefined>();

    const [itemsTree, setItemsTree] = useState<ItemNode[] | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const [isLocked, setIsLocked] = useState<boolean>(false);

    const [answers, setAnswers] = useState<Record<number, ItemAnswer>>({});
    const [fetchedResults, setFetchedResults] = useState<any[]>([]);
    const [checkedBy, setCheckedBy] = useState<string>("");

    // dirty = user đã thay đổi answers trong client (chưa lưu)
    const [dirty, setDirty] = useState<boolean>(false);

    // user
    const [users, setUsers] = useState<User[]>([]);

    const [checker, setChecker] = useState<User | undefined>(undefined);
    const [confirmer, setConfirmer] = useState<User | undefined>(undefined);

    // Notification
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: AlertColor;
    }>({
        open: false,
        message: "",
        severity: "success",
    });

    // parse rawCode
    useEffect(() => {
        // console.log("rawCode " + rawCode);

        if (!rawCode) {
            navigate("/app");
            return;
        }
        const parts = rawCode.split("-");
        if (parts.length < 3) {
            navigate("/app");
            return;
        }
        setSheetCode(parts[0]);
        setDeviceCode(parts[1]);
        // join phần còn lại làm dayRef (ví dụ ngày yyyy-mm-dd)
        setDayRef(parts.slice(2).join("-"));
    }, [rawCode, navigate]);

    // helper lấy resultId từ API response (nhiều biến thể)
    const getResultId = (r: any): number | null =>
        r?.resultId ?? r?.ResultId ?? r?.resultID ?? r?.id ?? null;

    const deriveBooleanStatus = (raw: any): "OK" | "NG" | null => {
        if (raw === null || raw === undefined) return null;
        const s = String(raw).trim().toUpperCase();

        if (s === "OK" || s === "UPDATED") return "OK";
        if (s === "NG") return "NG";
        return null;
    };

    // helper chuẩn hoá value thành một trong 3 token (nên dùng cho answers.value)
    const normalizeBooleanValue = (
        raw: any
    ): "OK" | "NG" | "UPDATED" | null => {
        if (raw === null || raw === undefined) return null;
        const s = String(raw).trim().toUpperCase();
        if (s === "OK") return "OK";
        if (s === "NG") return "NG";
        if (s === "UPDATED") return "UPDATED";
        return null;
    };

    // build answers map từ kết quả fetch
    const buildAnswersFromResults = useCallback(
        (results: CheckResult[] | undefined) => {
            if (!results || results.length === 0) return {};
            const map: Record<number, ItemAnswer> = {};
            for (const r of results) {
                const itemId = Number(r?.itemId);
                if (!itemId) continue;

                const rawValue = r?.value ?? "";
                const dataType = (r?.dataType ?? "").toString().toUpperCase();

                let value: AnswerValue = null;
                let status: "OK" | "NG" | null = null;

                if (dataType === "BOOLEAN") {
                    // cố gắng lấy status từ trường status nếu API có
                    const rawStatus = r?.status ?? null;

                    const normRawStatus = normalizeBooleanValue(rawStatus);
                    if (normRawStatus) {
                        status = normRawStatus === "NG" ? "NG" : "OK";
                        value = normRawStatus;
                    } else {
                        // nếu không có trường status riêng, suy từ rawValue
                        const normVal = normalizeBooleanValue(rawValue);
                        if (normVal) {
                            status = normVal === "NG" ? "NG" : "OK";
                            value = normVal;
                        } else {
                            // không suy được -> giữ nguyên rawValue (hoặc set null)
                            value = rawValue ?? null;
                            status = null;
                        }
                    }
                } else if (dataType === "NUMBER") {
                    if (
                        rawValue === null ||
                        rawValue === undefined ||
                        rawValue === ""
                    ) {
                        value = null;
                        status = null;
                    } else {
                        const n = Number(rawValue);
                        value = Number.isNaN(n) ? rawValue : n;
                    }
                } else {
                    value = rawValue ?? "";
                }

                map[itemId] = { itemId, value, status };
            }
            return map;
        },
        []
    );

    // fetch sheet/device/results/users
    useEffect(() => {
        if (!deviceCode || !sheetCode) return;

        let mounted = true;
        const fetchAll = async () => {
            setLoading(true);
            setError("");
            try {
                const [sheetRes, deviceRes, resultRes, usersRes] =
                    await Promise.all([
                        getSheetByCode(sheetCode),
                        getDeviceByCode(deviceCode),
                        getListResultBySDCodeAndDate(
                            sheetCode,
                            deviceCode,
                            dayRef
                        ),
                        getListUser(),
                    ]);

                if (!mounted) return;
                if (sheetRes) setTemplate(sheetRes);
                if (deviceRes) setDevice(deviceRes);
                if (usersRes) setUsers(usersRes);

                // resultRes có thể là array
                const arrRes = Array.isArray(resultRes)
                    ? resultRes
                    : resultRes
                    ? [resultRes]
                    : [];
                setFetchedResults(arrRes);

                // checkedBy là mã userCode lưu trong result
                const checkedByCode =
                    arrRes[0]?.checkedBy ??
                    arrRes[0]?.CheckedBy ??
                    arrRes[0]?.checkedby ??
                    "";

                // set checkedBy string (dùng ở canConfirm)
                setCheckedBy(checkedByCode);

                // CHÍNH: set checker/confirmer dưới dạng User object (nếu có users list)
                if (usersRes && usersRes.length > 0) {
                    const foundChecker = usersRes.find(
                        (u: User) => u.userCode === checkedByCode
                    );
                    setChecker(foundChecker); // undefined nếu ko tìm thấy
                    const confirmByCode =
                        arrRes[0]?.confirmBy ??
                        arrRes[0]?.ConfirmBy ??
                        arrRes[0]?.confirmby ??
                        "";
                    const foundConfirmer = usersRes.find(
                        (u: User) => u.userCode === confirmByCode
                    );
                    setConfirmer(foundConfirmer);
                } else {
                    // fallback: nếu chưa có users list, lưu undefined hoặc chỉ lưu code ở một state khác
                    setChecker(undefined);
                    setConfirmer(undefined);
                }

                // lock nếu có bản đã confirm
                const locked = arrRes.some(
                    (r: any) => !!(r?.confirmBy ?? r?.ConfirmBy)
                );
                setIsLocked(locked);

                // build answers map và reset dirty
                const initialAnswers = buildAnswersFromResults(arrRes);
                setAnswers(initialAnswers);
                setDirty(false);
            } catch (err: any) {
                if (!mounted) return;
                setError(err?.message ?? String(err));
            } finally {
                if (!mounted) return;
                setLoading(false);
            }
        };

        fetchAll();
        return () => {
            mounted = false;
        };
    }, [deviceCode, sheetCode, buildAnswersFromResults]);

    // fetch item tree
    useEffect(() => {
        if (!template?.sheetId) return;

        let mounted = true;
        const fetchTree = async () => {
            setLoading(true);
            try {
                const res = await getListItemBySheetId(
                    Number(template.sheetId)
                );
                if (!mounted) return;

                const sortTree = (nodes: ItemNode[] = []): ItemNode[] =>
                    nodes
                        .slice()
                        .sort(
                            (a, b) =>
                                (a.orderNumber ?? 0) - (b.orderNumber ?? 0)
                        )
                        .map((n) => ({
                            ...n,
                            children: sortTree(n.children || []),
                        }));

                setItemsTree(sortTree(res || []));
            } catch (err: any) {
                if (!mounted) return;
                setError(err?.message ?? String(err));
            } finally {
                if (!mounted) return;
                setLoading(false);
            }
        };

        fetchTree();
        return () => {
            mounted = false;
        };
    }, [template]);

    // setAnswer -> mark dirty
    const setAnswer = useCallback(
        (itemId: number, partial: Partial<ItemAnswer>) => {
            setAnswers((prev) => {
                const existing = prev[itemId] ?? {
                    itemId,
                    value: null,
                    status: null,
                };
                const merged: ItemAnswer = { ...existing, ...partial, itemId };
                return { ...prev, [itemId]: merged };
            });
            setDirty(true);
        },
        []
    );

    // Tính list "leaf" itemIds (được coi là câu hỏi cần trả lời)
    const requiredLeafIds = useMemo(() => {
        const ids: number[] = [];
        if (!itemsTree) return ids;
        const walk = (nodes: ItemNode[]) => {
            for (const n of nodes) {
                if (!n.children || n.children.length === 0) {
                    ids.push(n.itemId);
                } else {
                    walk(n.children);
                }
            }
        };
        walk(itemsTree);
        return Array.from(new Set(ids));
    }, [itemsTree]);

    // isComplete: tất cả leaf đã được trả lời hợp lệ
    const isComplete = useMemo(() => {
        if (!requiredLeafIds || requiredLeafIds.length === 0) return false;
        if (!itemsTree) return false;

        const findNodeById = (
            id: number,
            nodes: ItemNode[] | null
        ): ItemNode | null => {
            if (!nodes) return null;
            for (const n of nodes) {
                if (n.itemId === id || String(n.itemId) === String(id))
                    return n;
                const f = findNodeById(id, n.children || []);
                if (f) return f;
            }
            return null;
        };

        for (const id of requiredLeafIds) {
            const ans = answers[id];
            const node = findNodeById(id, itemsTree);
            const dataType = (node?.dataType ?? "").toString().toUpperCase();

            if (dataType === "BOOLEAN") {
                const hasStatus =
                    ans && (ans.status === "OK" || ans.status === "NG");
                const derived = ans ? deriveBooleanStatus(ans.value) : null;
                if (!hasStatus && !derived) return false;
            } else if (dataType === "NUMBER") {
                if (
                    !ans ||
                    ans.value === null ||
                    ans.value === "" ||
                    ans.value === undefined
                )
                    return false;
                const num = Number(ans.value);
                if (!Number.isFinite(num)) return false;
            } else {
                if (
                    !ans ||
                    ans.value === null ||
                    ans.value === "" ||
                    ans.value === undefined
                )
                    return false;
            }
        }

        return true;
    }, [requiredLeafIds, answers, itemsTree]);

    // useEffect(() => {
    //     // Bật console khi muốn debug
    //     const doDebug = true;
    //     if (!doDebug) return;
    //     console.groupCollapsed("useEditPage:isComplete-debug");
    //     console.log("requiredLeafIds:", requiredLeafIds);
    //     console.log("answers keys:", Object.keys(answers));
    //     for (const id of requiredLeafIds) {
    //         console.log("-> id:", id, "answer:", answers[id]);
    //         // tìm node để hiển thị
    //         const findNode = (nodes: ItemNode[] | null): ItemNode | null => {
    //             if (!nodes) return null;
    //             for (const n of nodes) {
    //                 if (n.itemId === id || String(n.itemId) === String(id))
    //                     return n;
    //                 const f = findNode(n.children || []);
    //                 if (f) return f;
    //             }
    //             return null;
    //         };
    //         console.log("   node:", findNode(itemsTree));
    //     }
    //     console.groupEnd();
    // }, [requiredLeafIds, answers, itemsTree]);

    // canSubmit: lưu khi chưa lock, đã đủ answers và có thay đổi (dirty)
    const canSubmit = useMemo(
        () => !isLocked && isComplete && dirty,
        [isLocked, isComplete, dirty]
    );

    // canConfirm: (role != Operator) && isComplete && !dirty && not locked && checkedBy != current user
    const canConfirm = useMemo(() => {
        const role =
            (user?.roles && user.roles.length ? user.roles[0] : user?.role) ??
            user?.Role ??
            "";
        const isOperator = String(role).toLowerCase().includes("operator");
        const sameAsChecker = (user?.userCode ?? "") === (checkedBy ?? "");
        return (
            !isLocked && isComplete && !dirty && !isOperator && !sameAsChecker
        );
    }, [user, isLocked, isComplete, dirty, checkedBy]);

    // submitAll (create + update bulk)
    const submitAll = useCallback(async () => {
        if (!itemsTree || !template)
            return { success: false, message: "No sheet/items loaded" } as any;

        setLoading(true);
        try {
            const payloads = buildEditResultsPayload(
                answers,
                itemsTree,
                template,
                device,
                user,
                checker,
                confirmer,
                dayRef
            );
            // console.log("Prepared payloads:", payloads);

            if (!payloads || payloads.length === 0) {
                setLoading(false);
                return {
                    success: true,
                    created: 0,
                    updated: 0,
                    message: "No answers to submit",
                } as any;
            }

            const toCreate: CreateCheckResultRequestDTO[] = [];
            const toUpdate: { id: number; dto: CreateCheckResultRequestDTO }[] =
                [];

            for (const dto of payloads) {
                const existing = fetchedResults.find(
                    (r: CheckResult) => Number(r?.itemId) === Number(dto.itemId)
                );
                const existingId = existing ? getResultId(existing) : null;
                if (existing && existingId)
                    toUpdate.push({ id: Number(existingId), dto });
                else toCreate.push(dto);
            }

            let createdCount = 0;
            if (toCreate.length > 0) {
                const created = await createResult(toCreate);
                if (created) createdCount = toCreate.length;
            }

            let updatedCount = 0;
            if (toUpdate.length > 0) {
                const bulkItems = toUpdate.map((u) => {
                    const ans = answers[Number(u.dto.itemId)] ?? {};
                    const statusToSend =
                        ans.status ?? deriveBooleanStatus(ans.value) ?? "";
                    return {
                        resultId: u.id,
                        value: u.dto.value ?? "",
                        status: statusToSend,
                        updateBy: user?.userCode ?? "",
                        checkedBy: checker?.userCode ?? "",
                        confirmBy: confirmer?.userCode ?? "",
                    };
                });
                const bulkRes = await editResults(bulkItems);
                if (bulkRes) updatedCount = bulkItems.length;
            }

            // refetch
            try {
                const latest = await getListResultBySDCodeAndDate(
                    template?.sheetCode ?? "",
                    device?.deviceCode ?? "",
                    dayRef
                );
                const arrLatest = Array.isArray(latest)
                    ? latest
                    : latest
                    ? [latest]
                    : [];
                setFetchedResults(arrLatest);
                setAnswers(buildAnswersFromResults(arrLatest));
                setDirty(false);
                const locked = arrLatest.some(
                    (r: any) => !!(r?.confirmBy ?? r?.ConfirmBy)
                );
                setIsLocked(locked);
                setCheckedBy(
                    arrLatest[0]?.checkedBy ??
                        arrLatest[0]?.CheckedBy ??
                        arrLatest[0]?.checkedby ??
                        ""
                );
            } catch (err) {
                console.warn("Refetch after submit failed", err);
            }

            setLoading(false);
            return {
                success: true,
                created: createdCount,
                updated: updatedCount,
            } as any;
        } catch (err: any) {
            setError(err?.message ?? String(err));
            setLoading(false);
            return {
                success: false,
                message: err?.message ?? String(err),
            } as any;
        }
    }, [
        answers,
        itemsTree,
        template,
        device,
        fetchedResults,
        user,
        buildAnswersFromResults,
        checker,
        confirmer,
        dayRef,
        users,
    ]);

    // confirmAll: chỉ cho phép khi isComplete && !dirty && role != Operator && checkedBy != current user
    const confirmAll = useCallback(async () => {
        if (!isComplete)
            return {
                success: false,
                message: "Chưa đủ dữ liệu để xác nhận",
            } as any;
        if (dirty)
            return {
                success: false,
                message: "Vui lòng lưu (Hoàn thành) trước khi xác nhận",
            } as any;
        const role =
            (user?.roles && user.roles.length ? user.roles[0] : user?.role) ??
            user?.Role ??
            "";
        if (String(role).toLowerCase().includes("operator"))
            return {
                success: false,
                message: "Operator không có quyền xác nhận",
            } as any;
        if ((user?.userCode ?? "") === (checkedBy ?? ""))
            return {
                success: false,
                message: "Người xác nhận không được là người kiểm tra",
            } as any;

        setLoading(true);
        try {
            // Build payload: lấy resultId cho các requiredLeafIds từ fetchedResults (bản mới nhất)
            const latestMap: Record<number, any> = {};
            for (const r of fetchedResults) {
                const itemId = Number(r?.itemId);
                if (!itemId) continue;
                const cur = latestMap[itemId];
                const curDate = cur?.updateAt ?? cur?.checkedDate ?? null;
                const rDate = r?.updateAt ?? r?.checkedDate ?? null;
                if (!cur) latestMap[itemId] = r;
                else if (rDate && curDate && String(rDate) > String(curDate))
                    latestMap[itemId] = r;
                else if (
                    !curDate &&
                    r?.resultId &&
                    (r?.resultId ?? 0) > (cur?.resultId ?? 0)
                )
                    latestMap[itemId] = r;
            }

            const itemsToConfirm: {
                resultId: number;
                confirmBy: string;
            }[] = [];
            for (const id of requiredLeafIds) {
                const r = latestMap[id];
                if (!r) {
                    setLoading(false);
                    return {
                        success: false,
                        message: `Không tìm thấy kết quả đã lưu cho itemId ${id}`,
                    } as any;
                }
                const rid = getResultId(r);
                if (!rid) {
                    setLoading(false);
                    return {
                        success: false,
                        message: `ResultId không hợp lệ cho itemId ${id}`,
                    } as any;
                }
                itemsToConfirm.push({
                    resultId: rid,
                    confirmBy: user?.userCode ?? "",
                });
            }

            // gọi API confirm
            const res = await apiConfirmResults(itemsToConfirm);
            if (!res) {
                setLoading(false);
                return { success: false, message: "Confirm API failed" } as any;
            }

            // refetch để cập nhật trạng thái & lock
            try {
                const latest = await getListResultDayBySDCode(
                    template?.sheetCode ?? "",
                    device?.deviceCode ?? ""
                );
                const arrLatest = Array.isArray(latest)
                    ? latest
                    : latest
                    ? [latest]
                    : [];
                setFetchedResults(arrLatest);
                setAnswers(buildAnswersFromResults(arrLatest));
                // const locked = arrLatest.some(
                //     (r: any) => !!(r?.confirmBy ?? r?.ConfirmBy)
                // );
                setCheckedBy(
                    arrLatest[0]?.checkedBy ??
                        arrLatest[0]?.CheckedBy ??
                        arrLatest[0]?.checkedby ??
                        ""
                );
            } catch (err) {
                console.warn("Refetch after confirm failed", err);
            }

            setLoading(false);
            return { success: true } as any;
        } catch (err: any) {
            setError(err?.message ?? String(err));
            setLoading(false);
            return {
                success: false,
                message: err?.message ?? String(err),
            } as any;
        }
    }, [
        isComplete,
        dirty,
        user,
        checkedBy,
        fetchedResults,
        requiredLeafIds,
        template,
        device,
        buildAnswersFromResults,
    ]);

    return {
        deviceCode,
        sheetCode,
        template,
        device,
        users,
        itemsTree,
        loading,
        error,
        setError,
        isLocked,
        setIsLocked,
        checkedBy,

        answers,
        setAnswer,
        submitAll,
        confirmAll,

        // trạng thái tiện dụng cho UI
        dirty,
        setDirty,
        isComplete,
        canSubmit,
        canConfirm,

        // Notification
        snackbar,
        setSnackbar,

        // user
        checker,
        setChecker,
        confirmer,
        setConfirmer,
    } as const;
};
