import React, { useRef, useState } from "react";
import type { Device } from "../../mstDevice/types/device";
import { Popover, Button, Tooltip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

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

type Status = "OK" | "NG" | "Pending";

const styleMap: Record<
    Status,
    { color: string; anim: string; icon: React.ReactNode | null }
> = {
    OK: { color: "bg-green-500", anim: "animate-pulse", icon: null },
    NG: { color: "bg-red-500", anim: "animate-pulse", icon: null },
    Pending: { color: "bg-amber-500", anim: "animate-pulse", icon: null },
};

function normalizeStatus(s: unknown): Status {
    if (!s) return "Pending";
    const str = String(s).trim().toUpperCase();
    if (str === "OK") return "OK";
    if (str === "NG") return "NG";
    // support "PENDING" or any other value -> Pending
    return "Pending";
}

export default function DeviceCard({
    device,
    highlight = false,
    entry = null,
}: DeviceProps) {
    // Normalize and type as Status so styleMap[status] is type-safe
    const status: Status = normalizeStatus(entry?.status);

    const { color, anim, icon } = styleMap[status];

    // detect touch device (safe for SSR) — optional if you need later
    // const [isTouch, setIsTouch] = useState(false);
    // useEffect(() => {
    //     if (typeof window === "undefined") return;
    //     setIsTouch(
    //         "ontouchstart" in window || (navigator.maxTouchPoints ?? 0) > 0
    //     );
    // }, []);

    // Popover anchored to the card (click anywhere to open)
    const cardRef = useRef<HTMLDivElement | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);
    const id = open ? "device-popover" : undefined;

    const openInfo = (target?: HTMLElement | null) => {
        setAnchorEl(target ?? cardRef.current);
    };
    const closeInfo = () => setAnchorEl(null);

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openInfo(cardRef.current);
        }
    };

    const renderStatusBadge = () => {
        const base = "absolute top-2 right-2 inline-flex items-center";
        if (status === "OK") {
            return (
                <Tooltip title="OK" placement="top" arrow>
                    <span className={base}>
                        <span className="absolute inline-flex h-4 w-4 rounded-full animate-ping bg-green-400 opacity-60" />
                        <span className="relative inline-flex h-4 w-4 rounded-full bg-green-500" />
                    </span>
                </Tooltip>
            );
        }
        if (status === "NG") {
            return (
                <Tooltip title="NG" placement="top" arrow>
                    <span className={base}>
                        <span className="absolute inline-flex h-4 w-4 rounded-full animate-ping bg-red-400 opacity-60" />
                        <span className="relative inline-flex h-4 w-4 rounded-full bg-red-500" />
                    </span>
                </Tooltip>
            );
        }
        return (
            <Tooltip title="Pending" placement="top" arrow>
                <span className={base}>
                    <span className="absolute inline-flex h-4 w-4 rounded-full animate-ping bg-orange-400 opacity-60" />
                    <span className="relative inline-flex h-4 w-4 rounded-full bg-orange-500" />
                </span>
            </Tooltip>
        );
    };

    return (
        <>
            <div
                ref={cardRef}
                role="button"
                tabIndex={0}
                onClick={() => openInfo(cardRef.current)}
                onKeyDown={onKeyDown}
                className={`relative bg-white rounded-lg px-3 py-3 w-full antialiased cursor-pointer select-none focus:outline-none focus:ring-2 ${
                    highlight ? "ring-2 ring-indigo-300" : ""
                }`}
                aria-label={`Device ${device.deviceCode}`}
                aria-describedby={id}
            >
                {renderStatusBadge()}

                {/* Important: this container must allow child to shrink -> min-w-0 */}
                <div className="min-w-0 flex">
                    {/* flex-1 + min-w-0 lets the text truncate */}
                    <div className="flex-1 min-w-0">
                        <div className="text-md font-bold text-gray-800 truncate">
                            {device.deviceCode}
                        </div>
                        <div className="mt-2 text-sm text-gray-500 truncate block max-w-full">
                            {device.deviceName}
                        </div>

                        {device.description && (
                            <div className="mt-2">
                                <div className="text-[11px] bg-amber-100 rounded px-2 py-1 text-gray-700 italic truncate block max-w-full">
                                    {`"${device.description}"`}
                                </div>
                            </div>
                        )}

                        {entry?.confirmBy && (
                            <div className="mt-3 flex items-center gap-2">
                                <CheckCircleIcon
                                    fontSize="small"
                                    className="text-green-600"
                                />
                                <div className="text-xs text-gray-600">
                                    Đã xác nhận bởi{" "}
                                    <strong>{entry.confirmBy}</strong>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Popover anchored to card */}
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={closeInfo}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                PaperProps={{ className: "max-w-xs" }}
            >
                <div className="p-3">
                    <div className="text-sm font-semibold text-gray-800">
                        {device.deviceName}
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                        Vị trí: {device.location ?? "-"}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                        Model: {device.model ?? "-"}
                    </div>
                    {device.description && (
                        <div className="mt-2 text-xs p-1 text-gray-600 rounded-sm bg-amber-100 ">
                            {device.description}
                        </div>
                    )}

                    <div className="text-xs text-gray-500 mt-3 flex items-center">
                        {/* <span className="">Trạng thái:</span> */}
                        {entry?.confirmBy ? (
                            <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-white text-xs font-medium bg-green-600 animate-pulse`}
                            >
                                Confirmed
                            </span>
                        ) : (
                            <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-white text-xs font-medium ${color} ${anim}`}
                            >
                                {icon}
                                <span>{status}</span>
                            </span>
                        )}
                    </div>

                    <div className="mt-3 flex justify-end">
                        <Button
                            variant="outlined"
                            color="info"
                            onClick={closeInfo}
                            size="small"
                        >
                            Đóng
                        </Button>
                    </div>
                </div>
            </Popover>
        </>
    );
}
