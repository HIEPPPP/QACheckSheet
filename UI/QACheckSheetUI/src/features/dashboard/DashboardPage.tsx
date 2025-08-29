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
import { useStatus } from "../../contexts/StatusProvider";

type FilterKey = "All" | "Pending" | "OK" | "NG" | "Confirm";

const DashboardPage: React.FC = () => {
    const { devices, loading, error } = useDashboard();
    const { totals } = useStatus();

    const [selectedFilter, setSelectedFilter] =
        React.useState<FilterKey>("All");

    const sampleStats = [
        {
            id: "Pending",
            title: "Pending",
            value: String(totals.pending ?? 0),
            icon: <Pending />,
            accent: "orange",
        },
        {
            id: "OK",
            title: "OK",
            value: String(totals.ok ?? 0),
            icon: <ThumbUpIcon />,
            accent: "blue",
        },
        {
            id: "NG",
            title: "NG",
            value: String(totals.ng ?? 0),
            icon: <ErrorIcon />,
            accent: "red",
        },
        {
            id: "Confirm",
            title: "Confirm",
            value: String(totals.confirmed ?? 0),
            icon: <CheckCircleIcon />,
            accent: "green",
        },
    ];

    return (
        <div className="flex flex-col">
            <div className="flex justify-between">
                <div className="max-w-2xl w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {sampleStats.map((s) => (
                            <FilterDevice
                                key={s.id}
                                title={s.title}
                                value={s.value}
                                icon={s.icon}
                                accent={s.accent as any}
                                active={
                                    selectedFilter ===
                                    (s.id === "Confirm"
                                        ? "Confirm"
                                        : (s.id as FilterKey))
                                }
                                onClick={() =>
                                    setSelectedFilter(
                                        selectedFilter ===
                                            (s.id === "Confirm"
                                                ? "Confirm"
                                                : (s.id as FilterKey))
                                            ? "All"
                                            : ((s.id === "Confirm"
                                                  ? "Confirm"
                                                  : (s.id as FilterKey)) as FilterKey)
                                    )
                                }
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

            <Devices devices={devices} filter={selectedFilter} />
        </div>
    );
};

export default DashboardPage;
