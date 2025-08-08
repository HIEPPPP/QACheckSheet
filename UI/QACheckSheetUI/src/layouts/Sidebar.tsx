import React, { Fragment, useState } from "react";
import { NavLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";

import QAIcon from "../assets/img/assurance.png";
import { useMediaQuery, useTheme } from "@mui/material";
// ... import thêm icon tương ứng

interface MenuItem {
    label: string;
    path: string;
    Icon: React.ComponentType;
}

const menu: MenuItem[] = [
    { label: "Dashboard", path: "/dashboard", Icon: HomeIcon },
];

export const Sidebar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const theme = useTheme();
    const isTabletOrSmaller = useMediaQuery(theme.breakpoints.down("md"));
    const [isOpen, setIsOpen] = useState(!isTabletOrSmaller);

    return (
        <div
            className={`h-screen bg-[#F5F5F5] text-[#333] transition-all duration-200 flex flex-col shadow-lg ${
                isOpen ? "w-64" : "w-16"
            }`}
        >
            {/*Sidebar  */}
            {/* Logo + Title */}
            <div className="flex items-center p-4">
                <img
                    src={QAIcon}
                    alt="Logo"
                    className="w-8 h-8 cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                />
                <span
                    className={`text-xl font-bold ml-3 transition-all duration-300 overflow-hidden whitespace-nowrap cursor-pointer ${
                        isOpen ? "opacity-100" : "opacity-0"
                    }`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    Assurance
                </span>
            </div>
            <ul className="mt-4 space-y-2">
                {menu
                    // Lọc luôn những item không phải “Approve - Confirm” hoặc chỉ giữ “Approve - Confirm” khi có quyền
                    // .filter(
                    //     (item) =>
                    //         item.name !== "Approve - Confirm" ||
                    //         isConFirmerMonthORApprover ||
                    //         isAdmin
                    // )
                    .map(({ label, path, Icon }) => (
                        <li key={label}>
                            <NavLink
                                to={path}
                                className={({ isActive }) =>
                                    `flex items-center p-3 rounded-lg transition-all duration-300 ease-in-out ${
                                        isActive
                                            ? "bg-[#009DDC] text-white"
                                            : "hover:bg-[#E0E0E0] text-[#333]"
                                    }`
                                }
                            >
                                <div className="w-10 flex justify-center flex-shrink-0">
                                    <Icon />
                                </div>
                                <span
                                    className={`ml-2 transition-all duration-300 overflow-hidden whitespace-nowrap ${
                                        isOpen ? "opacity-100" : "opacity-0"
                                    }`}
                                >
                                    {label}
                                </span>
                            </NavLink>
                        </li>
                    ))}
            </ul>
        </div>
    );
};
