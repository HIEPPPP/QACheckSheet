import axios, { AxiosError } from "axios";
import type { LoginResponse, ChangePwdRequest } from "../type/auth";
import { saveAuthData } from "../../../shared/services/auth.service";
import type { UserLocalStorage } from "../../../shared/type/localstorage";

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
): Promise<UserLocalStorage | null> => {
    try {
        const res = await apiClient.post<LoginResponse>("/login", {
            userCode,
            password,
        });

        console.log("res.data", res.data);
        const payload = res.data?.data;
        if (!payload) return null;

        const user: UserLocalStorage = {
            userCode: String(payload.userCode ?? ""),
            fullName: String(payload.fullName ?? ""),
            roles: Array.isArray(payload.roles)
                ? payload.roles.map(String)
                : [],
        };

        saveAuthData({
            userCode: payload.userCode,
            fullName: payload.fullName,
            roles: payload.roles,
        });

        return user;
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
