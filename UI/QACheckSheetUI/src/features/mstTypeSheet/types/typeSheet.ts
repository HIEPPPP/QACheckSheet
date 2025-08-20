export interface TypeSheetDTO {
    id: number | null;
    deviceTypeId?: number | null;
    sheetId?: number | null;
    deviceTypeCode?: string | "";
    deviceTypeName?: string | "";
    sheetCode?: string | "";
    sheetName?: string | "";
    createAt: Date | string | null;
    createBy: string;
    updateAt: Date | string | null;
    updateBy: string;
}
