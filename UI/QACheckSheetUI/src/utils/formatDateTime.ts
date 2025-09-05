const now = new Date();
export const vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);

export const formatDateTime = (date: Date | string | null) => {
    if (!date) return "";
    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(0);
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

// utils/date.ts
export const toMonthStartString = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;

/**
 * Nhận một string có thể là "YYYY-MM" hoặc "YYYY-MM-01" -> trả về Date object
 * Tạo Date bằng new Date(year, monthIndex, 1) để tránh lỗi timezone.
 */
export const parseMonthRefToDate = (monthRef?: string): Date => {
    if (!monthRef) return new Date(); // fallback: today
    // tách phần năm-tháng
    const parts = monthRef.split("-");
    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1; // monthIndex
    return new Date(year, month, 1);
};
