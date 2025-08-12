import axios, { AxiosError } from "axios";
import type { Sheet } from "../types/sheet";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + "/Sheet",
    headers: {
        "Content-Type": "application/json",
    },
});

// Xử lý lỗi chung
const handleError = (error: any) => {
    console.error("API Error:", error.response?.data || error.message);
    return null;
};

// Lấy danh sách check sheet
export const getListSheet = async () => {
    try {
        const res = await apiClient.get("/");
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Lấy danh sách check sheet theo id
export const getListDeviceTypeById = async (sheetId: number) => {
    try {
        const res = await apiClient.get(`/Sheet/${sheetId}`);
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Tạo mới check sheet
export const createSheet = async (sheet: Sheet) => {
    try {
        const res = await apiClient.post("/", sheet);
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Cập nhật check sheet 
export const updateSheet = async (sheetId: number, sheet: Sheet) => {
    try {
        const res = await apiClient.put(`/${sheetId}`, sheet);
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Xóa thiết bị
export const deleteSheet = async (sheetId: number) => {
    try {
        await apiClient.delete(`/${sheetId}`);
        return true;
    } catch (error) {
        return handleError(error);
    }
};
