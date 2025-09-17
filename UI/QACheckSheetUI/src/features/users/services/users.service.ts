import axios from "axios";
import type { User } from "../types/users";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + "/User",
    headers: {
        "Content-Type": "application/json",
    },
});

// Xử lý lỗi chung
const handleError = (error: any) => {
    console.error("API Error:", error.response?.data || error.message);
    return null;
};

// Lấy danh sách
export const getListUser = async () => {
    try {
        const res = await apiClient.get("/");
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

export const getUserById = async (id: number) => {
    try {
        const res = await apiClient.get(`/${id}`);
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Thêm
export const createUser = async (user: User) => {
    try {
        const res = await apiClient.post("/createUser", user);
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Cập nhật
export const updateUser = async (id: number, user: User) => {
    try {
        const res = await apiClient.put(`/${id}`, user);
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Xóa
export const deleteUser = async (id: number) => {
    try {
        await apiClient.delete(`/${id}`);
        return true;
    } catch (error) {
        return handleError(error);
    }
};
