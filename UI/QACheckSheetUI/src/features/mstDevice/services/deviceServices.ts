import type { Device } from "../types/device";
import axios, { AxiosError } from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + "/Device",
    headers: {
        "Content-Type": "application/json",
    },
});

// Xử lý lỗi chung
const handleError = (error: any) => {
    console.error("API Error:", error.response?.data || error.message);
    return null;
};

// Lấy danh sách loại thiết bị
export const getListDevice = async () => {
    try {
        const res = await apiClient.get("/");
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Lấy danh sách loại thiết bị theo id
export const getListDeviceById = async (typeId: number) => {
    try {
        const res = await apiClient.get(`/Device/${typeId}`);
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Tạo mới thiết bị
export const createDevice = async (device: Device) => {
    try {
        const res = await apiClient.post("/", device);
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Cập nhật thiết bị
export const updateDevice = async (deviceId: number, device: Device) => {
    try {
        const res = await apiClient.put(`/${deviceId}`, device);
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Xóa thiết bị
export const deleteDevice = async (deviceId: number) => {
    try {
        await apiClient.delete(`/${deviceId}`);
        return true;
    } catch (error) {
        return handleError(error);
    }
};
