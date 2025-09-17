import React from "react";
import {
    Avatar,
    Button,
    TextField,
    Box,
    Typography,
    Container,
    Paper,
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
                        <Paper
                            elevation={5}
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", md: "row" },
                                overflow: "hidden",
                                borderRadius: 2,
                                padding: 5,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                                    <LockOutlinedIcon />
                                </Avatar>
                                <Typography
                                    component="h1"
                                    variant="h5"
                                    fontWeight={600}
                                >
                                    SIGN IN
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
                                        label="Code"
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
                                        label="Password"
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        sx={{ fontWeight: 600 }}
                                    />
                                    <Button
                                        className="bg-orange-500"
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        sx={{
                                            mt: 3,
                                            mb: 2,
                                        }}
                                    >
                                        LOG IN
                                    </Button>
                                    <div className="text-gray-500 font-semibold text-center text-sm">
                                        2025 © QACS. Crafted by {""}
                                        {/* <FavoriteBorderRoundedIcon
                                        sx={{
                                            fontSize: 14,
                                            textAlign: "center",
                                        }}
                                    />
                                    {""} */}
                                        <span className="font-bold animate-gradient-text">
                                            Hieppp
                                        </span>
                                    </div>
                                </Box>
                            </Box>
                        </Paper>
                    </Container>
                </div>
            )}
        </div>
    );
};

export default Login;
