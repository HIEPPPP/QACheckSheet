import { useCallback, useEffect, useState } from "react";
import type {
    ConfirmApproveResult,
    ReportData,
    ReportHeader,
} from "../types/report";
import {
    getHeaderReport,
    getListResultApproveConfirmByMonth,
    getResultReport,
} from "../services/result.service";
import { toMonthStartString } from "../../../utils/formatDateTime";

export const useReport = () => {
    const [confirmApproveResults, setConfirmApproveResults] = useState<
        ConfirmApproveResult[]
    >([]);
    const [loadingList, setLoadingList] = useState(false);
    const [loadingHeader, setLoadingHeader] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [headerReport, setHeaderReport] = useState<ReportHeader | null>(null);
    const [reportData, setReportData] = useState<ReportData[]>([]);
    const [monthRef, setMonthRef] = useState<string>(() =>
        toMonthStartString(new Date())
    );

    const fetchList = useCallback(
        async (monthRefString?: string) => {
            setLoadingList(true);
            setError(null);
            try {
                const res = await getListResultApproveConfirmByMonth(
                    monthRefString ?? monthRef
                );
                setConfirmApproveResults(res ?? []);
            } catch (err: any) {
                setError(err?.message ?? "Lỗi khi lấy danh sách");
            } finally {
                setLoadingList(false);
            }
        },
        [monthRef]
    );

    useEffect(() => {
        void fetchList(monthRef);
    }, [fetchList, monthRef]);

    const fetchHeaderReport = useCallback(
        async (sheetCode: string, deviceCode: string, mRef: Date | string) => {
            setLoadingHeader(true);
            setError(null);
            try {
                const res = await getHeaderReport(sheetCode, deviceCode, mRef);
                setHeaderReport(res ?? null);
                return res ?? null;
            } catch (err: any) {
                setError(err?.message ?? "Lỗi khi lấy header report");
                return null;
            } finally {
                setLoadingHeader(false);
            }
        },
        []
    );

    const fetchReportData = useCallback(
        async (sheetCode: string, deviceCode: string, mRef: Date | string) => {
            setLoadingHeader(true);
            setError(null);
            try {
                const res = await getResultReport(sheetCode, deviceCode, mRef);
                setReportData(res ?? []);
                return res ?? [];
            } catch (err: any) {
                setError(err?.message ?? "Lỗi khi lấy report");
                return null;
            } finally {
                setLoadingHeader(false);
            }
        },
        []
    );

    return {
        confirmApproveResults,
        loadingList,
        loadingHeader,
        error,
        refresh: async () => await fetchList(monthRef),
        monthRef,
        setMonthRef,
        fetchHeaderReport,
        headerReport,
        setHeaderReport,
        fetchReportData,
        reportData,
        setReportData,
    };
};
