export interface ItemDTO {
    itemId: number | null;
    sheetId: number | null;
    parentItemId: number | null;
    title: string;
    pathIds?: string;
    pathTitles?: string;
    level?: number | null;
    dataType: string;
    min: number | null;
    max: number | null;
    isRequired: boolean;
    createAt: Date | string | null;
    createBy: string;
    updateAt: Date | string | null;
    updateBy: string;
    children: ItemDTO[];
}

export interface CreateItemDTO {
    itemId: number | null;
    sheetId: number | null;
    parentItemId: number | null;
    parentTitle?: string;
    title: string;
    dataType: string;
    min: number | null;
    max: number | null;
    isRequired: boolean;
    createAt: Date | string | null;
    createBy: string;
    updateAt: Date | string | null;
    updateBy: string;
    children: ItemDTO[];
}

export interface UpdateItemDTO {
    itemId: number | null;
    sheetId: number | null;
    parentItemId: number | null;
    parentTitle?: string;
    title: string;
    dataType: string;
    min: number | null;
    max: number | null;
    isRequired: boolean;
    updateAt: Date | string | null;
    updateBy: string;
    children: ItemDTO[];
}

export interface Sheet {
    sheetId: number;
    sheetName: string;
    sheetCode: string;
    formNO: string;
    items: ItemDTO[];
}
