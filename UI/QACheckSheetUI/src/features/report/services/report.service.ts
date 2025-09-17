import axios from "axios";
import type { CreateConfirm, UpdateApprove } from "../types/report";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + "/ConfirmApprove",
    headers: {
        "Content-Type": "application/json",
    },
});

// Xử lý lỗi chung
const handleError = (error: any) => {
    console.error("API Error:", error.response?.data || error.message);
    return null;
};

export const createConfirm = async (data: CreateConfirm) => {
    try {
        const res = await apiClient.post("/", data);
        return res.data?.data ?? null;
    } catch (error) {
        return handleError(error);
    }
};

export const updateApprove = async (id: number, data: UpdateApprove) => {
    try {
        const res = await apiClient.put(`/${id}`, data);
        return res.data?.data ?? null;
    } catch (error) {
        return handleError(error);
    }
};
