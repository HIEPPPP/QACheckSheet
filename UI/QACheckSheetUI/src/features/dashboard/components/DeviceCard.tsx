import React from "react";
import type { Device } from "../../mstDevice/types/device";
import { Tooltip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type DeviceProps = {
    device: Device;
    highlight?: boolean;
    entry?: {
        deviceId: number;
        deviceCode?: string;
        deviceName?: string;
        status?: "OK" | "NG" | "Pending";
        okCount?: number;
        ngCount?: number;
        pendingCount?: number;
        confirmBy?: string | null;
    } | null;
};

const DeviceCard: React.FC<DeviceProps> = ({
    device,
    highlight = false,
    entry = null,
}) => {
    const status = (entry?.status ?? "Pending").toString().toUpperCase();

    const renderStatusBadge = () => {
        if (status === "OK") {
            return (
                <Tooltip title="OK" placement="top" arrow>
                    <span className="absolute top-2 right-2 inline-flex items-center">
                        <span className="absolute inline-flex h-4 w-4 rounded-full animate-ping bg-green-400 opacity-60" />
                        <span className="relative inline-flex h-4 w-4 rounded-full bg-green-500" />
                    </span>
                </Tooltip>
            );
        }
        if (status === "NG") {
            return (
                <Tooltip title="NG" placement="top" arrow>
                    <span className="absolute top-2 right-2 inline-flex items-center">
                        <span className="absolute inline-flex h-4 w-4 rounded-full animate-ping bg-red-400 opacity-60" />
                        <span className="relative inline-flex h-4 w-4 rounded-full bg-red-500" />
                    </span>
                </Tooltip>
            );
        }
        return (
            <Tooltip title="Pending" placement="top" arrow>
                <span className="absolute top-2 right-2 inline-flex items-center">
                    <span className="absolute inline-flex h-4 w-4 rounded-full animate-ping bg-orange-400 opacity-60" />
                    <span className="relative inline-flex h-4 w-4 rounded-full bg-orange-500" />
                </span>
            </Tooltip>
        );
    };

    return (
        <div
            className={`relative bg-white rounded-lg px-3 py-3 w-full ${
                highlight ? "ring-2 ring-indigo-300" : ""
            }`}
        >
            {renderStatusBadge()}

            <div className="min-w-0">
                <div className="text-md font-bold text-gray-800 truncate">
                    {device.deviceCode}
                </div>
                <div className="mt-2 text-sm text-gray-500 truncate">
                    {device.deviceName}
                </div>
                {/* <div className="mt-1 text-sm text-gray-600 font-semibold truncate">
                    {device.location}
                </div> */}

                {device.description && (
                    <div className="mt-2 text-[11px] bg-amber-300 rounded text-gray-600 italic truncate">
                        "{device.description}"
                    </div>
                )}

                {entry?.confirmBy && (
                    <div className="mt-3 flex items-center gap-2">
                        <CheckCircleIcon
                            fontSize="small"
                            className="text-green-600"
                        />
                        <div className="text-xs text-gray-600">
                            Đã xác nhận bởi <strong>{entry.confirmBy}</strong>
                        </div>
                    </div>
                )}

                {/* OK: {entry.okCount} • NG: {entry.ngCount} • Pending:{" "}
                        {entry.pendingCount} */}
                {/* 
                {entry && (
                    <div className="mt-2 text-xs text-gray-400 pl-22 mt-3">
                        OK: {entry.okCount} • NG: {entry.ngCount}
                    </div>
                )} */}
            </div>
        </div>
    );
};

export default DeviceCard;
