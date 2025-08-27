import React, { Fragment, useState } from "react";
import { NavLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";

import QAIcon from "../assets/img/assurance.png";
import { useMediaQuery, useTheme } from "@mui/material";

const isAdmin = true;
interface MenuItem {
    label: string;
    path: string;
    Icon: React.ComponentType;
}

const menu: MenuItem[] = [
    { label: "Dashboard", path: "/app/dashboard", Icon: HomeIcon },
    { label: "Report", path: "/app/report", Icon: HomeIcon },
    { label: "NG-Detail", path: "/app/ng", Icon: HomeIcon },
];

const admin: MenuItem[] = [
    { label: "Type", path: "/app/deviceType", Icon: HomeIcon },
    { label: "Device", path: "/app/device", Icon: HomeIcon },
    { label: "Template", path: "/app/sheet", Icon: HomeIcon },
    { label: "Content", path: "/app/item", Icon: HomeIcon },
    {
        label: "Relations   ",
        path: "/app/typeSheet",
        Icon: HomeIcon,
    },
    { label: "Users", path: "/app/users", Icon: HomeIcon },
];

export const Sidebar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const theme = useTheme();
    const isTabletOrSmaller = useMediaQuery(theme.breakpoints.down("md"));
    const [isOpen, setIsOpen] = useState(!isTabletOrSmaller);

    return (
        <div
            className={`h-screen bg-[#f8f5f1] text-[#333] transition-all duration-200 flex flex-col border-r-0 border-solid border-[#eaedf1] shadow-[inset_-8px_0px_8px_-8px_rgba(134,110,110,0.25)] ${
                isOpen ? "w-54" : "w-16"
            }`}
        >
            {/*Sidebar  */}
            {/* Logo + Title */}
            <div className="flex items-center p-4 mt-6">
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
            <ul className="mt-4">
                <li
                    className={`text-[11px] text-[#797b97] pl-[25px] py-[8px] font-bold ${
                        isOpen ? "opacity-60" : "opacity-0"
                    }`}
                >
                    GENERAL
                </li>
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
            {isAdmin && (
                <ul className="space-y-2 mt-8">
                    <li
                        className={`text-[11px] text-[#797b97] pl-[25px] font-bold ${
                            isOpen ? "opacity-60" : "opacity-0"
                        }`}
                    >
                        ADMIN
                    </li>
                    {admin.map(({ label, path, Icon }) => (
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
                                    {<Icon />}
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
            )}
        </div>
    );
};
