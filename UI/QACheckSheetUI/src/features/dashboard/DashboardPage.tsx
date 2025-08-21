import React from "react";
import { useDashboard } from "./hooks/useDashboard";
import Devices from "./components/Devices";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import ErrorIcon from "@mui/icons-material/Error";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FilterDevice from "./components/FilterDevice";
import { Pending, QrCode } from "@mui/icons-material";
import { Button } from "@mui/material";

const DashboardPage: React.FC = () => {
    const { devices, loading, error } = useDashboard();

    const sampleStats = [
        {
            id: 1,
            title: "Pending",
            value: "12",
            icon: <Pending />,
            accent: "orange",
        },
        {
            id: 2,
            title: "OK",
            value: "25",
            icon: <ThumbUpIcon />,
            accent: "blue",
        },
        {
            id: 3,
            title: "NG",
            value: "2",
            icon: <ErrorIcon />,
            accent: "red",
        },
        {
            id: 4,
            title: "Confirm",
            value: "25",
            icon: <CheckCircleIcon />,
            accent: "green",
        },
    ];

    return (
        <div className="flex flex-col">
            <div className="flex justify-between">
                <div className="max-w-2xl">
                    {/* responsive grid: 1 col mobile, 2 cols tablet, 4 cols desktop */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {sampleStats.map((s) => (
                            <FilterDevice
                                key={s.id}
                                title={s.title}
                                value={s.value}
                                icon={s.icon}
                                accent={s.accent as any}
                            />
                        ))}
                    </div>
                </div>
                <Button
                    variant="contained"
                    color="info"
                    onClick={() => {}}
                    startIcon={<QrCode fontSize="large" />}
                >
                    <span className="font-bold text-xl">Check</span>
                </Button>
            </div>
            <hr className="opacity-6 mt-10" />

            <Devices devices={devices} />
        </div>
    );
};

export default DashboardPage;
