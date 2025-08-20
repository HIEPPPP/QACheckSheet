import React from "react";
import type { ReactNode } from "react";

type FilterDeviceProps = {
    title: string;
    value: string;
    icon: ReactNode;
    accent?: "orange" | "green" | "red" | "blue";
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
}) => {
    const accentCls = accentMap[accent] ?? accentMap.orange;

    return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-4">
                {/* icon box */}
                <div
                    className={`p-3 rounded-lg shrink-0 ${accentCls} flex items-center justify-center`}
                >
                    {/* icon inherits color from wrapper (currentColor) */}
                    <div className="h-6 w-6">{icon}</div>
                </div>

                {/* text */}
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
