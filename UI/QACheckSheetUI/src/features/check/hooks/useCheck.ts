import { useState } from "react";
import type { Device } from "../../mstDevice/types/device";
import type { Sheet } from "../../mstSheet/types/sheet";
import type { CheckResult } from "../types/CheckResult";
import type { ItemDTO } from "../../mstSheetItem/types/item";

type UseCheckResult = {
    template: Sheet;
    items: ItemDTO[];
    device: Device;
    error: string | null;
    create: (payload: CheckResult) => Promise<CheckResult | null>;
};

export const useCheck = (): UseCheckResult => {
    // Sate Sheet, DeviceType, Device
    const [template, setTemplate] = useState<Sheet>();
    const [device, setDevice] = useState<Device>();
    const [items, setItems] = useState<ItemDTO[]>([]);

    // State Loading, Error
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
};
