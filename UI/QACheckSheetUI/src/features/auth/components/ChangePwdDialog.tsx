// ChangePwdDialog.tsx
import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from "@mui/material";
import type { ChangePwdRequest } from "../type/auth";

type Props = {
    open: boolean;
    onClose: () => void;
    userCode?: string | null | undefined; // optional, dialog có thể nhận userCode để gửi payload
    loading?: boolean;
    onSubmit: (payload: ChangePwdRequest) => Promise<boolean | void>;
};

const ChangePwdDialog: React.FC<Props> = ({
    open,
    onClose,
    userCode,
    loading,
    onSubmit,
}) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        setError(null);
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("Vui lòng điền đầy đủ thông tin.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Mật khẩu mới và xác nhận không khớp.");
            return;
        }

        const payload: ChangePwdRequest = {
            userCode,
            oldPassword,
            newPassword,
        };

        try {
            const result = await onSubmit(payload);
            console.log("Đã chạy đến đây");

            // nếu parent trả true thì dialog có thể tự đóng và reset
            if (result === true || result === undefined) {
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
                onClose();
            }
        } catch (err) {
            // nếu muốn hiện lỗi chi tiết từ parent, parent có thể ném lỗi hoặc trả false
            setError((err as any)?.message || "Lỗi khi đổi mật khẩu");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Đổi mật khẩu</DialogTitle>
            <DialogContent dividers>
                <TextField
                    fullWidth
                    type="password"
                    label="Mật khẩu hiện tại"
                    margin="dense"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                />
                <TextField
                    fullWidth
                    type="password"
                    label="Mật khẩu mới"
                    margin="dense"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                    fullWidth
                    type="password"
                    label="Xác nhận mật khẩu"
                    margin="dense"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {error && (
                    <div style={{ color: "red", marginTop: 8 }}>{error}</div>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3 }}>
                <Button onClick={onClose} disabled={loading}>
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={loading}
                >
                    {loading ? "Đang xử lý..." : "Lưu"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChangePwdDialog;
