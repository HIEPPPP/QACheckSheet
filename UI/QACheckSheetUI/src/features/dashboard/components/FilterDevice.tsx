import React from "react";
import type { ReactNode } from "react";

type FilterDeviceProps = {
    title: string;
    value: string;
    icon: ReactNode;
    accent?: "orange" | "green" | "red" | "blue";
    onClick?: () => void;
    active?: boolean;
};

const accentMap: Record<string, string> = {
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
    red: "bg-rose-100 text-rose-600",
    blue: "bg-sky-100 text-sky-600",
};

const FilterDevice: React.FC<FilterDeviceProps> = ({
    title,
    value,
    icon,
    accent = "orange",
    onClick,
    active = false,
}) => {
    const accentCls = accentMap[accent] ?? accentMap.orange;
    return (
        <div
            // clickable, hiển thị active state
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onClick?.();
            }}
            className={`cursor-pointer bg-white rounded-xl shadow-sm p-4 transform transition-all
                ${
                    active
                        ? "scale-105 ring-2 ring-indigo-200 ring-indigo-300"
                        : "hover:shadow-md"
                }`}
        >
            <div className="flex items-center gap-4">
                <div
                    className={`p-3 rounded-lg shrink-0 ${accentCls} flex items-center justify-center`}
                >
                    <div className="h-6 w-6">{icon}</div>
                </div>

                <div className="min-w-0">
                    <div className="text-xs text-gray-500 truncate">
                        {title}
                    </div>
                    <div className="text-2xl font-semibold text-gray-800 truncate">
                        {value}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterDevice;
