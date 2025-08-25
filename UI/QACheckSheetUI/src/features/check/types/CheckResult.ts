export interface CheckResult {
    SheetId: number | null;
    DeviceTypeId: number | null;
    DeviceId: number | null;
    ItemId: number | null;
    FormNO?: string;
    SheetCode?: string;
    SheetName?: string;
    TypeCode?: string;
    TypeName?: string;
    DeviceCode?: string;
    DeviceName?: string;
    Location?: string;
    Factory?: string;
    Frequency: number | null;
    ParentItemId: number | null;
    Title?: string;
    OrderNumber: number | null;
    Level: number | null;
    PathTitles?: string;
    DataType?: string;
    Value?: string;
    CheckedBy?: string;
    CheckedDate?: Date | string | null;
    ConfirmBy?: string;
    ConfirmDate?: Date | string | null;
    UpdateBy?: string;
    UpdateAt?: Date | string | null;
}
