export interface ConfirmApproveResult {
    sheetCode?: string;
    sheetName?: string;
    deviceCode?: string;
    deviceName?: string;
    confirmedBy?: string;
    approvedBy?: string;
}

export interface ReportHeader {
    confirmApproveId?: number;
    sheetCode?: string;
    sheetName?: string;
    deviceCode?: string;
    deviceName?: string;
    defaultFrequency?: number | null;
    frequencyOverride?: number | null;
    confirmedBy?: string;
    approvedBy?: string;
}

export type ReportData = {
    content: string;
    [key: string]: string | number | null | undefined;
};

export interface ReportNG {
    resultId?: number;
    checkedDate?: Date | string;
    pathTitles?: string;
    ngContentDetail?: string;
    fixContent?: string;
    status?: string;
    fixedBy?: string;
    confirmedBy?: string;
}

// Report
export interface CreateConfirm {
    sheetCode: string;
    deviceCode: string;
    confirmedBy: string;
    confirmedDate: Date | string;
}

export interface UpdateApprove {
    confirmApproveId: number;
    approvedBy: string;
    approvedDate: Date | string;
}
