import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Avatar,
    Grid,
    Divider,
    Snackbar,
    Alert,
} from "@mui/material";

const ChangePwdDialog: React.FC = () => {
    return (
        <div>
            {/* Dialog đổi mật khẩu */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
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
                </DialogContent>
                <DialogActions sx={{ px: 3 }}>
                    <Button onClick={handleClose} disabled={loading}>
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleChangePassword}
                        disabled={loading}
                    >
                        {loading ? "Đang xử lý..." : "Lưu"}
                    </Button>
                </DialogActions>
            </Dialog>{" "}
        </div>
    );
};

export default ChangePwdDialog;
