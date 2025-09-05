// ReportPage.tsx
import React, { useState } from "react";
import ReportTable from "./components/ReportTable";
import Report from "./components/Report";
import { useReport } from "./hooks/useReport";
import type { ConfirmApproveResult, ReportHeader } from "./types/report";

const ReportPage: React.FC = () => {
    const {
        confirmApproveResults,
        loadingHeader,
        error,
        monthRef,
        setMonthRef,
        fetchHeaderReport,
    } = useReport();

    const [open, setOpen] = useState(false);
    const [reportHeader, setReportHeader] = useState<ReportHeader | null>(null);

    const handleViewSheet = async (row: ConfirmApproveResult) => {
        try {
            // await fetch and get the returned header
            const res = await fetchHeaderReport(
                row.sheetCode ?? "",
                row.deviceCode ?? "",
                monthRef
            );
            console.log("fetchHeaderReport returned:", res);
            if (res) {
                setReportHeader(res);
                setOpen(true);
            } else {
                // xử lý khi API trả null
                setReportHeader(null);
                // bạn có thể show toast / message ở đây
                console.warn("Không có header trả về từ API");
            }
        } catch (err: any) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <ReportTable
                confirmApproveResults={confirmApproveResults}
                onEdit={handleViewSheet}
                monthRef={monthRef}
                setMonthRef={setMonthRef}
            />
            {open && <Report reportHeader={reportHeader} monthRef={monthRef} />}
            {error && <div className="text-red-600">{error}</div>}
        </div>
    );
};

export default ReportPage;
