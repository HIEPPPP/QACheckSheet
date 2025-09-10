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
    min?: number | null;
    max?: number | null;
    checkedBy?: string;
    checkedDate?: Date | string | null;
    ngContentDetail?: string;
    fixContent?: string;
    fixedBy?: string;
    fixedDate?: Date | string | null;
    confirmedBy?: string;
    confirmedDate: Date | string | null;
    note?: string;
}

export interface UpdateValueResultPayload {
    resultId: number;
    value?: string;
    status?: string;
}

export interface ConfirmNgPayload {
    ngId: number;
    resultId: number;
    confirmedBy: string;
    confirmedDate: Date | string;
}
