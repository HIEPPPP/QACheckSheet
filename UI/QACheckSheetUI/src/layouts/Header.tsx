// Header.tsx
import React, { useContext, useMemo, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Typed from "typed.js";
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
import { UserContext } from "../contexts/UserProvider";

type TitleMap = Record<string, string>;

const TITLE_MAP: TitleMap = {
    "/app": "Welcome",
    "/app/dashboard": "Welcome",
};

const getTitleFromPath = (path: string): string => {
    // 1. lookup exact path
    if (TITLE_MAP[path]) return TITLE_MAP[path];

    // 2. split và lấy segment cuối (lọc empty để tránh lỗi với trailing slash)
    const parts = path.split("/").filter(Boolean); // ["app","profile"]
    const last = parts.length ? parts[parts.length - 1] : "";

    // 3. chuyển thành Title Case hoặc "Welcome" nếu rỗng
    return last ? last.replace(/^\w/, (c) => c.toUpperCase()) : "Welcome";
};

export const Header: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const title = useMemo(
        () => getTitleFromPath(location.pathname),
        [location.pathname]
    );

    const { user } = useContext(UserContext);

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

    const el = useRef<HTMLSpanElement | null>(null);
    const typedRef = useRef<Typed | null>(null);

    useEffect(() => {
        // đảm bảo có user và element
        if (!user || !el.current) return;

        // chuẩn hoá strings -> loại bỏ null/undefined và ép về string
        const strings = [
            user.fullName,
            user.userCode,
            Array.isArray(user.roles)
                ? user.roles.join(", ")
                : typeof user.roles === "string"
                ? user.roles
                : user.roles
                ? JSON.stringify(user.roles)
                : undefined,
        ]
            .filter(Boolean)
            .map((s) => String(s));

        if (strings.length === 0) return;

        // destroy instance cũ nếu có (tránh leak / hành vi lạ)
        if (typedRef.current) {
            typedRef.current.destroy();
            typedRef.current = null;
        }

        // tạo Typed mới (đảm bảo el.current non-null bằng if ở trên)
        typedRef.current = new Typed(el.current, {
            strings,
            typeSpeed: 50,
            backSpeed: 30,
            loop: true,
            backDelay: 8000,
            smartBackspace: true,
            showCursor: false,
        });

        return () => {
            typedRef.current?.destroy();
            typedRef.current = null;
        };
    }, [user]);

    return (
        <header className="w-full px-6 py-10 flex items-center justify-between">
            <div className="">
                <h1 className="text-sm md:text-xl font-semibold text-[#5d7186]">
                    {title.toUpperCase()}!
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative w-full max-w-md mx-auto">
                    <h1 className="text-sm md:text-lg font-semibold text-[#5d7186]">
                        <span ref={el} />
                    </h1>
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
                                {user?.fullName?.charAt(0).toUpperCase()}
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
                                    {user?.fullName} - {user?.userCode}
                                </Typography>
                            </Box>

                            <Divider />

                            <MenuItem
                                onClick={() => handleNavigate("/app/profile")}
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
