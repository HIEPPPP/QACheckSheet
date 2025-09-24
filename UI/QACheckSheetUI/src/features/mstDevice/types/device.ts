export interface Device {
    deviceId?: number | null;
    typeId?: number | null;
    sheetCode?: string;
    sheetName?: string;
    typeCode?: string;
    typeName?: string;
    deviceCode?: string | null;
    deviceName: string;
    seriNumber: string;
    model: string;
    area: string;
    location: string;
    factory: string;
    status: string;
    frequencyOverride: number | null;
    description?: string;
    createAt: Date | string | null;
    createBy: string;
    updateAt: Date | string | null;
    updateBy: string;
}
