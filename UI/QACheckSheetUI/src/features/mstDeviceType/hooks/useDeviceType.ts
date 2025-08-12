import { useEffect, useState, useCallback } from "react";
import type { DeviceType } from "../types/deviceType";
import {
    getListDeviceType,
    createDeviceType,
    updateDeviceType,
    deleteDeviceType,
} from "../services/deviceTypeServices";

type UseDeviceTypesResult = {
    deviceTypes: DeviceType[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    create: (payload: DeviceType) => Promise<DeviceType | null>;
    update: (id: number, payload: DeviceType) => Promise<DeviceType | null>;
    remove: (id: number) => Promise<boolean>;
};

export const useDeviceTypes = (): UseDeviceTypesResult => {
    const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchList = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getListDeviceType();
            if (res) setDeviceTypes(res);
        } catch (err: any) {
            setError(err?.message || "Lỗi khi lấy danh sách");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchList();
    }, [fetchList]);

    const create = async (payload: DeviceType) => {
        setLoading(true);
        try {
            const res = await createDeviceType(payload);
            setDeviceTypes((prev) => [res, ...prev]);
            return res;
        } catch (err) {
            return null;
        } finally {
            setLoading(false);
        }
    };

    const update = async (id: number, payload: DeviceType) => {
        setLoading(true);
        try {
            const res = await updateDeviceType(id, payload);
            setDeviceTypes((prev) =>
                prev.map((p) => (p.typeId === id ? { ...p, ...res } : p))
            );
            return res;
        } catch {
            return null;
        } finally {
            setLoading(false);
        }
    };

    const remove = async (id: number) => {
        setLoading(true);
        try {
            const res = await deleteDeviceType(id);
            if (res)
                setDeviceTypes((prev) => prev.filter((p) => p.typeId !== id));
            return !!res;
        } catch {
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        deviceTypes,
        loading,
        error,
        refresh: fetchList,
        create,
        update,
        remove,
    };
};

export default useDeviceTypes;
