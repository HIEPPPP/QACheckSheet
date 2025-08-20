// Header.tsx
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import {
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Typography,
    Box,
} from "@mui/material";
import {
    FiUser,
    FiMail,
    FiList,
    FiHelpCircle,
    FiLock,
    FiLogOut,
} from "react-icons/fi";
import { clearAuthData } from "../shared/services/auth.service";

type TitleMap = Record<string, string>;

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
    if (TITLE_MAP[path]) return TITLE_MAP[path];
    const parts = path.split("/").filter(Boolean);
    for (let i = parts.length; i > 0; i--) {
        const tryPath = "/" + parts.slice(0, i).join("/");
        if (TITLE_MAP[tryPath]) return TITLE_MAP[tryPath];
    }
    const first = parts[0] || "";
    return first ? first.charAt(0).toUpperCase() + first.slice(1) : "Welcome";
};

export const Header: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const title = useMemo(
        () => getTitleFromPath(location.pathname),
        [location.pathname]
    );

    // Avatar menu state
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) =>
        setAnchorEl(e.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);

    const handleNavigate = (path: string) => {
        handleCloseMenu();
        navigate(path);
    };

    const handleLogout = () => {
        clearAuthData();
        handleCloseMenu();
        navigate("/login");
        window.location.reload();
    };

    const fullName = "Gaston";
    const username = "gaston@example.com";

    return (
        <header className="w-full px-6 py-10 flex items-center justify-between">
            <div>
                <h1 className="text-sm md:text-xl font-semibold text-[#5d7186]">
                    {title.toUpperCase()}!
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative w-full max-w-md mx-auto">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-[380px] py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-700"
                    />
                    {/* optional icon inside input */}
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <SearchIcon fontSize="small" />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Avatar + menu */}
                    <div className="flex items-center gap-2 ml-2">
                        <div
                            onClick={handleOpenMenu}
                            className="cursor-pointer flex items-center"
                        >
                            <Avatar
                                sx={{ bgcolor: "primary.main" }}
                                className="w-8 h-8 rounded-full mr-2"
                            >
                                {fullName?.charAt(0).toUpperCase() || "H"}
                            </Avatar>
                        </div>

                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleCloseMenu}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            PaperProps={{ sx: { minWidth: 220, mt: 1 } }}
                        >
                            <Box sx={{ px: 2, py: 1 }}>
                                <Typography variant="subtitle2" noWrap>
                                    Welcome
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                    noWrap
                                >
                                    {username}
                                </Typography>
                            </Box>

                            <Divider />

                            <MenuItem
                                onClick={() => handleNavigate("/profile")}
                            >
                                <ListItemIcon>
                                    <FiUser size={16} />
                                </ListItemIcon>
                                <ListItemText>Profile</ListItemText>
                            </MenuItem>

                            {/* <MenuItem
                                onClick={() => handleNavigate("/messages")}
                            >
                                <ListItemIcon>
                                    <FiMail size={16} />
                                </ListItemIcon>
                                <ListItemText>Messages</ListItemText>
                            </MenuItem>

                            <MenuItem
                                onClick={() => handleNavigate("/pricing")}
                            >
                                <ListItemIcon>
                                    <FiList size={16} />
                                </ListItemIcon>
                                <ListItemText>Pricing</ListItemText>
                            </MenuItem>

                            <MenuItem onClick={() => handleNavigate("/help")}>
                                <ListItemIcon>
                                    <FiHelpCircle size={16} />
                                </ListItemIcon>
                                <ListItemText>Help</ListItemText>
                            </MenuItem> */}
                            {/* 
                            <MenuItem
                                onClick={() => {
                                    handleCloseMenu();
                                    navigate("/lock");
                                }}
                            >
                                <ListItemIcon>
                                    <FiLock size={16} />
                                </ListItemIcon>
                                <ListItemText>Lock screen</ListItemText>
                            </MenuItem> */}

                            <Divider />

                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <FiLogOut size={16} />
                                </ListItemIcon>
                                <ListItemText>
                                    <span className="text-red-600">Logout</span>
                                </ListItemText>
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
