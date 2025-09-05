import React from "react";
import type { ReportHeader } from "../types/report";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PanoramaFishEyeRoundedIcon from "@mui/icons-material/PanoramaFishEyeRounded";

type Props = {
    reportHeader?: ReportHeader | null;
    monthRef?: string;
};

const formatMonthYear = (monthRef?: string) => {
    if (!monthRef) return { month: "--", year: "--" };
    const s = monthRef.substring(0, 7); // "YYYY-MM"
    const [y, m] = s.split("-");
    return { month: m ?? "--", year: y ?? "--" };
};

const Report: React.FC<Props> = ({ reportHeader, monthRef }) => {
    const { month, year } = formatMonthYear(monthRef ?? "");

    const frequency =
        reportHeader?.frequencyOverride ??
        reportHeader?.defaultFrequency ??
        null;

    return (
        <div>
            {/* Header */}
            <div className="max-w-full mx-auto">
                <div className="flex items-start justify-between mb-2">
                    <div className="min-w-[150px] flex-shrink-0"></div>

                    <h2 className="text-xl font-semibold text-center underline flex-1">
                        {reportHeader?.sheetName}
                    </h2>

                    <div className="text-sm text-right min-w-[180px] flex-shrink-0 space-x-2">
                        <span className="whitespace-nowrap">
                            Tháng:{" "}
                            <span className="font-semibold">{month}</span>
                        </span>
                        <span className="whitespace-nowrap">
                            Năm: <span className="font-semibold">{year}</span>
                        </span>
                    </div>
                </div>

                {/* wrapper có scroll ngang */}
                <div className="mt-3 border border-black overflow-x-auto">
                    {/* inner grid là inline-grid với min-width => sẽ tạo scroll ngang thay vì wrap */}
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
                                    {reportHeader?.frequencyOverride !=
                                        null && (
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
                                    <div className="text-sm">
                                        {reportHeader.approvedBy}
                                    </div>
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
                                    <div className="text-sm">
                                        {reportHeader.confirmedBy}
                                    </div>
                                ) : (
                                    <div className="text-xs text-gray-400">
                                        Chưa ký
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Report Data */}

            {/* NG Table */}
        </div>
    );
};

export default Report;
