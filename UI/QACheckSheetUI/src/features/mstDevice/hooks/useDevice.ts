import { useEffect, useState, useCallback } from "react";
import type { Device } from "../types/device";
import {
    getListDevice,
    createDevice,
    updateDevice,
    deleteDevice,
} from "../services/deviceServices";

type UseDevicesResult = {
    devices: Device[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    create: (payload: Device) => Promise<Device | null>;
    update: (id: number, payload: Device) => Promise<Device | null>;
    remove: (id: number) => Promise<boolean>;
};

export const useDevices = (): UseDevicesResult => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchList = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Replace with actual service call to fetch devices
            const res = await getListDevice();
            if (res) setDevices(res);
        } catch (err: any) {
            setError(err?.message || "Lỗi khi lấy danh sách");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchList();
    }, [fetchList]);

    const create = async (payload: Device) => {
        setLoading(true);
        try {
            // Replace with actual service call to create device
            const res = await createDevice(payload);
            setDevices((prev) => [res, ...prev]);
            return res;
        } catch (err) {
            return null;
        } finally {
            setLoading(false);
        }
    };

    const update = async (id: number, payload: Device) => {
        setLoading(true);
        try {
            // Replace with actual service call to update device
            const res = await updateDevice(id, payload);
            setDevices((prev) =>
                prev.map((p) => (p.deviceId === id ? { ...p, ...res } : p))
            );
            return res;
        } catch (err) {
            return null;
        } finally {
            setLoading(false);
        }
    };

    const remove = async (id: number) => {
        setLoading(true);
        try {
            // Replace with actual service call to delete device
            const res = await deleteDevice(id);
            if (res)
                setDevices((prev) => prev.filter((p) => p.deviceId !== id));
            return !!res;
        } catch (err) {
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        devices,
        loading,
        error,
        refresh: fetchList,
        create,
        update,
        remove,
    };
};
