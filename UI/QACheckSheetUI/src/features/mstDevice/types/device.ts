export interface Device {
    deviceId?: number | null;
    typeId?: number | null;
    typeName?: string;
    deviceCode: string;
    deviceName: string;
    seriNumber: string;
    model: string;
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
