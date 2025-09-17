import axios from "axios";
import { toMonthStartString } from "../../../utils/formatDateTime";
import type { ReportData, ReportHeader, ReportNG } from "../types/report";

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

// Lấy danh sách kết quả để xác nhận và phê duyệt (Table)
export const getListResultApproveConfirmByMonth = async (
    monthRef: Date | string
) => {
    try {
        // Nếu truyền Date -> biến thành "YYYY-MM-01"
        const monthRefStr =
            typeof monthRef === "string"
                ? monthRef
                : toMonthStartString(monthRef);

        // Dùng axios params để encode an toàn
        const res = await apiClient.get("/getListResultApproveConfirmByMonth", {
            params: { monthRef: monthRefStr },
        });

        return res.data.data ?? [];
    } catch (error) {
        return handleError(error);
    }
};

// Lấy Header report
export const getHeaderReport = async (
    sheetCode: string,
    deviceCode: string,
    monthRef: Date | string
): Promise<ReportHeader | null> => {
    try {
        const monthRefStr =
            typeof monthRef === "string"
                ? monthRef
                : toMonthStartString(monthRef);
        const res = await apiClient.get("/getHeaderReport", {
            params: { sheetCode, deviceCode, monthRef: monthRefStr },
        });

        // API trả về data là mảng — lấy phần tử đầu hoặc null
        const payload = res.data?.data;
        if (Array.isArray(payload)) {
            return payload.length > 0 ? (payload[0] as ReportHeader) : null;
        }
        // Nếu backend thay đổi shape và trả object trực tiếp:
        return payload ?? null;
    } catch (error) {
        return handleError(error);
    }
};

export const getResultReport = async (
    sheetCode: string,
    deviceCode: string,
    monthRef: Date | string
): Promise<ReportData[] | null> => {
    try {
        const monthRefStr =
            typeof monthRef === "string"
                ? monthRef
                : toMonthStartString(monthRef);
        const res = await apiClient.get("/getResultReport", {
            params: { sheetCode, deviceCode, monthRef: monthRefStr },
        });

        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};

export const getNGReport = async (
    sheetCode: string,
    deviceCode: string,
    monthRef: Date | string
): Promise<ReportNG[] | null> => {
    try {
        const monthRefStr =
            typeof monthRef === "string"
                ? monthRef
                : toMonthStartString(monthRef);
        const res = await apiClient.get("/getNGReport", {
            params: { sheetCode, deviceCode, monthRef: monthRefStr },
        });

        return res.data.data;
    } catch (error) {
        return handleError(error);
    }
};
