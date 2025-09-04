import React, { useState } from "react";
import { useNgDetail } from "./hooks/useNgDetail";
import { Button, LinearProgress, type AlertColor } from "@mui/material";
import NgTable from "./components/NgTable";
import NgDialog from "./components/NgDialog";
import type { NgDetail } from "./types/ngDetail";
import type { CheckResult } from "../check/types/CheckResult";

const NgDetailPage: React.FC = () => {
    const { resultNgDetails, loading, error } = useNgDetail();

    const [open, setOpen] = useState<boolean>(false);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: AlertColor;
    }>({
        open: false,
        message: "",
        severity: "success",
    });

    const [formData, setFormData] = useState<NgDetail>({
        resultId: null,
        ngId: null,
        sheetCode: "",
        sheetName: "",
        deviceCode: "",
        deviceName: "",
        pathTitles: "",
        value: "",
        status: "",
        dataType: "",
        checkedBy: "",
        checkedDate: null,
        nGContentDetail: "",
        fixContent: "",
        fixedDate: null,
        confirmedBy: "",
        confirmedDate: null,
        note: "",
    });

    const handleOpenForm = async (result: NgDetail) => {
        result && setFormData(result);
        setOpen(true);
    };

    const handleSave = async () => {};

    const handleClose = async () => {
        setOpen(false);
    };

    return (
        <div>
            {loading && <LinearProgress />}
            <h1 className="text-3xl font-bold mb-4 text-red-500">
                Danh Sách Nội Dung Bất Thường
            </h1>

            <NgTable
                resultNgDetail={resultNgDetails}
                onEdit={(result: NgDetail) => handleOpenForm(result)}
            />

            <NgDialog
                open={open}
                formData={formData}
                setFormData={setFormData}
                onSave={handleSave}
                onClose={handleClose}
            />
        </div>
    );
};

export default NgDetailPage;
