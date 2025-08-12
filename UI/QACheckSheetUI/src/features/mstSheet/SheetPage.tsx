import React, { useState, useContext } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import SheetTable from "./components/SheetTable";
import SheetDialog from "./components/SheetDialog";
import ConfirmDialog from "../../shared/components/ConfirmDialog";
import Notification from "../../shared/components/Notification";
import useSheet from "./hooks/useSheet";
import type { AlertColor } from "@mui/material";
// import { AuthContext } from "../contexts/AuthContext";
import { vnTime } from "../../utils/formatDateTiem";
import type { Sheet } from "./types/sheet";

const SheetPage: React.FC = () => {
    const { sheets, create, update, remove, refresh, loading } = useSheet();
    // const user = useContext(AuthContext);

    const [open, setOpen] = useState(false);
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

    const [formData, setFormData] = useState<Sheet>({
        sheetId: null,
        sheetCode: "",
        sheetName: "",
        formNO: "",
        description: "",
        createAt: null,
        createBy: "",
        updateAt: null,
        updateBy: "",
    });

    const handleOpenForm = (type?: Sheet | null) => {
        if (type) {
            setFormData(type);
        } else {
            setFormData({
                sheetId: null,
                sheetCode: "",
                sheetName: "",
                formNO: "",
                description: "",
                createAt: null,
                createBy: "",
                updateAt: null,
                updateBy: "",
            });
        }
        setOpen(true);
    };

    const handleSave = async () => {
        if (formData.sheetId) {
            const res = await update(formData.sheetId, formData);
            if (res) {
                setSnackbar({
                    open: true,
                    message: "Cập nhật thành công",
                    severity: "success",
                });
            } else {
                setSnackbar({
                    open: true,
                    message: "Cập nhật thất bại",
                    severity: "error",
                });
            }
        } else {
            const res = await create(formData);
            if (res) {
                setSnackbar({
                    open: true,
                    message: "Thêm mới thành công",
                    severity: "success",
                });
            } else {
                setSnackbar({
                    open: true,
                    message: "Thêm mới thất bại",
                    severity: "error",
                });
            }
        }
        setOpen(false);
        await refresh();
    };

    const handleDelete = async (sheetId: number) => {
        const ok = await remove(sheetId);
        if (ok) {
            setSnackbar({
                open: true,
                message: "Xóa thành công",
                severity: "success",
            });
        } else {
            setSnackbar({
                open: true,
                message: "Xóa thất bại",
                severity: "error",
            });
        }
        setConfirmDelete(null);
        await refresh();
    };

    const handleButtonAddClick = () => {
        setFormData({
            sheetId: null,
            sheetCode: "CS" + (sheets.length + 1),
            sheetName: "",
            formNO: "",
            description: "",
            createAt: new Date(vnTime).toISOString(),
            createBy: "24182",
            updateAt: new Date(vnTime).toISOString(),
            updateBy: "24182",
        });
        setOpen(true);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Danh Sách Check Sheet</h1>
            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleButtonAddClick}
            >
                Thêm Check Sheet
            </Button>

            <SheetTable
                sheets={sheets}
                onEdit={(d) => handleOpenForm(d)}
                onDelete={(id) => setConfirmDelete(id)}
            />

            <SheetDialog
                open={open}
                formData={formData}
                setFormData={setFormData}
                onSave={handleSave}
                onClose={() => setOpen(false)}
            />

            <ConfirmDialog
                open={Boolean(confirmDelete)}
                onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
                onCancel={() => setConfirmDelete(null)}
                title={"Xác nhận xóa loại thiết bị"}
                content={`Bạn có chắc chắn muốn xóa loại thiết bị này không?`}
            />

            <Notification
                {...snackbar}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
        </div>
    );
};

export default SheetPage;
