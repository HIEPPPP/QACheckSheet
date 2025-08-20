import type { TypeSheetDTO } from "./../types/typeSheet";
import type { Sheet } from "../../mstSheet/types/sheet";
import type { DeviceType } from "../../mstDeviceType/types/deviceType";
import { useEffect, useState, useCallback } from "react";
import { getListDeviceType } from "../../mstDeviceType/services/deviceTypeServices";
import { getListSheet } from "./../../mstSheet/services/sheetServices";
import {
    createTypeSheet,
    deleteTypeSheet,
    getListTypeSheet,
    updateTypeSheet,
} from "../services/typeSheet.service";

type UserSheetResult = {
    sheets: Sheet[];
    types: DeviceType[];
    typeSheets: TypeSheetDTO[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    create: (payload: TypeSheetDTO) => Promise<Sheet | null>;
    update: (id: number, payload: TypeSheetDTO) => Promise<TypeSheetDTO | null>;
    remove: (id: number) => Promise<boolean>;
};

export const useDeviceTypes = (): UserSheetResult => {
    const [sheets, setSheets] = useState<Sheet[]>([]);
    const [types, setTypes] = useState<DeviceType[]>([]);
    const [typeSheets, setTypeSheets] = useState<TypeSheetDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchList = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const sheets = await getListSheet();
            if (sheets) setSheets(sheets);

            const deviceTypes = await getListDeviceType();
            if (deviceTypes) setTypes(deviceTypes);

            const typeSheets = await getListTypeSheet();
            if (typeSheets) setTypeSheets(typeSheets);
        } catch (err: any) {
            setError(err?.message || "Lỗi khi lấy danh sách");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchList();
    }, [fetchList]);

    const create = async (payload: TypeSheetDTO) => {
        setLoading(true);
        try {
            const res = await createTypeSheet(payload);
            setTypeSheets((prev) => [res, ...prev]);
            return res;
        } catch (err) {
            return null;
        } finally {
            setLoading(false);
        }
    };

    const update = async (id: number, payload: TypeSheetDTO) => {
        setLoading(true);
        try {
            const res = await updateTypeSheet(id, payload);
            setTypeSheets((prev) =>
                prev.map((p) => (p.id === id ? { ...p, ...res } : p))
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
            const res = await deleteTypeSheet(id);
            if (res) setTypeSheets((prev) => prev.filter((p) => p.id === id));
            return !!res;
        } catch {
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        sheets,
        types,
        typeSheets,
        loading,
        error,
        refresh: fetchList,
        create,
        update,
        remove,
    };
};

export default useDeviceTypes;
