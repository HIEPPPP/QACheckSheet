// hooks/useItem.ts
import { useEffect, useState, useCallback } from "react";
import type { Sheet, CreateItemDTO, UpdateItemDTO } from "../types/item";
import {
    getTreeItem,
    createItem,
    deleteItem,
    updateItem,
} from "../services/item.service";
import { getListSheet } from "../../mstSheet/services/sheetServices";

type UserItemResult = {
    sheets: Sheet[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    create: (payload: CreateItemDTO) => Promise<CreateItemDTO | null>;
    update: (
        id: number,
        payload: UpdateItemDTO
    ) => Promise<UpdateItemDTO | null>;
    remove: (id: number) => Promise<boolean>;
};

export const useItem = (): UserItemResult => {
    const [sheets, setSheets] = useState<Sheet[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchList = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getTreeItem();
            if (Array.isArray(res)) {
                setSheets(res);
            } else {
                setSheets(res?.data ?? []);
            }
        } catch (err: any) {
            setError(err?.message || "Lỗi khi lấy danh sách");
            setSheets([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchList();
    }, [fetchList]);

    const create = async (payload: CreateItemDTO) => {
        setLoading(true);
        try {
            const res = await createItem(payload);
            if (res) {
                await fetchList();
            }
            return res;
        } catch {
            return null;
        } finally {
            setLoading(false);
        }
    };

    const update = async (id: number, payload: UpdateItemDTO) => {
        setLoading(true);
        try {
            const res = await updateItem(id, payload);
            if (res) {
                await fetchList();
            }
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
            const ok = await deleteItem(id);
            if (ok) await fetchList();
            return !!ok;
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

export default useItem;
