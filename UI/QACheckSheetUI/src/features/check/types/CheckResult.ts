import { localVnStringWithOffset, vnTime } from "../../../utils/formatDateTime";
import type { User } from "../../users/types/users";

export interface CheckResult {
    resultId: number | null;
    sheetId: number | null;
    deviceTypeId: number | null;
    deviceId: number | null;
    itemId: number | null;
    formNO?: string;
    sheetCode?: string;
    sheetName?: string;
    typeCode?: string;
    typeName?: string;
    deviceCode?: string;
    deviceName?: string;
    location?: string;
    factory?: string;
    frequency: number | null;
    parentItemId: number | null;
    title?: string;
    orderNumber: number | null;
    level: number | null;
    pathTitles?: string;
    dataType?: string;
    value?: string;
    status?: string;
    checkedBy?: string;
    checkedDate?: Date | string | null;
    confirmBy?: string;
    confirmDate?: Date | string | null;
    updateBy?: string;
    updateAt?: Date | string | null;
}

export type ItemNode = {
    itemId: number;
    sheetId: number;
    parentItemId: number | null;
    orderNumber: number;
    level: number;
    title: string;
    dataType: string; // "BOOLEAN" | "NUMBER" | "TEXT" | ""
    min: number | null;
    max: number | null;
    isRequired: boolean;
    pathIds: string;
    pathTitles: string;
    children: ItemNode[];
};

export type AnswerValue = boolean | number | string | null;
export type ItemAnswer = {
    itemId: number;
    value: AnswerValue;
    status?: "OK" | "NG" | null;
};

export type CreateCheckResultRequestDTO = {
    sheetId?: number | null;
    deviceId?: number | null;
    deviceTypeId?: number | null;
    itemId?: number | null;

    formNO: string;
    sheetCode: string;
    sheetName: string;

    typeCode: string;
    typeName: string;

    deviceCode: string;
    deviceName: string;
    location: string;
    factory: string;
    frequency: string;

    parentItemId?: number | null;
    title: string;
    orderNumber: number;
    level: number;
    pathTitles?: string | null;
    dataType?: string | null;

    value: string;
    status: string;
    checkedBy: string;
    checkedDate: string;
    confirmBy: string;
    confirmDate?: string | null;
    updateBy: string;
    updateAt: string;
};

export type UpdateResultRequestDTO = {
    resultId: number;
    value: string;
    status?: string;
    updateBy: string;
};

function buildItemNodeMap(tree: ItemNode[]): Record<number, ItemNode> {
    const map: Record<number, ItemNode> = {};
    function walk(node: ItemNode) {
        map[node.itemId] = node;
        if (Array.isArray(node.children)) node.children.forEach(walk);
    }
    tree.forEach(walk);
    return map;
}

function formatValueForDTO(ans: ItemAnswer, node?: ItemNode): string {
    if (node?.dataType === "BOOLEAN") {
        if (ans.status) return ans.status; // "OK" or "NG"
        if (typeof ans.value === "boolean") return String(ans.value);
    }

    if (node?.dataType === "NUMBER") {
        return ans.value == null ? "" : String(ans.value);
    }

    const base = ans.value == null ? "" : String(ans.value);
    return base;
}

