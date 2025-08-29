import React, { use, useContext, useState, useEffect } from "react";
import {
    Container,
    Paper,
    Box,
    Typography,
    Button,
    Avatar,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { changePassword } from "./services/authAPI";

import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserProvider";

const ProfilePage: React.FC = () => {
    //   const [user, setUser] = useState({});

    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleSnackbarClose = () =>
        setSnackbar((prev) => ({ ...prev, open: false }));

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            setSnackbar({
                open: true,
                message: "Vui lòng điền đầy đủ thông tin.",
                severity: "warning",
            });
            return;
        }
        if (newPassword !== confirmPassword) {
            setSnackbar({
                open: true,
                message: "Mật khẩu mới và xác nhận không khớp.",
                severity: "error",
            });
            return;
        }

        setLoading(true);
        try {
            // Call API đổi mật khẩu
            const response = await changePassword();

            if (response !== null) {
                setSnackbar({
                    open: true,
                    message: "Đổi mật khẩu thành công!",
                    severity: "success",
                });
                handleClose();
                // Reset form
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");

                setTimeout(() => {
                    // Logout user
                    // logoutUser();
                    navigate("/login");
                }, 2000);
            } else {
                setSnackbar({
                    open: true,
                    message: "Đổi mật khẩu thất bại, vui lòng thử lại.",
                    severity: "error",
                });
            }
        } catch (error) {
            console.error(error);
            const msg =
                error.response?.data?.message ||
                "Lỗi hệ thống, vui lòng thử lại sau.";
            setSnackbar({ open: true, message: msg, severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Thông tin người dùng với button space-between */}
            <Paper
                elevation={1}
                sx={{
                    p: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                {/* Left: avatar + info */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                        sx={{
                            bgcolor: "primary.main",
                            width: 64,
                            height: 64,
                            mr: 2,
                        }}
                    >
                        {user?.fullName?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography variant="h5">{user?.fullName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {user?.userCode}
                        </Typography>
                    </Box>
                </Box>

                {/* Right: Đổi mật khẩu */}
                <Button
                    variant="outlined"
                    startIcon={<LockOutlinedIcon />}
                    onClick={handleOpen}
                >
                    Đổi mật khẩu
                </Button>
            </Paper>

            {/* Thông tin chi tiết */}
            <Paper elevation={0} sx={{ mt: 3, p: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Thông tin chi tiết
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" gutterBottom>
                    <strong>Họ và tên:</strong> {user?.fullName}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    <strong>Mã nhân viên:</strong> {user?.userCode}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    <strong>Quyền:</strong> {user?.roles}
                </Typography>
            </Paper>
        </Container>
    );
};

export default ProfilePage;
