import axios from "axios";
import type { CreateItemDTO, UpdateItemDTO } from "./../types/item";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + "/Item",
    headers: {
        "Content-Type": "application/json",
    },
});

// Xử lý lỗi chung
const handleError = (error: any) => {
    console.error("API Error:", error.response?.data || error.message);
    return null;
};

// Lấy danh sách item
export const getListItem = async () => {
    try {
        const res = await apiClient.get("/");
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Lấy danh sách item ID
export const getItemById = async (itemId: number) => {
    try {
        const res = await apiClient.get(`/${itemId}`);
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Lấy danh sách item theo sheetId
export const getListItemBySheetId = async (itemId: number) => {
    try {
        const res = await apiClient.get(`/Tree/${itemId}`);
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Lấy danh sách theo dạng tree
export const getTreeItem = async () => {
    try {
        const res = await apiClient.get("/tree");
        return res.data;
    } catch (error) {
        return handleError(error);
    }
};

// Tạo mới item
export const createItem = async (item: CreateItemDTO) => {
    try {
        const res = await apiClient.post("/", item);
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Cập nhật item
export const updateItem = async (itemId: number, item: UpdateItemDTO) => {
    try {
        const res = await apiClient.put(`/${itemId}`, item);
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Xóa item
export const deleteItem = async (itemId: number) => {
    try {
        await apiClient.delete(`/${itemId}`);
        return true;
    } catch (error) {
        return handleError(error);
    }
};
