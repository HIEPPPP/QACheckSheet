import React from "react";
import { Link } from "react-router-dom";
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
// ... import other icons

const menu = [
    { label: "Dashboard", path: "/dashboard", icon: <HomeIcon /> },
    // add more
];

export const Sidebar: React.FC = () => (
    <Drawer
        variant="permanent"
        className="w-64 flex-shrink-0"
        PaperProps={{ className: "w-64 bg-gray-800 text-white" }}
    >
        <div className="h-16 flex items-center px-4 text-xl font-bold">
            Larkon
        </div>
        <List>
            {menu.map((item) => (
                <ListItem
                    component={Link}
                    to={item.path}
                    key={item.path}
                    className="hover:bg-gray-700"
                >
                    <ListItemIcon className="text-white">
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                </ListItem>
            ))}
        </List>
    </Drawer>
);
