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

// Lấy danh sách
export const getListSheet = async () => {
    try {
        const res = await apiClient.get("/");
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Lấy theo id
export const getSheetById = async (sheetId: number) => {
    try {
        const res = await apiClient.get(`/${sheetId}`);
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Lấy theo sheetCode
export const getSheetByCode = async (sheetCode: string) => {
    try {
        const res = await apiClient.get(`/${sheetCode}`);
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Tạo mới template
export const createSheet = async (sheet: Sheet) => {
    try {
        const res = await apiClient.post("/", sheet);
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Cập nhật
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
