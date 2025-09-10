import axios from "axios";
import type { ConfirmNgPayload, NgDetail } from "../types/ngDetail";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + "/ngDetail",
    headers: {
        "Content-Type": "application/json",
    },
});

// Xử lý lỗi chung
const handleError = (error: any) => {
    console.error("API Error:", error.response?.data || error.message);
    return null;
};

// Tạo NG Detail
export const createNgDetail = async (payload: NgDetail) => {
    try {
        const response = await apiClient.post("/", payload);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

// Cập nhật NG Detail
export const updateNgDetail = async (
    ngId: number,
    payload: ConfirmNgPayload
) => {
    try {
        const response = await apiClient.put(`/${ngId}`, payload);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};
