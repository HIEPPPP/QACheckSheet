import { useMemo, useState } from "react";
import type { Device } from "../../mstDevice/types/device";
import DeviceCard from "./DeviceCard";
import { useStatus } from "../../../contexts/StatusProvider";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

type DeviceProps = {
    devices: Device[];
    filter?: "All" | "Pending" | "OK" | "NG" | "Confirm";
};

export default function Devices({ devices, filter = "All" }: DeviceProps) {
    const { statusMap } = useStatus();
    const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>(
        {}
    );

    const matchesFilter = (device: Device) => {
        const entry = statusMap[Number(device.deviceId)];
        if (filter === "All") return true;
        if (filter === "Confirm") return !!entry?.confirmBy;
        const status = (entry?.status ?? "Pending").toString();
        if (filter === "OK") return status === "OK" && !entry?.confirmBy;
        if (filter === "NG") return status === "NG";
        return status === filter;
    };

    const filtered = useMemo(
        () => devices.filter(matchesFilter),
        [devices, filter, statusMap]
    );

    const groupedByArea = useMemo(() => {
        return filtered.reduce<Record<string, Device[]>>((acc, device) => {
            // normalize area: trim whitespace and remove hidden \r\n
            const raw = (device.area ?? "Unknown").toString();
            const area = raw.replace(/\s+/g, " ").trim() || "Unknown";
            if (!acc[area]) acc[area] = [];
            acc[area].push(device);
            return acc;
        }, {});
    }, [filtered]);

    const areaList = useMemo(
        () => Object.keys(groupedByArea).sort((a, b) => a.localeCompare(b)),
        [groupedByArea]
    );

    const toggle = (area: string) =>
        setCollapsedMap((s) => ({ ...s, [area]: !s[area] }));

    if (!devices || devices.length === 0) {
        return (
            <div className="w-full flex items-center justify-center py-20 text-gray-500">
                Không có thiết bị để hiển thị
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            {areaList.map((area) => {
                const list = groupedByArea[area];
                const isCollapsed = !!collapsedMap[area];

                return (
                    <section
                        key={area}
                        className="bg-white/5 rounded-2xl shadow-sm p-4 mt-8"
                        style={{ border: "1px solid rgba(255, 255, 255, 0.1)" }}
                    >
                        {/* header */}
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="text-lg text-blue-900 font-semibold leading-tight">
                                    {area}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {list.length} thiết bị
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    aria-expanded={!isCollapsed}
                                    onClick={() => toggle(area)}
                                    className="flex items-center gap-2 px-5 py-3 rounded-xl hover:bg-gray-200 focus:outline-none"
                                >
                                    {/* <span className="text-sm">
                                        {isCollapsed ? "Mở" : "Thu gọn"}
                                    </span> */}
                                    <motion.span
                                        animate={{
                                            rotate: isCollapsed ? 180 : 0,
                                        }}
                                        transition={{ duration: 0.28 }}
                                        className="inline-flex"
                                    >
                                        <ChevronDown size={18} />
                                    </motion.span>
                                </button>
                            </div>
                        </div>

                        {/* animated content */}
                        <AnimatePresence initial={false} mode="popLayout">
                            {!isCollapsed && (
                                <motion.div
                                    key="content"
                                    layout
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.28 }}
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                                        {list.map((device) => {
                                            const entry =
                                                statusMap[
                                                    Number(device.deviceId)
                                                ];
                                            const highlight =
                                                filter !== "All" &&
                                                (filter === "Confirm"
                                                    ? !!entry?.confirmBy
                                                    : (entry?.status ??
                                                          "Pending") ===
                                                      filter);

                                            return (
                                                <motion.div
                                                    key={device.deviceId}
                                                    layout
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    className="rounded-2xl"
                                                >
                                                    <DeviceCard
                                                        device={device}
                                                        highlight={highlight}
                                                        entry={entry}
                                                    />
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </section>
                );
            })}
        </div>
    );
}
