import { useCallback, useEffect, useState } from "react";
import type { Sheet } from "../../mstSheet/types/sheet";
import type { DeviceSheet } from "../types/editData";
import { getListSheet } from "../../mstSheet/services/sheetServices";
import { getDevicesBySheetCode } from "../../mstDevice/services/deviceServices";

type UseEditData = {
    sheets: Sheet[];
    sheetCode: string;
    setSheetCode: (code: string) => void;
    deviceSheet: DeviceSheet[];
    dayRef: string;
    setDayRef: (date: string) => void;
};

export const useEditContainer = (): UseEditData => {
    const [sheets, setSheets] = useState<Sheet[]>([]);
    const [sheetCode, setSheetCode] = useState<string>("");
    const [deviceSheet, setDeviceSheet] = useState<DeviceSheet[]>([]);
    const [dayRef, setDayRef] = useState<string>("");

    const fetchSheet = useCallback(async () => {
        try {
            const res = await getListSheet();
            if (res) setSheets(res);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        void fetchSheet();
    }, [fetchSheet]);

    useEffect(() => {
        const fetchDevices = async () => {
            if (sheetCode) {
                try {
                    const res = await getDevicesBySheetCode(sheetCode);
                    if (res) setDeviceSheet(res);
                } catch (err) {
                    console.error(err);
                }
            } else {
                setDeviceSheet([]);
            }
        };
        void fetchDevices();
    }, [sheetCode]);

    return {
        sheets,
        sheetCode,
        setSheetCode,
        deviceSheet,
        dayRef,
        setDayRef,
    };
};
