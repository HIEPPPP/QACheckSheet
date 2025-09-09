import { useCallback, useEffect, useState } from "react";
import type {
    ConfirmApproveResult,
    ReportData,
    ReportHeader,
    ReportNG,
} from "../types/report";
import {
    getHeaderReport,
    getListResultApproveConfirmByMonth,
    getNGReport,
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

    const [reportHeader, setReportHeader] = useState<ReportHeader | null>(null);
    const [reportData, setReportData] = useState<ReportData[]>([]);
    const [reportNG, setReportNG] = useState<ReportNG[]>([]); // chưa dùng
    const [monthRef, setMonthRef] = useState<string>(() =>
        toMonthStartString(new Date())
    );

    const fetchListConfirmApprove = useCallback(
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
        void fetchListConfirmApprove(monthRef);
    }, [fetchListConfirmApprove, monthRef]);

    const fetchHeaderReport = useCallback(
        async (sheetCode: string, deviceCode: string, mRef: Date | string) => {
            setLoadingHeader(true);
            setError(null);
            try {
                const res = await getHeaderReport(sheetCode, deviceCode, mRef);
                setReportHeader(res ?? null);
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

    const fetchReportNG = useCallback(
        async (sheetCode: string, deviceCode: string, mRef: Date | string) => {
            setLoadingHeader(true);
            setError(null);
            try {
                const res = await getNGReport(sheetCode, deviceCode, mRef);
                setReportNG(res ?? []);
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
        refresh: async () => await fetchListConfirmApprove(monthRef),
        monthRef,
        setMonthRef,
        // header
        fetchHeaderReport,
        reportHeader,
        setReportHeader,
        // data
        fetchReportData,
        reportData,
        setReportData,
        // ng
        fetchReportNG,
        reportNG,
        setReportNG,
    };
};
