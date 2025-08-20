import React from "react";
import type { Device } from "../../mstDevice/types/device";
import { Tooltip } from "@mui/material";

type DeviceProps = {
    device: Device;
};

const DeviceCard: React.FC<DeviceProps> = ({ device }) => {
    return (
        <div className="relative bg-white rounded-lg border border-gray-100 shadow-sm px-3 py-3 w-full">
            {/* content chính */}
            <div className="min-w-0">
                <div className="text-md font-bold text-gray-800 truncate">
                    {device.deviceCode}
                </div>
                <div className="mt-2 text-sm text-gray-500 truncate">
                    {device.deviceName}
                </div>
            </div>

            <Tooltip title="Pending" placement="top" arrow>
                <span className="absolute top-2 right-2 inline-flex items-center">
                    <span className="absolute inline-flex h-4 w-4 rounded-full animate-ping bg-green-400 opacity-60" />
                    <span className="relative inline-flex h-4 w-4 rounded-full bg-green-500" />
                </span>
            </Tooltip>
        </div>
    );
};

export default DeviceCard;
