export interface CheckResult {
    SheetId: number | null;
    DeviceTypeId: number | null;
    DeviceId: number | null;
    ItemId: number | null;
    FormNO?: string;
    SheetCode?: string;
    SheetName?: string;
    TypeCode?: string;
    TypeName?: string;
    DeviceCode?: string;
    DeviceName?: string;
    Location?: string;
    Factory?: string;
    Frequency: number | null;
    ParentItemId: number | null;
    Title?: string;
    OrderNumber: number | null;
    Level: number | null;
    PathTitles?: string;
    DataType?: string;
    Value?: string;
    CheckedBy?: string;
    CheckedDate?: Date | string | null;
    ConfirmBy?: string;
    ConfirmDate?: Date | string | null;
    UpdateBy?: string;
    UpdateAt?: Date | string | null;
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
    note?: string | null;
};

export type CreateCheckResultRequestDTO = {
    SheetId?: number | null;
    DeviceId?: number | null;
    DeviceTypeId?: number | null;
    ItemId?: number | null;

    FormNO: string;
    SheetCode: string;
    SheetName: string;

    TypeCode: string;
    TypeName: string;

    DeviceCode: string;
    DeviceName: string;
    Location: string;
    Factory: string;
    Frequency: string;

    ParentItemId?: number | null;
    Title: string;
    OrderNumber: number;
    Level: number;
    PathTitles?: string | null;
    DataType?: string | null;

    Value: string;
    CheckedBy: string;
    CheckedDate: string;
    ConfirmBy: string;
    ConfirmDate?: string | null;
    UpdateBy: string;
    UpdateAt: string;
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
    // BOOLEAN priority: status OK/NG, else boolean value -> "true"/"false"
    if (node?.dataType === "BOOLEAN") {
        if (ans.status) return ans.status; // "OK" or "NG"
        if (typeof ans.value === "boolean") return String(ans.value);
    }

    if (node?.dataType === "NUMBER") {
        return ans.value == null ? "" : String(ans.value);
    }

    // TEXT or fallback
    const base = ans.value == null ? "" : String(ans.value);
    if (ans.note) {
        // backend DTO has no note field => append or change as you like
        return `${base}${base ? " || " : ""}note:${String(ans.note)}`;
    }
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
        // skip unanswered if you want:
        const answered =
            ans.value !== null ||
            ans.status !== null ||
            (ans.note && ans.note !== "");
        if (!answered) continue;

        const node = itemMap[itemId];
        // if node undefined, you may still send partial info, but better skip or handle gracefully
        if (!node) {
            console.warn("No node metadata for itemId", itemId);
            continue;
        }

        const valueStr = formatValueForDTO(ans, node);

        const dto: CreateCheckResultRequestDTO = {
            SheetId: template?.sheetId ?? null,
            DeviceId: device?.deviceId ?? null,
            DeviceTypeId: device?.deviceTypeId ?? null,
            ItemId: itemId,

            FormNO: template?.formNO ?? template?.FormNO ?? "",
            SheetCode: template?.sheetCode ?? template?.SheetCode ?? "",
            SheetName: template?.sheetName ?? template?.SheetName ?? "",

            TypeCode: device?.typeCode ?? device?.typeCode ?? "",
            TypeName: device?.typeName ?? device?.typeName ?? "",

            DeviceCode: device?.deviceCode ?? "",
            DeviceName: device?.deviceName ?? "",
            Location: device?.location ?? "",
            Factory: device?.factory ?? "",
            Frequency: device?.frequency ?? "",

            ParentItemId: node.parentItemId ?? null,
            Title: node.title ?? "",
            OrderNumber: node.orderNumber ?? 0,
            Level: node.level ?? 0,
            PathTitles: node.pathTitles ?? null,
            DataType: node.dataType ?? null,

            Value: valueStr,
            CheckedBy: user?.userCode ?? "",
            CheckedDate: new Date().toISOString(),
            ConfirmBy: "",
            ConfirmDate: null,
            UpdateBy: user?.userCode ?? "",
            UpdateAt: new Date().toISOString(),
        };

        payloads.push(dto);
    }

    return payloads;
}
