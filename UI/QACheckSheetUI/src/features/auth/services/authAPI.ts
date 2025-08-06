import axios, { AxiosError } from "axios";
import type { LoginResponse, ChangePwdRequest } from "../type/auth";
import { saveAuthData } from "../../../shared/services/auth.service";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + "/Auth",
    headers: {
        "Content-Type": "application/json",
    },
});

// Xử lý lỗi chung
const handleError = (error: AxiosError) => {
    console.error("API Error:", error.response?.data || error.message);
    return null;
};

export const login = async (
    userCode: string,
    password: string
): Promise<LoginResponse | null> => {
    try {
        const res = await apiClient.post<LoginResponse>("/login", {
            userCode,
            password,
        });
        const data = res.data;
        const playload = data.data;

        saveAuthData({
            userCode: playload.userCode,
            fullName: playload.fullName,
            roles: playload.roles,
        });

        return data;
    } catch (err) {
        return handleError(err as AxiosError);
    }
};

export const changePassword = async (
    changePasswordRequest: ChangePwdRequest
): Promise<{ message: string } | null> => {
    try {
        const res = await apiClient.post(
            "/changePassword",
            changePasswordRequest
        );
        return res.data; // { message: "Đổi mật khẩu thành công!" }
    } catch (error) {
        console.error(
            "Change Password Error:",
            (error as AxiosError).response?.data ||
                (error as AxiosError).message
        );
        return null;
    }
};
