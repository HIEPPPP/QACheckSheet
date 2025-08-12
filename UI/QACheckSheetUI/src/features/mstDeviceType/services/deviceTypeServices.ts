import axios, { AxiosError } from "axios";
import type { DeviceType } from "../types/deviceType";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + "/DeviceType",
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
export const getListDeviceType = async () => {
    try {
        const res = await apiClient.get("/");
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Lấy danh sách loại thiết bị theo id
export const getListDeviceTypeById = async (typeId: number) => {
    try {
        const res = await apiClient.get(`/DeviceType/${typeId}`);
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Tạo mới thiết bị
export const createDeviceType = async (deviceType: DeviceType) => {
    try {
        const res = await apiClient.post("/createDeviceType", deviceType);
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Cập nhật thiết bị
export const updateDeviceType = async (
    typeId: number,
    deviceType: DeviceType
) => {
    try {
        const res = await apiClient.put(`/${typeId}`, deviceType);
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Xóa thiết bị
export const deleteDeviceType = async (typeId: number) => {
    try {
        await apiClient.delete(`/${typeId}`);
        return true;
    } catch (error) {
        return handleError(error);
    }
};
