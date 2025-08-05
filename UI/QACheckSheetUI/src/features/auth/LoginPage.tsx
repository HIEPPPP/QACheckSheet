import React from "react";
import {
    Avatar,
    Button,
    TextField,
    Box,
    Typography,
    Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuth } from "./hooks/useAuth";

const Login: React.FC = () => {
    const {
        userCode,
        password,
        error,
        loading,
        setUserCode,
        setPassword,
        handleSubmit,
    } = useAuth();

    return (
        <div>
            {loading && <p className="text-xl font-bold">Loading...</p>}
            {!loading && (
                <div className="flex justify-center items-center h-screen">
                    <Container component="main" maxWidth="sm">
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Đăng nhập
                            </Typography>

                            {error && (
                                <Typography
                                    color="error"
                                    variant="body2"
                                    sx={{ mt: 2 }}
                                >
                                    {error}
                                </Typography>
                            )}

                            <Box
                                component="form"
                                onSubmit={handleSubmit}
                                sx={{ mt: 1 }}
                            >
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    autoComplete="username"
                                    id="userCode"
                                    label="Mã nhân viên"
                                    value={userCode}
                                    onChange={(e) =>
                                        setUserCode(e.target.value)
                                    }
                                    autoFocus
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    autoComplete="current-password"
                                    name="password"
                                    label="Mật khẩu"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Đăng nhập
                                </Button>
                            </Box>
                        </Box>
                    </Container>
                </div>
            )}
        </div>
    );
};

export default Login;
