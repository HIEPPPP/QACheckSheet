import axios from "axios";
import type { TypeSheetDTO } from "../types/typeSheet";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + "/SheetDeviceType",
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
export const getListTypeSheet = async () => {
    try {
        const res = await apiClient.get("/");
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Lấy danh sách theo id
export const getTypeSheetById = async (id: number) => {
    try {
        const res = await apiClient.get(`/${id}`);
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Tạo mới
export const createTypeSheet = async (typeSheet: TypeSheetDTO) => {
    try {
        const res = await apiClient.post("/", typeSheet);
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Cập nhật
export const updateTypeSheet = async (id: number, typeSheet: TypeSheetDTO) => {
    try {
        const res = await apiClient.put(`/${id}`, typeSheet);
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Xóa
export const deleteTypeSheet = async (id: number) => {
    try {
        await apiClient.delete(`/${id}`);
        return true;
    } catch (error) {
        return handleError(error);
    }
};
