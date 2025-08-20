import React, { useState, useContext } from "react";
import { Button, LinearProgress } from "@mui/material";
import { Add } from "@mui/icons-material";
import type { DeviceType } from "./types/deviceType";
import DeviceTypeTable from "./components/DeviceTypeTable";
import DeviceFormDialog from "./components/DeviceTypeDialog";
import ConfirmDialog from "../../shared/components/ConfirmDialog";
import Notification from "../../shared/components/Notification";
import useDeviceType from "./hooks/useDeviceType";
import type { AlertColor } from "@mui/material";
import { UserContext } from "../../contexts/UserProvider";
import { vnTime } from "../../utils/formatDateTime";

const DeviceTypePage: React.FC = () => {
    const { deviceTypes, create, update, remove, refresh, loading } =
        useDeviceType();
    const { user } = useContext(UserContext);

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

    const [formData, setFormData] = useState<DeviceType>({
        typeId: null,
        typeName: "",
        defaultFrequency: null,
        description: "",
        createAt: null,
        createBy: "",
        updateAt: null,
        updateBy: "",
    });

    const handleOpenForm = (type?: DeviceType | null) => {
        if (type) {
            setFormData(type);
        } else {
            setFormData({
                typeId: null,
                typeName: "",
                defaultFrequency: null,
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
        if (formData.typeId) {
            const res = await update(formData.typeId, formData);
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

    const handleDelete = async (deviceId: number) => {
        const ok = await remove(deviceId);
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
            typeId: null,
            typeName: "",
            defaultFrequency: 1,
            description: "",
            createAt: new Date(vnTime).toISOString(),
            createBy: String(user?.userCode),
            updateAt: new Date(vnTime).toISOString(),
            updateBy: String(user?.userCode),
        });
        setOpen(true);
    };

    return (
        <div>
            {loading && <LinearProgress />}
            <h1 className="text-3xl font-bold mb-4">Danh Sách Loại Thiết Bị</h1>
            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleButtonAddClick}
            >
                Thêm Loại Thiết Bị
            </Button>

            <DeviceTypeTable
                deviceTypes={deviceTypes}
                onEdit={(d) => handleOpenForm(d)}
                onDelete={(id) => setConfirmDelete(id)}
            />

            <DeviceFormDialog
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

export default DeviceTypePage;
