export interface DeviceType {
    typeId?: number | null;
    typeCode?: string | null;
    typeName: string;
    defaultFrequency: number | null;
    description?: string;
    createAt: Date | string | null;
    createBy: string;
    updateAt: Date | string | null;
    updateBy: string;
}
