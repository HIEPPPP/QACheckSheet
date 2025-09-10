import axios, { AxiosError } from "axios";
import type { UpdateValueResultPayload } from "../types/ngDetail";

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

// Cập nhật value
export const updateValueOrStatus = async (
    resultId: number,
    result: UpdateValueResultPayload
) => {
    try {
        const res = await apiClient.put(
            `/updateValueOrStatus/${resultId}`,
            result
        );
        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};
