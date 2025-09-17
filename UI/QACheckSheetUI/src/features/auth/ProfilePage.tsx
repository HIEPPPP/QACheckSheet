import React, { useContext, useState } from "react";
import {
    Container,
    Paper,
    Box,
    Typography,
    Button,
    Avatar,
    Divider,
    type AlertColor,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { changePassword } from "./services/authAPI";

import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserProvider";
import type { ChangePwdRequest } from "./type/auth";
import ChangePwdDialog from "./components/ChangePwdDialog";
import Notification from "../../shared/components/Notification";

const ProfilePage: React.FC = () => {
    //   const [user, setUser] = useState({});

    const { user } = useContext(UserContext);
    const { logoutUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: AlertColor;
    }>({
        open: false,
        message: "",
        severity: "success",
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // onSubmit sẽ được truyền xuống dialog
    const handleChangePassword = async (payload: ChangePwdRequest) => {
        setLoading(true);
        try {
            await changePassword({
                userCode: payload.userCode,
                oldPassword: payload.oldPassword,
                newPassword: payload.newPassword,
            });

            // giả sử API trả về success boolean hoặc object
            setSnackbar({
                open: true,
                message: "Cập nhật thành công",
                severity: "success",
            });

            // logout + chuyển về login sau 2s
            setTimeout(() => {
                logoutUser();
                navigate("/login");
            }, 2000);

            return true; // báo thành công cho dialog
        } catch (error: any) {
            error?.response?.data?.message || "Đổi mật khẩu thất bại";
            setSnackbar({
                open: true,
                message: "Đổi mật khẩu thất bại",
                severity: "error",
            });
            return false; // báo thất bại cho dialog (nếu muốn)
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

            {/* Dialog đổi mật khẩu */}
            <ChangePwdDialog
                open={open}
                onClose={handleClose}
                userCode={user?.userCode}
                loading={loading}
                onSubmit={handleChangePassword}
            />

            <Notification
                {...snackbar}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
        </Container>
    );
};

export default ProfilePage;
