import React from "react";
import { useState, useEffect } from "react";

import { Button, TextField, Autocomplete } from "@mui/material";
import { ArticleRounded, Search, UpdateOutlined } from "@mui/icons-material";
import EditDataPage from "../check/EditPage";
import { useEditContainer } from "./hooks/useEditContainer";

const EditPageContainer = () => {
    const [showCheckSheet, setShowCheckSheet] = useState(false);
    const [deviceCode, setDeviceCode] = useState<string>("");
    const [deviceName, setDeviceName] = useState<string>("");
    const { sheets, deviceSheet, sheetCode, setSheetCode, dayRef, setDayRef } =
        useEditContainer();

    const handleSearch = () => {
        if (!sheetCode || !deviceCode || !dayRef) {
            alert("Vui lòng chọn đầy đủ thông tin");
            return;
        }
        setShowCheckSheet(true);
    };

    const handleReset = () => {
        setShowCheckSheet(false);
        setSheetCode("");
        setDeviceCode("");
        setDayRef("");
    };

    return (
        <div>
            <div className="flex gap-4 items-center my-4">
                <Autocomplete
                    fullWidth
                    size="small"
                    options={sheets}
                    getOptionLabel={(option) => option.sheetName}
                    value={
                        sheets.find((s) => s.sheetCode === sheetCode) || null
                    }
                    onChange={(_, newValue) => {
                        if (newValue) setSheetCode(String(newValue.sheetCode));
                        setShowCheckSheet(false);
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="CheckSheet" />
                    )}
                />
                <Autocomplete
                    fullWidth
                    size="small"
                    options={deviceSheet}
                    getOptionLabel={(option) => option.deviceName ?? ""}
                    isOptionEqualToValue={(option, value) =>
                        option.deviceCode === value.deviceCode
                    }
                    value={
                        deviceSheet.find((d) => d.deviceCode === deviceCode) ||
                        null
                    }
                    onChange={(_, newValue) => {
                        if (newValue) {
                            setDeviceCode(String(newValue.deviceCode));
                            setDeviceName(String(newValue.deviceName));
                            setShowCheckSheet(false);
                        } else {
                            setDeviceCode("");
                            setDeviceName("");
                        }
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Thiết bị" />
                    )}
                />
                <TextField
                    fullWidth
                    type="date"
                    label="Tháng"
                    value={dayRef}
                    onChange={(e) => {
                        setDayRef(e.target.value);
                        setShowCheckSheet(false);
                    }}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                />
                <Button
                    variant="contained"
                    className="w-[400px] h-10"
                    onClick={handleSearch}
                    startIcon={<Search />}
                >
                    Search
                </Button>
                <Button
                    variant="contained"
                    color="inherit"
                    className="w-[400px] h-10"
                    onClick={handleReset}
                    startIcon={<UpdateOutlined />}
                >
                    Reset
                </Button>
            </div>
            {showCheckSheet ? (
                <EditDataPage
                    key={`${sheetCode}-${deviceCode}-${dayRef}`}
                    rawCode={`${sheetCode}-${deviceCode}-${dayRef}`}
                    sheetCode={sheetCode}
                    deviceCode={deviceCode}
                    dayRef={dayRef}
                    onComplete={handleReset}
                />
            ) : (
                <div className="flex justify-center items-center h-185 text-gray-400 border rounded-sm bg-white p-10 shadow-xl">
                    <ArticleRounded
                        style={{ fontSize: 250, color: "#2196F3" }}
                    />
                </div>
            )}
        </div>
    );
};

export default EditPageContainer;