export function buildCheckResultsPayload(
    answers: Record<number, ItemAnswer>,
    itemsTree: ItemNode[],
    template: any,
    device: any,
    user: any
): CreateCheckResultRequestDTO[] {
    const itemMap = buildItemNodeMap(itemsTree);

    const payloads: CreateCheckResultRequestDTO[] = [];

    for (const [idStr, ans] of Object.entries(answers)) {
        const itemId = Number(idStr);
        const answered = ans.value !== null || ans.status !== null;
        if (!answered) continue;

        const node = itemMap[itemId];
        if (!node) {
            console.warn("No node metadata for itemId", itemId);
            continue;
        }

        const valueStr = formatValueForDTO(ans, node);

        // --- Tính toán status theo dataType và node metadata (min/max) ---
        let statusVal: "OK" | "NG" | "" = "";

        const dataType = (node.dataType ?? "").toString().toUpperCase();

        if (dataType === "BOOLEAN") {
            // ưu tiên ans.status nếu có
            if (ans.status === "OK" || ans.status === "NG") {
                statusVal = ans.status;
            } else {
                // nếu value là boolean hoặc string "true"/"false" hoặc "OK"/"NG"
                if (ans.value === true || ans.value === "true")
                    statusVal = "OK";
                else if (ans.value === false || ans.value === "false")
                    statusVal = "NG";
                else if (ans.value === "OK" || ans.value === "NG")
                    statusVal = ans.value as "OK" | "NG";
                else statusVal = "";
            }
        } else if (dataType === "NUMBER") {
            // cố gắng parse số từ ans.value
            if (
                ans.value === null ||
                ans.value === "" ||
                ans.value === undefined
            ) {
                statusVal = "";
            } else {
                const numeric =
                    typeof ans.value === "number"
                        ? ans.value
                        : Number(ans.value);
                if (!Number.isFinite(numeric)) {
                    statusVal = "";
                } else {
                    const min = node.min;
                    const max = node.max;
                    // Nếu có cả min và max: kiểm tra min <= numeric <= max (bao gồm biên)
                    if (min != null && max != null) {
                        statusVal =
                            numeric >= Number(min) && numeric <= Number(max)
                                ? "OK"
                                : "NG";
                    } else if (min != null) {
                        // chỉ có min: >= min => OK
                        statusVal = numeric >= Number(min) ? "OK" : "NG";
                    } else if (max != null) {
                        // chỉ có max: <= max => OK
                        statusVal = numeric <= Number(max) ? "OK" : "NG";
                    } else {
                        // không có biên -> không xác định status
                        statusVal = "";
                    }
                }
            }
        } else {
            // TEXT hoặc các kiểu khác: không có status mặc định
            statusVal = "";
        }

        const dto: CreateCheckResultRequestDTO = {
            sheetId: template?.sheetId ?? null,
            deviceId: device?.deviceId ?? null,
            deviceTypeId: device?.typeId ?? null,
            itemId: itemId,

            formNO: template?.formNO ?? template?.FormNO ?? "",
            sheetCode: template?.sheetCode ?? template?.SheetCode ?? "",
            sheetName: template?.sheetName ?? template?.SheetName ?? "",

            typeCode: device?.typeCode ?? device?.typeCode ?? "",
            typeName: device?.typeName ?? device?.typeName ?? "",

            deviceCode: device?.deviceCode ?? "",
            deviceName: device?.deviceName ?? "",
            location: device?.location ?? "",
            factory: device?.factory ?? "",
            frequency: device?.frequency ?? "",

            parentItemId: node.parentItemId ?? null,
            title: node.title ?? "",
            orderNumber: node.orderNumber ?? 0,
            level: node.level ?? 0,
            pathTitles: node.pathTitles ?? null,
            dataType: node.dataType ?? null,

            value: valueStr,
            status: statusVal,
            checkedBy: user?.userCode ?? "",
            checkedDate: new Date(vnTime).toISOString(),
            confirmBy: "",
            confirmDate: null,
            updateBy: user?.userCode ?? "",
            updateAt: new Date(vnTime).toISOString(),
        };

        payloads.push(dto);
    }

    return payloads;
}

