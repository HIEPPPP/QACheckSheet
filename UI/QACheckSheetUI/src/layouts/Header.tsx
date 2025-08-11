// Header.tsx
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SettingsIcon from "@mui/icons-material/Settings";

type TitleMap = Record<string, string>;

/**
 * map routes -> friendly title.
 * Bạn có thể mở rộng hoặc import từ menu config của Sidebar nếu muốn đồng bộ.
 */
const TITLE_MAP: TitleMap = {
    "/": "Welcome",
    "/dashboard": "Welcome",
    "/products": "Products",
    "/products/list": "Products / List",
    "/products/grid": "Products / Grid",
    "/products/details": "Products / Details",
    "/products/edit": "Products / Edit",
    "/products/create": "Products / Create",
    "/inventory": "Inventory",
    "/inventory/stocks": "Inventory / Stocks",
    "/settings": "Settings",
};

const getTitleFromPath = (path: string) => {
    // tìm chính xác, nếu không có thì thử match theo segment lớn nhất
    if (TITLE_MAP[path]) return TITLE_MAP[path];

    // fallback: lấy các đoạn path và thử dần từ dài -> ngắn
    const parts = path.split("/").filter(Boolean);
    for (let i = parts.length; i > 0; i--) {
        const tryPath = "/" + parts.slice(0, i).join("/");
        if (TITLE_MAP[tryPath]) return TITLE_MAP[tryPath];
    }

    // mặc định: chuyển segment đầu thành Title Case
    const first = parts[0];
    if (!first) return "Welcome";
    return first.charAt(0).toUpperCase() + first.slice(1);
};

export const Header: React.FC = () => {
    const location = useLocation();

    const title = useMemo(
        () => getTitleFromPath(location.pathname),
        [location.pathname]
    );

    return (
        <header className="w-full px-6 py-10 flex items-center justify-between">
            <div className="relative w-full max-w-md mx-auto">
                <input
                    type="text"
                    placeholder="Tìm kiếm thiết bị..."
                    className="w-[380px] py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-700"
                    // onChange={handleInputChange}
                    // value={value}
                />
                {/* <FiSearch
                    className="absolute left-3 top-2.5 text-gray-500"
                    size={18}
                /> */}
            </div>
            <div>
                {/* big title */}
                <h1 className="text-sm md:text-xl font-semibold text-[#313b5e]">
                    {title.toUpperCase()}!
                </h1>
            </div>

            <div className="flex items-center gap-4">
                {/* user avatar */}
                <div className="flex items-center gap-2 ml-2">
                    <img
                        src="https://i.pravatar.cc/40"
                        alt="avatar"
                        className="w-9 h-9 rounded-full object-cover border"
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
