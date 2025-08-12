import { useEffect, useState, useCallback } from "react";
import type { Sheet } from "../types/sheet";
import {
    getListSheet,
    createSheet,
    updateSheet,
    deleteSheet,
} from "../services/sheetServices";

type UserSheetResult = {
    sheets: Sheet[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    create: (payload: Sheet) => Promise<Sheet | null>;
    update: (id: number, payload: Sheet) => Promise<Sheet | null>;
    remove: (id: number) => Promise<boolean>;
};

export const useDeviceTypes = (): UserSheetResult => {
    const [sheets, setSheets] = useState<Sheet[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchList = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getListSheet();
            if (res) setSheets(res);
        } catch (err: any) {
            setError(err?.message || "Lỗi khi lấy danh sách");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchList();
    }, [fetchList]);

    const create = async (payload: Sheet) => {
        setLoading(true);
        try {
            const res = await createSheet(payload);
            setSheets((prev) => [res, ...prev]);
            return res;
        } catch (err) {
            return null;
        } finally {
            setLoading(false);
        }
    };

    const update = async (id: number, payload: Sheet) => {
        setLoading(true);
        try {
            const res = await updateSheet(id, payload);
            setSheets((prev) =>
                prev.map((p) => (p.sheetId === id ? { ...p, ...res } : p))
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
            const res = await deleteSheet(id);
            if (res) setSheets((prev) => prev.filter((p) => p.sheetId !== id));
            return !!res;
        } catch {
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        sheets,
        loading,
        error,
        refresh: fetchList,
        create,
        update,
        remove,
    };
};

export default useDeviceTypes;
