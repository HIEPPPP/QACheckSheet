import type {
    CreateCheckResultRequestDTO,
    UpdateResultRequestDTO,
} from "../types/CheckResult";
import axios, { AxiosError } from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + "/CheckResult",
    headers: {
        "Content-Type": "application/json",
    },
});

// Xử lý lỗi chung
const handleError = (error: any) => {
    console.error("API Error:", error.response?.data || error.message);
    return null;
};

// Thêm dữ liệu kiểm tra
export const createResult = async (result: CreateCheckResultRequestDTO[]) => {
    try {
        const res = await apiClient.post("/", result);
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Cập nhật dữ liệu
export const updateResult = async (
    resultId: number,
    result: UpdateResultRequestDTO
) => {
    try {
        const res = await apiClient.put(`/${resultId}`, result);
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Cập nhật nhiều dữ liệu
export const bulkUpdateResults = async (
    items: {
        resultId: number;
        value?: string;
        status?: string;
        updateBy?: string;
    }[]
) => {
    try {
        const res = await apiClient.put("/bulk", items);
        return res.data.data; // ApiResponse from server
    } catch (error) {
        return handleError(error);
    }
};

export const confirm = async (
    items: {
        resultId: number;
        confirmBy: string;
    }[]
) => {
    try {
        const res = await apiClient.put("/confirm", items);
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

// Lấy dữ liệu kết quả ngày theo sheetCode và deviceCode
export const getListResultDayBySDCode = async (
    sheetCode: string,
    deviceCode: string
) => {
    try {
        const res = await apiClient.get(
            `/getListResultDayBySDCode?sheetCode=${sheetCode}&deviceCode=${deviceCode}`
        );
        return res.data.data ?? [];
    } catch (error) {
        return handleError(error);
    }
};

// Lấy dữ liệu kết quả ngày
export const getListResultDay = async () => {
    try {
        const res = await apiClient.get("/getListResultDay");
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};
