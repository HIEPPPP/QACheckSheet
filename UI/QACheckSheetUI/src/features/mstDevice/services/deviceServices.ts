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

// Lấy danh sách thiết bị
export const getListDevice = async () => {
    try {
        const res = await apiClient.get("/");
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Lấy danh sách thiết bị cho dashboard
export const getListDeviceDashboard = async () => {
    try {
        const res = await apiClient.get("/getListDeviceDashboard");
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Lấy danh sách thiết bị theo id
export const getDeviceById = async (deviceID: number) => {
    try {
        const res = await apiClient.get(`/${deviceID}`);
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Lấy theo code
export const getDeviceByCode = async (deviceCode: string) => {
    try {
        const res = await apiClient.get(`/${deviceCode}`);
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Lấy theo sheetCode
export const getDevicesBySheetCode = async (sheetCode: string) => {
    try {
        const res = await apiClient.get(`/getDevicesBySheetCode`, {
            params: { sheetCode },
        });
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
