// src/features/check/hooks/useCheck.ts
import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { Device } from "../../mstDevice/types/device";
import type { Sheet } from "../../mstSheet/types/sheet";
import type {
    CheckResult,
    CreateCheckResultRequestDTO,
    ItemNode,
    UpdateResultRequestDTO,
    ItemAnswer,
    AnswerValue,
} from "../types/CheckResult";
import { getSheetByCode } from "../../mstSheet/services/sheetServices";
import { getDeviceByCode } from "../../mstDevice/services/deviceServices";
import { getListItemBySheetId } from "../../mstSheetItem/services/item.service";
import {
    createResult,
    updateResult,
    getListResultDayBySDCode,
    bulkUpdateResults,
    confirm as apiConfirmResults,
} from "../services/checkServices";
import { buildCheckResultsPayload } from "../types/CheckResult";
import type { AlertColor } from "@mui/material";

/**
 * useCheck
 * - Trả về: isComplete, dirty, canSubmit, canConfirm, submitAll, confirmAll
 * - Quy tắc isComplete: tất cả leaf nodes (không có children) phải được trả lời
 *   BOOLEAN: cần status OK/NG
 *   NUMBER: cần value là số hợp lệ (không rỗng)
 *   TEXT: cần value không rỗng
 */

export const useCheck = (rawCode?: string, user?: any) => {
    const navigate = useNavigate();

    const [deviceCode, setDeviceCode] = useState<string>("");
    const [sheetCode, setSheetCode] = useState<string>("");

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
        if (!rawCode) {
            navigate("/app");
            return;
        }
        const parts = rawCode.split("-");
        if (parts.length !== 2) {
            navigate("/app");
            return;
        }
        setDeviceCode(parts[0]);
        setSheetCode(parts[1]);
    }, [rawCode, navigate]);

    // helper lấy resultId từ API response (nhiều biến thể)
    const getResultId = (r: any): number | null =>
        r?.resultId ?? r?.ResultId ?? r?.resultID ?? r?.id ?? null;

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
                    if (rawValue === "OK" || rawValue === "NG") {
                        status = rawValue === "OK" ? "OK" : "NG";
                        value = rawValue;
                    } else {
                        value = rawValue ?? null;
                        status = null;
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

    // fetch sheet/device/results
    useEffect(() => {
        if (!deviceCode || !sheetCode) return;

        let mounted = true;
        const fetchAll = async () => {
            setLoading(true);
            setError("");
            try {
                const [sheetRes, deviceRes, resultRes] = await Promise.all([
                    getSheetByCode(sheetCode),
                    getDeviceByCode(deviceCode),
                    getListResultDayBySDCode(sheetCode, deviceCode),
                ]);

                if (!mounted) return;
                if (sheetRes) setTemplate(sheetRes);
                if (deviceRes) setDevice(deviceRes);

                // resultRes có thể là array
                const arrRes = Array.isArray(resultRes)
                    ? resultRes
                    : resultRes
                    ? [resultRes]
                    : [];
                setFetchedResults(arrRes);

                // set checkedBy (nếu có)
                setCheckedBy(
                    arrRes[0]?.checkedBy ??
                        arrRes[0]?.CheckedBy ??
                        arrRes[0]?.checkedby ??
                        ""
                );

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
        for (const id of requiredLeafIds) {
            const ans = answers[id];
            // tìm node để biết dataType
            const findNode = (nodes: ItemNode[] | null): ItemNode | null => {
                if (!nodes) return null;
                for (const n of nodes) {
                    if (n.itemId === id) return n;
                    const f = findNode(n.children || []);
                    if (f) return f;
                }
                return null;
            };
            const node = findNode(itemsTree);
            const dataType = (node?.dataType ?? "").toString().toUpperCase();

            if (dataType === "BOOLEAN") {
                if (!(ans && (ans.status === "OK" || ans.status === "NG")))
                    return false;
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
                if (!ans) return false;
                if (
                    ans.value === null ||
                    ans.value === "" ||
                    ans.value === undefined
                )
                    return false;
            }
        }
        return true;
    }, [requiredLeafIds, answers, itemsTree]);

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
            const payloads = buildCheckResultsPayload(
                answers,
                itemsTree,
                template,
                device,
                user
            );
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
                const bulkItems = toUpdate.map((u) => ({
                    resultId: u.id,
                    value: u.dto.value ?? "",
                    status: (u.dto as any).status ?? "",
                    updateBy: user?.userCode ?? "",
                }));
                const bulkRes = await bulkUpdateResults(bulkItems);
                if (bulkRes) updatedCount = bulkItems.length;
            }

            // refetch
            try {
                const latest = await getListResultDayBySDCode(
                    template.sheetCode ?? template?.sheetCode ?? "",
                    device?.deviceCode ?? ""
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
    } as const;
};
