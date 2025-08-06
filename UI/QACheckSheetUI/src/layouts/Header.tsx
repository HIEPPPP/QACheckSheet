import React from "react";
import { AppBar, Toolbar, IconButton, Badge, InputBase } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": { backgroundColor: alpha(theme.palette.common.white, 0.25) },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(1),
        width: "auto",
    },
}));

export const Header: React.FC = () => (
    <AppBar position="fixed" className="ml-64 bg-white text-gray-900 shadow-sm">
        <Toolbar className="justify-between">
            <Search>
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                    <SearchIcon />
                </div>
                <InputBase
                    placeholder="Search…"
                    classes={{ root: "pl-10", input: "w-64" }}
                />
            </Search>
            <div className="flex items-center space-x-4">
                <IconButton>
                    <Badge badgeContent={3}>
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                {/* theme toggle, settings, avatar... */}
            </div>
        </Toolbar>
    </AppBar>
);