export function buildEditResultsPayload(
    answers: Record<number, ItemAnswer>,
    itemsTree: ItemNode[],
    template: any,
    device: any,
    currentUser: any, // user đang thao tác (để set updateBy)
    checker?: User,
    confirmer?: User,
    dayRef?: string
): CreateCheckResultRequestDTO[] {
    console.log("dayRef", dayRef);

    const itemMap = buildItemNodeMap(itemsTree);
    const iso06 = localVnStringWithOffset(dayRef, 6);

    const payloads: CreateCheckResultRequestDTO[] = [];

    for (const [idStr, ans] of Object.entries(answers)) {
        const itemId = Number(idStr);
        const answered = ans.value !== null || ans.status !== null;
        if (!answered) continue;

        const node = itemMap[itemId];
        if (!node) {
            console.warn("No node metadata for itemId", itemId);
            continue;
        }

        const valueStr = formatValueForDTO(ans, node);

        // --- Tính toán status theo dataType và node metadata (min/max) ---
        let statusVal: "OK" | "NG" | "" = "";

        const dataType = (node.dataType ?? "").toString().toUpperCase();

        if (dataType === "BOOLEAN") {
            // ưu tiên ans.status nếu có
            if (ans.status === "OK" || ans.status === "NG") {
                statusVal = ans.status;
            } else {
                // nếu value là boolean hoặc string "true"/"false" hoặc "OK"/"NG"
                if (ans.value === true || ans.value === "true")
                    statusVal = "OK";
                else if (ans.value === false || ans.value === "false")
                    statusVal = "NG";
                else if (ans.value === "OK" || ans.value === "NG")
                    statusVal = ans.value as "OK" | "NG";
                else statusVal = "";
            }
        } else if (dataType === "NUMBER") {
            // cố gắng parse số từ ans.value
            if (
                ans.value === null ||
                ans.value === "" ||
                ans.value === undefined
            ) {
                statusVal = "";
            } else {
                const numeric =
                    typeof ans.value === "number"
                        ? ans.value
                        : Number(ans.value);
                if (!Number.isFinite(numeric)) {
                    statusVal = "";
                } else {
                    const min = node.min;
                    const max = node.max;
                    // Nếu có cả min và max: kiểm tra min <= numeric <= max (bao gồm biên)
                    if (min != null && max != null) {
                        statusVal =
                            numeric >= Number(min) && numeric <= Number(max)
                                ? "OK"
                                : "NG";
                    } else if (min != null) {
                        // chỉ có min: >= min => OK
                        statusVal = numeric >= Number(min) ? "OK" : "NG";
                    } else if (max != null) {
                        // chỉ có max: <= max => OK
                        statusVal = numeric <= Number(max) ? "OK" : "NG";
                    } else {
                        // không có biên -> không xác định status
                        statusVal = "";
                    }
                }
            }
        } else {
            // TEXT hoặc các kiểu khác: không có status mặc định
            statusVal = "";
        }

        const dto: CreateCheckResultRequestDTO = {
            sheetId: template?.sheetId ?? null,
            deviceId: device?.deviceId ?? null,
            deviceTypeId: device?.typeId ?? null,
            itemId: itemId,

            formNO: template?.formNO ?? template?.FormNO ?? "",
            sheetCode: template?.sheetCode ?? template?.SheetCode ?? "",
            sheetName: template?.sheetName ?? template?.SheetName ?? "",

            typeCode: device?.typeCode ?? device?.typeCode ?? "",
            typeName: device?.typeName ?? device?.typeName ?? "",

            deviceCode: device?.deviceCode ?? "",
            deviceName: device?.deviceName ?? "",
            location: device?.location ?? "",
            factory: device?.factory ?? "",
            frequency: device?.frequency ?? "",

            parentItemId: node.parentItemId ?? null,
            title: node.title ?? "",
            orderNumber: node.orderNumber ?? 0,
            level: node.level ?? 0,
            pathTitles: node.pathTitles ?? null,
            dataType: node.dataType ?? null,

            value: valueStr,
            status: statusVal,
            checkedBy: checker?.userCode ?? "",
            checkedDate: iso06,
            confirmBy: confirmer?.userCode ?? "",
            confirmDate: iso06,
            updateBy: currentUser?.userCode ?? "",
            updateAt: new Date(vnTime).toISOString(),
        };

        payloads.push(dto);
    }

    return payloads;
}
