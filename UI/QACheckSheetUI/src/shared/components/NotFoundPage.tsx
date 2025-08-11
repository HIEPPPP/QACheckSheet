import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const NotFoundPage = () => {
    return (
        <Box className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <ErrorOutlineIcon className="text-red-500" sx={{ fontSize: 80 }} />
            <Typography variant="h3" className="mt-4 font-bold text-gray-800">
                404 - Page Not Found
            </Typography>
            <Typography variant="body1" className="mt-2 text-gray-600">
                Rất tiếc, chúng tôi không tìm thấy trang bạn đang tìm.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/app"
                sx={{ textTransform: "none", mt: 2, boxShadow: 3 }}
            >
                Trở về trang chủ
            </Button>
        </Box>
    );
};

export default NotFoundPage;
