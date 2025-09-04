import { useCallback, useEffect, useState } from "react";
import type { Device } from "../../mstDevice/types/device";
import { getListDeviceDashboard } from "../../mstDevice/services/deviceServices";

type UseDashboardResult = {
    devices: Device[];
    loading: boolean;
    error: string | null;
};

export const useDashboard = (): UseDashboardResult => {
    const [devices, setDevice] = useState<Device[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchList = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getListDeviceDashboard();
            if (res) setDevice(res);
        } catch (err: any) {
            setError(err.message || "Lỗi khi lấy danh sách");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchList();
    }, [fetchList]);

    return { devices, loading, error };
};
