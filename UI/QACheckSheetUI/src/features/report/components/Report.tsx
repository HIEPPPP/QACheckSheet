import React from "react";
import type { ReportData, ReportHeader, ReportNG } from "../types/report";

import ReportDataComponent from "./ReportDataComponent";
import ReportHeaderComponent from "./ReportHeaderComponent";
import ReportNgComponent from "./ReportNgComponent";
import ReportEvnComponent from "./ReportEnvComponent";

type Props = {
    monthRef?: string;
    reportHeader?: ReportHeader | null;
    reportData?: ReportData[] | null;
    reportNG?: ReportNG[] | null;
    fetchHeaderReport?: (
        sheetCode: string,
        deviceCode: string,
        monthRef: Date | string
    ) => Promise<ReportHeader | null>;
    refreshConfirmApprove?: () => Promise<void>;
};

const Report: React.FC<Props> = ({
    reportHeader,
    monthRef,
    reportData,
    reportNG,
    fetchHeaderReport,
    refreshConfirmApprove,
}) => {
    const daysInMonth = (() => {
        if (!monthRef) return 31;
        const s = String(monthRef).trim();

        // 1) match YYYY-MM or YYYY-M or YYYY-MM-DD (chấp nhận cả 2025-09 và 2025-09-01)
        const m = s.match(/^(\d{4})-(\d{1,2})(?:-\d{1,2})?$/);
        if (m) {
            const year = Number(m[1]);
            const month = Number(m[2]); // 1..12 expected
            if (
                Number.isFinite(year) &&
                Number.isFinite(month) &&
                month >= 1 &&
                month <= 12
            ) {
                // new Date(year, month, 0) => last day of that month
                return new Date(year, month, 0).getDate();
            }
            return 31;
        }

        // 2) fallback: thử parse như Date (ví dụ "2025/09" hoặc full date string)
        const dt = new Date(s);
        if (!isNaN(dt.getTime())) {
            // dt.getMonth() is 0-based -> +1 then use new Date(year, monthIndex+1, 0)
            return new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getDate();
        }

        // 3) nếu không parse được thì giữ fallback
        return 31;
    })();

    return (
        <div>
            {/* Header */}
            <ReportHeaderComponent
                reportHeader={reportHeader}
                monthRef={monthRef}
                fetchHeaderReport={fetchHeaderReport}
                refreshConfirmApprove={refreshConfirmApprove}
            />

            {/* Report Data */}
            <ReportDataComponent rows={reportData ?? []} days={daysInMonth} />

            {reportHeader?.deviceName === "Nhiệt độ - Độ ẩm" && (
                <ReportEvnComponent rows={reportData ?? []} />
            )}

            {/* Report NG */}
            <ReportNgComponent reportNG={reportNG} />
        </div>
    );
};

export default Report;
