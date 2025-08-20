export interface Sheet {
    sheetId?: number | null;
    sheetCode?: string | null;
    sheetName: string;
    formNO: string;
    description?: string;
    createAt: Date | string | null;
    createBy: string;
    updateAt: Date | string | null;
    updateBy: string;
}
