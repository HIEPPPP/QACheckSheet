// src/features/check/hooks/useCheck.ts
import { useEffect, useState, useCallback, useMemo } from "react";
import type { Device } from "../../mstDevice/types/device";
import type { Sheet } from "../../mstSheet/types/sheet";
import { useNavigate } from "react-router-dom";
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
} from "../services/checkServices";
import { buildCheckResultsPayload } from "../types/CheckResult";

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

    // user đã thay đổi answers trong session (chưa lưu)
    const [dirty, setDirty] = useState<boolean>(false);

    useEffect(() => {
        if (!rawCode) {
            navigate("/");
            return;
        }
        const parts = rawCode.split("-");
        if (parts.length !== 2) {
            navigate("/");
            return;
        }
        setDeviceCode(parts[0]);
        setSheetCode(parts[1]);
    }, [rawCode, navigate]);

    // helper
    const getResultId = (r: any): number | null =>
        r?.resultId ?? r?.ResultId ?? r?.id ?? r?.Id ?? null;

    // convert API CheckResult[] -> answers map
    const buildAnswersFromResults = useCallback(
        (results: CheckResult[] | undefined) => {
            if (!results || results.length === 0) {
                return {};
            }
            const map: Record<number, ItemAnswer> = {};
            for (const r of results) {
                const itemId = Number(r?.itemId);
                if (!itemId) continue;

                const rawValue = r?.value ?? "";
                const dataType = r?.dataType ?? "";

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
                    // TEXT or unspecified
                    value = rawValue ?? "";
                }

                map[itemId] = {
                    itemId: itemId,
                    value,
                    status,
                };
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

                // ensure resultRes is array
                const arrRes = Array.isArray(resultRes)
                    ? resultRes
                    : resultRes
                    ? [resultRes]
                    : [];
                setFetchedResults(arrRes);

                // if any result confirmed, lock
                const locked = arrRes.some(
                    (r: any) => !!(r?.ConfirmBy ?? r?.confirmBy)
                );
                if (locked) {
                    setIsLocked(true);
                } else {
                    setIsLocked(false);
                }

                // build answers map from fetched results (if any)
                const initialAnswers = buildAnswersFromResults(arrRes);
                setAnswers(initialAnswers);

                // reset dirty khi mới load
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

    // fetch item tree when template available
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

    // setAnswer
    const setAnswer = useCallback(
        (itemId: number, partial: Partial<ItemAnswer>) => {
            setAnswers((prev) => {
                const existing = prev[itemId] ?? {
                    itemId,
                    value: null,
                    status: null,
                };
                const merged: ItemAnswer = { ...existing, ...partial, itemId };
                return {
                    ...prev,
                    [itemId]: merged,
                };
            });
            setDirty(true);
        },
        []
    );

    // helper: lấy list itemId required từ itemsTree (đệ quy)
    const requiredItemIds = useMemo(() => {
        const ids: number[] = [];
        if (!itemsTree) return ids;
        function walk(nodes: ItemNode[]) {
            for (const n of nodes) {
                // consider leaf items (dataType defined) or items explicitly isRequired
                if (
                    (n.isRequired && n.itemId) ||
                    !n.children ||
                    n.children.length === 0
                ) {
                    // treat childrenless as input items (but only if item actually expects a value)
                    ids.push(n.itemId);
                } else {
                    walk(n.children || []);
                }
            }
        }
        walk(itemsTree);
        // unique
        return Array.from(new Set(ids));
    }, [itemsTree]);

    // tính toán isComplete: tất cả requiredItemIds phải có answer (value/status != null)
    const isComplete = useMemo(() => {
        if (!requiredItemIds || requiredItemIds.length === 0) return false;
        for (const id of requiredItemIds) {
            const ans = answers[id];
            if (!ans) return false;
            const nodeType = (() => {
                // try to find node type from itemsTree
                function find(nodes: ItemNode[] | null): ItemNode | null {
                    if (!nodes) return null;
                    for (const n of nodes) {
                        if (n.itemId === id) return n;
                        const found = find(n.children || []);
                        if (found) return found;
                    }
                    return null;
                }
                return find(itemsTree);
            })();
            const dataType = nodeType?.dataType ?? "";
            if (dataType === "BOOLEAN") {
                if (!(ans.status === "OK" || ans.status === "NG")) return false;
            } else {
                // NUMBER or TEXT -> require value != null and not empty string
                if (
                    ans.value === null ||
                    ans.value === "" ||
                    ans.value === undefined
                )
                    return false;
            }
        }
        return true;
    }, [requiredItemIds, answers, itemsTree]);

    // canSubmit: người dùng có thể lưu (Hoàn thành) nếu:
    // - chưa bị lock, và đã đủ answers (isComplete), và có thay đổi (dirty === true)
    const canSubmit = useMemo(() => {
        return !isLocked && isComplete && dirty;
    }, [isLocked, isComplete, dirty]);

    // canConfirm: user có role khác Operator, đủ answers (isComplete), không dirty (không vừa sửa), và chưa lock
    const canConfirm = useMemo(() => {
        const role = user?.role ?? user?.Role ?? "";
        const isOperator = String(role).toLowerCase() === "operator";
        return !isLocked && isComplete && !dirty && !isOperator;
    }, [user, isLocked, isComplete, dirty]);

    // submit: build payloads, nếu có dữ liệu kiểm tra -> update
    const submitAll = useCallback(async () => {
        // guard
        if (!itemsTree || !template) {
            return { success: false, message: "No sheet/items loaded" };
        }

        setLoading(true);
        try {
            // Build payload
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
                };
            }

            const toCreate: CreateCheckResultRequestDTO[] = [];
            const toUpdate: {
                id: number;
                dto: CreateCheckResultRequestDTO;
            }[] = [];

            for (const dto of payloads) {
                const existing = fetchedResults.find((r: CheckResult) => {
                    const rItemId = Number(r?.itemId);
                    return rItemId === Number(dto.itemId);
                });

                const existingId = existing ? getResultId(existing) : null;
                if (existing && existingId) {
                    toUpdate.push({ id: Number(existingId), dto });
                } else {
                    toCreate.push(dto);
                }
            }

            // create
            let createdCount = 0;
            if (toCreate.length > 0) {
                const created = await createResult(toCreate);
                if (created) {
                    createdCount = toCreate.length;
                }
            }

            // update existing one-by-one
            // let updatedCount = 0;
            // for (const u of toUpdate) {
            //     const updateDto: UpdateResultRequestDTO = {
            //         resultId: u.id,
            //         value: u.dto.value ?? "",
            //         status: u.dto.status ?? "",
            //         updateBy: user?.userCode ?? "",
            //     };
            //     const res = await updateResult(u.id, updateDto);
            //     if (res) updatedCount++;
            // }

            // update existing bulk
            let updatedCount = 0;
            if (toUpdate.length > 0) {
                const bulkItems = toUpdate.map((u) => ({
                    resultId: u.id,
                    value: u.dto.value ?? "",
                    status: u.dto.status ?? "",
                    updateBy: user?.userCode ?? "",
                }));

                const bulkRes = await bulkUpdateResults(bulkItems);
                if (bulkRes) {
                    updatedCount = bulkItems.length;
                } else {
                    console.warn("Bulk update returned no data");
                }
            }

            // lấy lại dữ liệu sau khi submit
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
                const newAnswers = buildAnswersFromResults(arrLatest);
                setAnswers(newAnswers);
                // reset dirty vì đã lưu
                setDirty(false);
                // Re-lock
                const locked = arrLatest.some(
                    (r: any) => !!(r?.ConfirmBy ?? r?.confirmBy)
                );
                setIsLocked(locked);
            } catch (err) {
                // Có thể ghi log
                console.warn("Refetch after submit failed", err);
            }

            setLoading(false);
            return {
                success: true,
                created: createdCount,
                updated: updatedCount,
            };
        } catch (err: any) {
            setError(err?.message ?? String(err));
            setLoading(false);
            return { success: false, message: err?.message ?? String(err) };
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

    return {
        deviceCode,
        sheetCode,
        template,
        device,
        itemsTree,
        loading,
        error,
        isLocked,
        setIsLocked,

        // answers API
        answers,
        setAnswer,
        submitAll, // call to save current answers (create/update logic)
    } as const;
};
