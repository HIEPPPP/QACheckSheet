import React from "react";
import type { Device } from "../../mstDevice/types/device";
import DeviceCard from "./DeviceCard";
import { useStatus } from "../../../contexts/StatusProvider";

type DeviceProps = {
    devices: Device[];
    filter?: "All" | "Pending" | "OK" | "NG" | "Confirm";
};

const Devices: React.FC<DeviceProps> = ({ devices, filter = "All" }) => {
    const { statusMap } = useStatus();

    const matchesFilter = (device: Device) => {
        const entry = statusMap[Number(device.deviceId)];
        // nếu filter All -> hiển tất cả
        if (filter === "All") return true;
        if (filter === "Confirm") {
            return !!entry?.confirmBy;
        }
        // Pending / OK / NG: treat missing entry as Pending
        const status = (entry?.status ?? "Pending").toString();
        return status === filter;
    };

    const filtered = devices.filter(matchesFilter);

    return (
        <div className="flex flex-wrap justify-center gap-4 mt-10 w-full ">
            {filtered.map((device) => {
                const entry = statusMap[Number(device.deviceId)];
                const highlight =
                    filter !== "All" &&
                    (filter === "Confirm"
                        ? !!entry?.confirmBy
                        : (entry?.status ?? "Pending") === filter);

                return (
                    <div key={device.deviceId} className="w-full sm:w-51">
                        <DeviceCard
                            device={device}
                            highlight={highlight}
                            entry={entry}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default Devices;
