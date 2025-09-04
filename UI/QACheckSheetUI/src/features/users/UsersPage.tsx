import { Add } from "@mui/icons-material";
import { Button, type AlertColor } from "@mui/material";
import React, { useState } from "react";
import UserTable from "./components/UserTable";
import useUser from "./hooks/useUser";
import type { User } from "./types/users";
import UserDialog from "./components/UserDialog";
import ConfirmDialog from "../../shared/components/ConfirmDialog";
import Notification from "../../shared/components/Notification";

const DEFAUT_FORM_ADD: User = {
    userId: null,
    userCode: "",
    password: "",
    fullName: "",
    roleIds: [],
    createdAt: null,
    roles: [],
};

const UsersPage: React.FC = () => {
    const { users, loading, error, refresh, create, update, remove } =
        useUser();

    const [formData, setFormData] = useState<User>(DEFAUT_FORM_ADD);

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

    const handleOpenForm = (user?: User | null) => {
        if (user) {
            setFormData(user);
        } else {
            setFormData(DEFAUT_FORM_ADD);
        }
        setOpen(true);
    };

    const handleSave = async () => {
        try {
            if (formData.userId) {
                const res = await update(formData.userId, formData);
                res &&
                    setSnackbar({
                        open: true,
                        message: res
                            ? "Cập nhật thành công"
                            : "Cập nhật thất bại",
                        severity: res ? "success" : "error",
                    });
            } else {
                const res = await create(formData);
                res &&
                    setSnackbar({
                        open: true,
                        message: res
                            ? "Thêm mới thành công"
                            : "Thêm mới thất bại",
                        severity: res ? "success" : "error",
                    });
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Có lỗi xảy ra",
                severity: "error",
            });
        } finally {
            setOpen(false);
            await refresh();
        }
    };

    const handleDelete = async (userId: number) => {
        const ok = await remove(userId);
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

    const handleClose = async () => {
        setOpen(false);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Danh Sách Tài Khoản</h1>
            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenForm()}
            >
                Thêm tài khoản
            </Button>

            <UserTable
                users={users}
                onEdit={(u: User) => handleOpenForm(u)}
                onDelete={(id: number) => setConfirmDelete(id)}
            />

            <UserDialog
                open={open}
                formData={formData}
                setFormData={setFormData}
                onSave={handleSave}
                onClose={handleClose}
            />

            <ConfirmDialog
                open={Boolean(confirmDelete)}
                onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
                onCancel={() => setConfirmDelete(null)}
                title={"Xác nhận xóa tài khoản"}
                content={`Bạn có chắc chắn muốn xóa tài khoản này không?`}
            />

            <Notification
                {...snackbar}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
        </div>
    );
};

export default UsersPage;
