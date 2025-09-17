import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";

import { useEffect, useState } from "react";

import { getListRole } from "../services/role.service";
import type { Role, User } from "../types/users";

interface UserDialogProps {
    open: boolean;
    formData: User;
    setFormData: (data: User) => void;
    onSave: () => void;
    onClose: () => void;
}

type Errors = {
    userCode?: string;
    password?: string;
    fullName?: string;
    roleIds?: string;
};

const UserDialog: React.FC<UserDialogProps> = ({
    open,
    formData,
    setFormData,
    onSave,
    onClose,
}) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [errors, setErrors] = useState<Errors>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getListRole();
                res && setRoles(res);
            } catch (error) {
                console.error("Failed to fetch roles", error);
            }
        };
        fetchData();
    }, []);

    // Reset errors when formData or open changes
    useEffect(() => {
        if (!open) setErrors({});
    }, [open]);

    const validate = async (): Promise<boolean> => {
        const e: Errors = {};

        // userCode: required
        if (!formData.userCode || formData.userCode.trim() === "") {
            e.userCode = "Mã người dùng là bắt buộc";
        }
        // else if (formData.userCode.length < 3) {
        //     e.userCode = "Mã người dùng phải từ 3 ký tự trở lên";
        // }

        // password: required only when creating (userId null) OR if user entered password when updating
        const pwd = formData.password ?? "";
        if (!formData.userId) {
            if (!pwd || pwd.trim() === "") {
                e.password = "Mật khẩu là bắt buộc";
            }
            // else if (pwd.length < 6) {
            //     e.password = "Mật khẩu phải ít nhất 6 ký tự";
            // } else if (!/\d/.test(pwd) || !/[A-Za-z]/.test(pwd)) {
            //     e.password = "Mật khẩu cần chứa cả chữ và số";
            // }
        } else {
            // updating: optional password, but if provided must meet rules
            // if (pwd && pwd.length > 0) {
            //     if (pwd.length < 6)
            //         e.password = "Mật khẩu phải ít nhất 6 ký tự";
            //     else if (!/\d/.test(pwd) || !/[A-Za-z]/.test(pwd))
            //         e.password = "Mật khẩu cần chứa cả chữ và số";
            // }
        }

        // fullName: required
        if (!formData.fullName || formData.fullName.trim() === "") {
            e.fullName = "Họ và tên là bắt buộc";
        }

        // roleIds: at least one selected
        if (!formData.roleIds || formData.roleIds.length === 0) {
            e.roleIds = "Phải chọn ít nhất 1 quyền";
        }

        setErrors(e);

        // Example of async server-side validation (optional): unique userCode
        // if (!e.userCode) {
        //   const exists = await checkUserCodeExists(formData.userCode!);
        //   if (exists && !formData.userId) { // only when creating
        //     setErrors(prev => ({ ...prev, userCode: "Mã người dùng đã tồn tại" }));
        //     return false;
        //   }
        // }

        return Object.keys(e).length === 0; // trả về mảng chứa các key của object

        // Giải thích
        // const e = {
        //     userCode: "Mã người dùng là bắt buộc",
        //     password: "Mật khẩu phải ít nhất 6 ký tự",
        // };
        // Object.keys(e); // ["userCode", "password"]
        // Nếu length === 0 nghĩa là object e không có lỗi nào → form hợp lệ → hàm validate trả về true.
        // Nếu length > 0 thì có ít nhất một lỗi → hàm validate trả về false
    };

    const handleSave = async () => {
        const ok = await validate();
        if (!ok) return;
        onSave();
    };

    // Convenience: keep Autocomplete value consistent
    const currentRoleValue =
        roles.find((r) => r.roleId === formData.roleIds?.[0]) || null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            disableEnforceFocus
            disableAutoFocus
            disableRestoreFocus
        >
            <DialogTitle>
                {formData.userId ? "Cập nhật tài khoản" : "Thêm tài khoản"}
            </DialogTitle>
            <DialogContent>
                <Autocomplete
                    sx={{ my: 2 }}
                    disablePortal
                    fullWidth
                    size="medium"
                    options={roles}
                    getOptionLabel={(option) => option.roleName ?? ""}
                    value={currentRoleValue}
                    onChange={(_, newValue) => {
                        setFormData({
                            ...formData,
                            roleIds: newValue ? [newValue.roleId!] : [],
                        });
                        // clear role error on change
                        setErrors((prev) => ({ ...prev, roleIds: undefined }));
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Quyền"
                            variant="outlined"
                            error={Boolean(errors.roleIds)}
                            helperText={errors.roleIds}
                        />
                    )}
                />

                <TextField
                    label="Mã người dùng"
                    fullWidth
                    margin="dense"
                    value={formData.userCode ?? ""}
                    onChange={(e) => {
                        setFormData({ ...formData, userCode: e.target.value });
                        setErrors((prev) => ({ ...prev, userCode: undefined }));
                    }}
                    disabled={formData.userId ? true : false}
                    error={Boolean(errors.userCode)}
                    helperText={errors.userCode}
                />

                <TextField
                    label="Mật khẩu"
                    type="password"
                    fullWidth
                    margin="dense"
                    value={formData.password ?? ""}
                    onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    error={Boolean(errors.password)}
                    helperText={
                        errors.password ??
                        (formData.userId
                            ? "Để trống nếu không muốn đổi mật khẩu"
                            : "")
                    }
                />

                <TextField
                    label="Họ và tên"
                    fullWidth
                    margin="dense"
                    value={formData.fullName ?? ""}
                    onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        setErrors((prev) => ({ ...prev, fullName: undefined }));
                    }}
                    error={Boolean(errors.fullName)}
                    helperText={errors.fullName}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button onClick={handleSave} variant="contained">
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserDialog;
