// ReportPage.tsx
import React, { useState } from "react";
import ReportTable from "./components/ReportTable";
import Report from "./components/Report";
import { useReport } from "./hooks/useReport";
import type { ConfirmApproveResult } from "./types/report";
import { ArticleRounded } from "@mui/icons-material";

const ReportPage: React.FC = () => {
    const {
        confirmApproveResults,
        refresh: refreshConfirmApprove,
        error,
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
    } = useReport();

    const [open, setOpen] = useState(false);

    const handleViewSheet = async (row: ConfirmApproveResult) => {
        try {
            const [headerData, reportData] = await Promise.all([
                fetchHeaderReport(
                    row.sheetCode ?? "",
                    row.deviceCode ?? "",
                    monthRef
                ),
                fetchReportData(
                    row.sheetCode ?? "",
                    row.deviceCode ?? "",
                    monthRef
                ),
                fetchReportNG(
                    row.sheetCode ?? "",
                    row.deviceCode ?? "",
                    monthRef
                ),
            ]);

            if (headerData || reportData) {
                setOpen(true);
            } else {
                // xử lý khi API trả null
                setReportHeader(null);
                setReportData([]);
                setReportNG([]);
                // setOpen(false);
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
                setOpen={setOpen}
            />
            {open ? (
                <Report
                    reportHeader={reportHeader}
                    fetchHeaderReport={fetchHeaderReport}
                    refreshConfirmApprove={refreshConfirmApprove}
                    monthRef={monthRef}
                    reportData={reportData}
                    reportNG={reportNG}
                />
            ) : (
                <div className="flex justify-center items-center h-185 text-gray-400 border rounded-sm bg-white p-10 shadow-xl">
                    <ArticleRounded
                        style={{ fontSize: 250, color: "#2196F3" }}
                    />
                </div>
            )}
            {error && <div className="text-red-600">{error}</div>}
        </div>
    );
};

export default ReportPage;
