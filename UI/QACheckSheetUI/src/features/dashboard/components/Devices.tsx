import React from "react";
import type { Device } from "../../mstDevice/types/device";
import DeviceCard from "./DeviceCard";

type DeviceProps = {
    devices: Device[];
};

const Devices: React.FC<DeviceProps> = ({ devices }) => {
    return (
        <div className="flex flex-wrap gap-4 mt-10">
            {devices.map((device) => (
                <div key={device.deviceId} className="w-full sm:w-51">
                    <DeviceCard device={device} />
                </div>
            ))}
        </div>
    );
};

export default Devices;
