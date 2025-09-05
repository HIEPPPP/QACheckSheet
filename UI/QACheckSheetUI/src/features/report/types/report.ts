export interface ConfirmApproveResult {
    sheetCode?: string;
    sheetName?: string;
    deviceCode?: string;
    deviceName?: string;
    confirmedBy?: string;
    approvedBy?: string;
}

export interface ReportHeader {
    sheetCode?: string;
    sheetName?: string;
    deviceCode?: string;
    deviceName?: string;
    defaultFrequency?: number | null;
    frequencyOverride?: number | null;
    confirmedBy?: string;
    approvedBy?: string;
}
