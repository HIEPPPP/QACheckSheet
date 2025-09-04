export interface NgDetail {
    resultId: number | null;
    ngId: number | null;
    sheetCode?: string;
    sheetName?: string;
    deviceCode?: string;
    deviceName?: string;
    pathTitles?: string;
    dataType?: string;
    value?: string;
    status?: string;
    checkedBy?: string;
    checkedDate?: Date | string | null;
    nGContentDetail?: string;
    fixContent?: string;
    fixedDate?: Date | string | null;
    confirmedBy?: string;
    confirmedDate: Date | string | null;
    note?: string;
}
