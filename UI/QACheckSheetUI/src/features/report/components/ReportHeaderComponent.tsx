// ReportHeaderComponent.tsx
import React, { useContext, useState } from "react";
import type {
    CreateConfirm,
    ReportHeader,
    UpdateApprove,
} from "../types/report";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PanoramaFishEyeRoundedIcon from "@mui/icons-material/PanoramaFishEyeRounded";
import { Button, type AlertColor } from "@mui/material";
import { UserContext } from "../../../contexts/UserProvider";
import { vnTime } from "../../../utils/formatDateTime";
import { createConfirm, updateApprove } from "../services/report.service";
import Notification from "../../../shared/components/Notification";

type ReportHeaderProps = {
    reportHeader?: ReportHeader | null;
    monthRef?: string;
    fetchHeaderReport?: (
        sheetCode: string,
        deviceCode: string,
        monthRef: Date | string
    ) => Promise<ReportHeader | null>;
    refreshConfirmApprove?: () => Promise<void>;
};

const formatMonthYear = (monthRef?: string) => {
    if (!monthRef) return { month: "--", year: "--" };
    const s = monthRef.substring(0, 7); // "YYYY-MM"
    const [y, m] = s.split("-");
    return { month: m ?? "--", year: y ?? "--" };
};

const ReportHeaderComponent: React.FC<ReportHeaderProps> = ({
    reportHeader,
    monthRef,
    fetchHeaderReport,
    refreshConfirmApprove,
}) => {
    const { month, year } = formatMonthYear(monthRef ?? "");
    const { user } = useContext(UserContext);

    // Snackbar state
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: AlertColor;
    }>({
        open: false,
        message: "",
        severity: "success",
    });

    // Quyền xác nhận, phê duyệt
    const isConfirmerMonth = String(user?.roles).includes("Leader");
    const s = String(user?.roles ?? "").toLowerCase();
    const isApprover = ["staff", "assistant", "manager"].some((r) =>
        s.includes(r)
    );

    const isConfirmedMonth = Boolean(reportHeader?.confirmedBy);
    const isApproved = Boolean(reportHeader?.approvedBy);

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(
        now.getMonth() + 1
    ).padStart(2, "0")}`;

    const isAfterMonthRef = (() => {
        if (!monthRef) return false;
        const currentDate = new Date(`${currentMonth}-01`);
        const targetDate = new Date(monthRef);
        return currentDate > targetDate;
    })();

    // const canConfirmMonth = isConfirmerMonth && !isConfirmedMonth;
    // const canApprove = isApprover && isConfirmedMonth && !isApproved;

    const canConfirmMonth =
        isConfirmerMonth && !isConfirmedMonth && isAfterMonthRef;
    const canApprove =
        isApprover && isConfirmedMonth && isAfterMonthRef && !isApproved;

    const frequency =
        reportHeader?.frequencyOverride ??
        reportHeader?.defaultFrequency ??
        null;

    const handleConfirmedMonth = async () => {
        try {
            const payload: CreateConfirm = {
                confirmedBy: user?.userCode ?? "Unknown",
                confirmedDate: new Date(vnTime).toISOString(),
                sheetCode: reportHeader?.sheetCode ?? "",
                deviceCode: reportHeader?.deviceCode ?? "",
            };

            const res = await createConfirm(payload);

            if (res != null) {
                await fetchHeaderReport?.(
                    reportHeader?.sheetCode ?? "",
                    reportHeader?.deviceCode ?? "",
                    monthRef ?? ""
                );
                await refreshConfirmApprove?.();

                // show success snackbar
                setSnackbar({
                    open: true,
                    message: "Xác nhận thành công",
                    severity: "success",
                });
            } else {
                setSnackbar({
                    open: true,
                    message: "Xác nhận thành công",
                    severity: "error",
                });
            }
        } catch (error: any) {
            console.error("createConfirm error:", error);
        }
    };

    const handleApprove = async () => {
        try {
            const payload: UpdateApprove = {
                confirmApproveId: reportHeader?.confirmApproveId ?? 0,
                approvedBy: user?.userCode ?? "Unknown",
                approvedDate: new Date(vnTime).toISOString(),
            };
            const res = await updateApprove(
                reportHeader?.confirmApproveId ?? 0,
                payload
            );
            if (res != null) {
                await fetchHeaderReport?.(
                    reportHeader?.sheetCode ?? "",
                    reportHeader?.deviceCode ?? "",
                    monthRef ?? ""
                );
                await refreshConfirmApprove?.();

                // show success snackbar
                setSnackbar({
                    open: true,
                    message: "Phê duyệt thành công",
                    severity: "success",
                });
            } else {
                setSnackbar({
                    open: true,
                    message: "Phê duyệt thất bại",
                    severity: "error",
                });
            }
        } catch (error: any) {
            console.error("createConfirm error:", error);
        }
    };

    return (
        <div className="max-w-full mx-auto">
            {/* Button Confirm, Approve */}
            <div className="flex gap-4 justify-end mb-6">
                <Button
                    variant="outlined"
                    onClick={handleConfirmedMonth}
                    disabled={!canConfirmMonth}
                >
                    Xác nhận
                </Button>
                <Button
                    variant="contained"
                    onClick={handleApprove}
                    disabled={!canApprove}
                >
                    Phê duyệt
                </Button>
            </div>
            <div className="text-xs text-gray-400 flex-shrink-0">
                {reportHeader?.formNO}
            </div>
            {/* Title Check Sheet */}
            <div className="flex items-start justify-between mb-2">
                <h2 className="text-xl font-semibold text-center underline flex-1">
                    {reportHeader?.sheetName}
                </h2>

                <div className="text-sm text-right min-w-[180px] flex-shrink-0 space-x-2">
                    <span className="whitespace-nowrap">
                        Tháng: <span className="font-semibold">{month}</span>
                    </span>
                    <span className="whitespace-nowrap">
                        Năm: <span className="font-semibold">{year}</span>
                    </span>
                </div>
            </div>

            {/* wrapper có scroll ngang */}
            <div className="mt-3 border border-gray-600 overflow-x-auto">
                {/* inner grid ... (giữ nguyên phần layout cũ) */}
                <div className="w-full grid grid-cols-[minmax(200px,1fr)_minmax(200px,1fr)_minmax(150px,1fr)_2fr_minmax(150px,1fr)_minmax(150px,1fr)] items-center">
                    {/* header row */}
                    <div className="border-r border-b p-2 font-semibold text-sm text-center whitespace-nowrap">
                        Bộ phận thành lập
                    </div>
                    <div className="border-r border-b p-2 font-semibold text-sm text-center whitespace-nowrap">
                        Tên thiết bị
                    </div>
                    <div className="border-r border-b p-2 font-semibold text-sm text-center whitespace-nowrap">
                        Tần suất kiểm tra
                    </div>
                    <div className="border-r border-b p-2 font-semibold text-sm text-center whitespace-nowrap">
                        Bảng hướng dẫn kiểm tra
                    </div>
                    <div className="border-r border-b p-2 font-semibold text-sm text-center whitespace-nowrap">
                        Phê duyệt
                    </div>
                    <div className="border-b p-2 font-semibold text-sm text-center whitespace-nowrap">
                        Xác nhận
                    </div>

                    {/* data row */}
                    <div className="border-r p-2 text-sm font-semibold text-center h-20 flex items-center justify-center whitespace-nowrap">
                        Quản lý chất lượng
                    </div>

                    <div className="border-r p-2 text-sm font-semibold text-center h-20 flex items-center justify-center whitespace-nowrap">
                        <div className="font-semibold">
                            {reportHeader?.deviceName ?? "—"}
                        </div>
                    </div>

                    <div className="border-r p-2 text-sm font-semibold text-center h-20 flex items-center justify-center whitespace-nowrap">
                        {frequency != null ? (
                            <div className="flex flex-col items-center">
                                <div className="whitespace-nowrap">{`${frequency} lần / ngày`}</div>
                                {reportHeader?.frequencyOverride != null && (
                                    <div className="text-xs text-gray-600">
                                        (Override)
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="whitespace-nowrap">—</div>
                        )}
                    </div>

                    <div className="border-r p-2 text-center h-20 flex items-center justify-center min-w-[400px]">
                        <div className="grid grid-cols-2 grid-rows-2 gap-1 text-xs">
                            <div className="flex items-center gap-1 whitespace-nowrap">
                                <span className="font-semibold">
                                    Không có bất thường
                                </span>
                                <CheckIcon fontSize="small" />
                            </div>
                            <div className="flex items-center gap-1 whitespace-nowrap">
                                <span className="font-semibold">
                                    Bất thường / Yêu cầu xử lý
                                </span>
                                <CloseIcon fontSize="small" />
                            </div>
                            <div className="flex items-center gap-1 whitespace-nowrap">
                                <span className="font-semibold">Xử lý</span>
                                <PanoramaFishEyeRoundedIcon fontSize="small" />
                            </div>
                            <div className="flex items-center gap-1 whitespace-nowrap">
                                <span className="font-semibold">
                                    Không sử dụng
                                </span>
                                <span className="text-lg">/</span>
                            </div>
                        </div>
                    </div>

                    <div className="border-r p-2 flex flex-col h-20 justify-center items-center text-sm whitespace-nowrap">
                        <div className="w-full h-12 border border-gray-300 flex items-center justify-center">
                            {reportHeader?.approvedBy ? (
                                <strong className="text-sm">
                                    {reportHeader.approvedBy}
                                </strong>
                            ) : (
                                <div className="text-xs text-gray-400">
                                    Chưa ký
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-2 flex flex-col h-20 justify-center items-center text-sm whitespace-nowrap">
                        <div className="w-full h-12 border border-gray-300 flex items-center justify-center">
                            {reportHeader?.confirmedBy ? (
                                <strong className="text-sm">
                                    {reportHeader.confirmedBy}
                                </strong>
                            ) : (
                                <div className="text-xs text-gray-400">
                                    Chưa ký
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Snackbar */}
            <Notification
                {...snackbar}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
        </div>
    );
};

export default ReportHeaderComponent;
