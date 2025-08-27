import { useEffect, useState } from "react";
import type { Device } from "../../mstDevice/types/device";
import type { Sheet } from "../../mstSheet/types/sheet";
import { useNavigate } from "react-router-dom";
import type { ItemNode } from "../types/CheckResult";
import { getSheetByCode } from "../../mstSheet/services/sheetServices";
import { getDeviceByCode } from "../../mstDevice/services/deviceServices";
import { getListItemBySheetId } from "../../mstSheetItem/services/item.service";

export const useCheck = (rawCode?: string) => {
    const navigate = useNavigate();

    const [deviceCode, setDeviceCode] = useState<string>("");
    const [sheetCode, setSheetCode] = useState<string>("");

    const [template, setTemplate] = useState<Sheet>();
    const [device, setDevice] = useState<Device>();

    const [itemsTree, setItemsTree] = useState<ItemNode[] | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const [isLocked, setIsLocked] = useState<boolean>(false);

    useEffect(() => {
        if (!rawCode) {
            navigate("/");
            return;
        }
        const parts = rawCode.split("-");
        if (parts.length !== 2) {
            navigate("/");
            return;
        }
        setDeviceCode(parts[0]);
        setSheetCode(parts[1]);
    }, [rawCode, navigate]);

    useEffect(() => {
        if (!deviceCode || !sheetCode) return;

        let mounted = true; // avoid setState after unmount

        const fetchAll = async () => {
            setLoading(true);
            setError("");
            try {
                const [sheetRes, deviceRes] = await Promise.all([
                    getSheetByCode(sheetCode),
                    getDeviceByCode(deviceCode),
                ]);
                if (!mounted) return;
                if (sheetRes) setTemplate(sheetRes);
                if (deviceRes) setDevice(deviceRes);
            } catch (err: any) {
                if (!mounted) return;
                setError(err?.message ?? String(err));
            } finally {
                if (!mounted) return;
                setLoading(false);
            }
        };

        fetchAll();
        return () => {
            mounted = false;
        };
    }, [deviceCode, sheetCode]);

    useEffect(() => {
        if (!template?.sheetId) return;

        let mounted = true;
        const fetchTree = async () => {
            setLoading(true);
            try {
                const res = await getListItemBySheetId!(
                    Number(template.sheetId)
                );

                if (!mounted) return;
                // đảm bảo sắp xếp: children theo orderNumber
                const sortTree = (nodes: ItemNode[]): ItemNode[] =>
                    nodes
                        .slice()
                        .sort((a, b) => a.orderNumber - b.orderNumber)
                        .map((n) => ({
                            ...n,
                            children: sortTree(n.children || []),
                        }));

                setItemsTree(sortTree(res || []));
            } catch (err: any) {
                if (!mounted) return;
                setError(err?.message ?? String(err));
            } finally {
                if (!mounted) setLoading(false);
                else setLoading(false);
            }
        };
        fetchTree();
        return () => {
            mounted = false;
        };
    }, [template]);

    return {
        deviceCode,
        sheetCode,
        template,
        device,
        itemsTree,
        loading,
        error,
        isLocked,
        setIsLocked,
    } as const;
};
