import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getListResultDay } from "../features/check/services/checkServices";
import { getListDevice } from "../features/mstDevice/services/deviceServices";

export type DeviceStatus = "OK" | "NG" | "Pending";

export type DeviceStatusEntry = {
    deviceId: number;
    deviceCode?: string;
    deviceName?: string;
    status: DeviceStatus;
    okCount: number;
    ngCount: number;
    pendingCount: number;
    confirmBy?: string | null;
    lastUpdate?: string | null;
};

export type StatusTotals = {
    totalDevices: number;
    ok: number;
    ng: number;
    pending: number;
    confirmed: number;
};

type StatusContextValue = {
    statusMap: Record<number, DeviceStatusEntry>;
    totals: StatusTotals;
    refreshStatus: () => Promise<void>;
    lastFetchedAt?: string | null;
    loading: boolean;
    error?: string | null;
};

const StatusContext = createContext<StatusContextValue>({
    statusMap: {},
    totals: { totalDevices: 0, ok: 0, ng: 0, pending: 0, confirmed: 0 },
    refreshStatus: async () => {},
    lastFetchedAt: null,
    loading: false,
    error: null,
});

export const StatusProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [statusMap, setStatusMap] = useState<
        Record<number, DeviceStatusEntry>
    >({});
    const [totals, setTotals] = useState<StatusTotals>({
        totalDevices: 0,
        ok: 0,
        ng: 0,
        pending: 0,
        confirmed: 0,
    });
    const [lastFetchedAt, setLastFetchedAt] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getNum = (obj: any, ...keys: string[]) => {
        for (const k of keys) {
            if (obj == null) continue;
            if (obj[k] !== undefined && obj[k] !== null) return obj[k];
        }
        return undefined;
    };

    // pickLatest unchanged
    const pickLatest = (a: any, b: any) => {
        if (!a) return b;
        if (!b) return a;
        const aTime =
            a?.updateAt ??
            a?.checkedDate ??
            a?.UpdateAt ??
            a?.CheckedDate ??
            null;
        const bTime =
            b?.updateAt ??
            b?.checkedDate ??
            b?.UpdateAt ??
            b?.CheckedDate ??
            null;
        if (aTime && bTime) {
            const ad = new Date(aTime);
            const bd = new Date(bTime);
            if (!isNaN(ad.getTime()) && !isNaN(bd.getTime()))
                return bd > ad ? b : a;
        }
        const aId =
            getNum(a, "resultId", "ResultId", "ResultID", "id", "Id") ?? 0;
        const bId =
            getNum(b, "resultId", "ResultId", "ResultID", "id", "Id") ?? 0;
        return Number(bId) > Number(aId) ? b : a;
    };

    const buildStatusFromResults = (devicesList: any[], results: any[]) => {
        const deviceResultsMap: Record<number, Record<number, any>> = {};

        for (const r of results) {
            const deviceId = Number(
                getNum(r, "deviceId", "DeviceId", "DeviceID")
            );
            const itemId = Number(getNum(r, "itemId", "ItemId", "ItemID"));
            if (!deviceId || !itemId) continue;
            deviceResultsMap[deviceId] = deviceResultsMap[deviceId] ?? {};
            deviceResultsMap[deviceId][itemId] = pickLatest(
                deviceResultsMap[deviceId][itemId],
                r
            );
        }

        // step2: initialize map with all devices (so devices with no result are present)
        const map: Record<number, DeviceStatusEntry> = {};
        for (const d of devicesList) {
            const devId = Number(getNum(d, "deviceId", "DeviceId", "DeviceID"));
            if (!devId) continue;
            map[devId] = {
                deviceId: devId,
                deviceCode:
                    getNum(d, "deviceCode", "DeviceCode", "devicecode") ??
                    undefined,
                deviceName:
                    getNum(d, "deviceName", "DeviceName", "devicename") ??
                    undefined,
                status: "Pending", // mặc định pending cho devices chưa có result
                okCount: 0,
                ngCount: 0,
                pendingCount: 0,
                confirmBy: null,
                lastUpdate: null,
            };
        }

        // step3: compute counts for each device that has results
        for (const [devIdStr, itemsObj] of Object.entries(deviceResultsMap)) {
            const devId = Number(devIdStr);
            // ensure device exists in map (if results for device not in devicesList, still create entry)
            if (!map[devId]) {
                map[devId] = {
                    deviceId: devId,
                    deviceCode: undefined,
                    deviceName: undefined,
                    status: "Pending",
                    okCount: 0,
                    ngCount: 0,
                    pendingCount: 0,
                    confirmBy: null,
                    lastUpdate: null,
                };
            }

            let okCount = 0;
            let ngCount = 0;
            let pendingCount = 0;
            let confirmBy: string | null = null;
            let lastUpdate: string | null = map[devId].lastUpdate ?? null;
            let deviceCode = map[devId].deviceCode;
            let deviceName = map[devId].deviceName;

            for (const r of Object.values(itemsObj)) {
                deviceCode =
                    deviceCode ??
                    getNum(r, "deviceCode", "DeviceCode", "devicecode");
                deviceName =
                    deviceName ??
                    getNum(r, "deviceName", "DeviceName", "devicename");

                const statusField = (getNum(r, "status", "Status") ?? "")
                    .toString()
                    .toUpperCase();
                const dataType = (
                    (getNum(r, "dataType", "DataType") ?? "") as string
                ).toUpperCase();
                const value = getNum(r, "value", "Value");

                let itemStatus: "OK" | "NG" | "PENDING" = "PENDING";
                if (statusField === "OK" || statusField === "NG") {
                    itemStatus = statusField === "OK" ? "OK" : "NG";
                } else if (dataType === "BOOLEAN") {
                    const v = (value ?? "").toString().toUpperCase();
                    if (v === "OK" || v === "NG")
                        itemStatus = v === "OK" ? "OK" : "NG";
                } else if (
                    value !== undefined &&
                    value !== null &&
                    String(value).trim() !== ""
                ) {
                    itemStatus = "OK";
                } else {
                    itemStatus = "PENDING";
                }

                if (itemStatus === "OK") okCount++;
                else if (itemStatus === "NG") ngCount++;
                else pendingCount++;

                const cb = getNum(r, "confirmBy", "ConfirmBy", "confirmby");
                if (cb) confirmBy = cb;

                const rTime =
                    getNum(
                        r,
                        "updateAt",
                        "UpdateAt",
                        "checkedDate",
                        "CheckedDate"
                    ) ?? null;
                if (rTime) {
                    const rt = new Date(rTime);
                    if (!isNaN(rt.getTime())) {
                        if (!lastUpdate) lastUpdate = rt.toISOString();
                        else if (new Date(lastUpdate) < rt)
                            lastUpdate = rt.toISOString();
                    }
                }
            }

            // overall status (NG > OK > Pending)
            let overall: DeviceStatus = "Pending";
            if (ngCount > 0) overall = "NG";
            else if (pendingCount === 0 && okCount > 0) overall = "OK";
            else overall = "Pending";

            map[devId] = {
                deviceId: devId,
                deviceCode,
                deviceName,
                status: overall,
                okCount,
                ngCount,
                pendingCount,
                confirmBy: confirmBy ?? null,
                lastUpdate,
            };
        }

        // totals: important -> totalDevices is length of devicesList (full fleet)
        const totals: StatusTotals = {
            totalDevices: devicesList.length,
            ok: 0,
            ng: 0,
            pending: 0,
            confirmed: 0,
        };

        for (const e of Object.values(map)) {
            if (e.status === "OK") totals.ok++;
            else if (e.status === "NG") totals.ng++;
            if (e.confirmBy) totals.confirmed++;
        }

        // pending defined as totalDevices - ok - ng
        totals.pending = Math.max(
            0,
            totals.totalDevices - totals.ok - totals.ng
        );

        return { map, totals };
    };

    const refreshStatus = async () => {
        setLoading(true);
        setError(null);
        try {
            // gọi đồng thời devices và results để tối ưu
            const [devicesRes, resultsRes] = await Promise.all([
                getListDevice(),
                getListResultDay(),
            ]);
            const devicesList = Array.isArray(devicesRes)
                ? devicesRes
                : devicesRes
                ? [devicesRes]
                : [];
            const results = Array.isArray(resultsRes)
                ? resultsRes
                : resultsRes
                ? [resultsRes]
                : [];
            const { map, totals } = buildStatusFromResults(
                devicesList,
                results
            );
            setStatusMap(map);
            setTotals(totals);
            setLastFetchedAt(new Date().toISOString());
        } catch (err: any) {
            setError(err?.message ?? String(err));
            console.error("StatusContext.refreshStatus error", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void refreshStatus();
    }, []);

    return (
        <StatusContext.Provider
            value={{
                statusMap,
                totals,
                refreshStatus,
                lastFetchedAt,
                loading,
                error,
            }}
        >
            {children}
        </StatusContext.Provider>
    );
};

export const useStatus = () => useContext(StatusContext);
