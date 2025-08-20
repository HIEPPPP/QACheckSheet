import React, { useMemo, useCallback } from "react";
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import type { TypeSheetDTO } from "../types/typeSheet";
import type { Sheet } from "../../mstSheet/types/sheet";
import type { DeviceType } from "../../mstDeviceType/types/deviceType";

interface TypeSheetDialogProps {
    sheets: Sheet[];
    types: DeviceType[];
    open: boolean;
    formData: TypeSheetDTO;
    setFormData: (
        data: TypeSheetDTO | ((prev: TypeSheetDTO) => TypeSheetDTO)
    ) => void;
    onSave: () => void;
    onClose: () => void;
}

// move style object out to keep stable reference
const AUTOCOMPLETE_SX = { my: 2 } as const;

const TypeSheetDialogComponent: React.FC<TypeSheetDialogProps> = ({
    sheets,
    types,
    open,
    formData,
    setFormData,
    onSave,
    onClose,
}) => {
    // compute selected option objects once (stable refs when deps unchanged)
    const sheetValue = useMemo(
        () => sheets?.find((s) => s.sheetId === formData.sheetId) ?? null,
        [sheets, formData.sheetId]
    );
    const typeValue = useMemo(
        () => types?.find((t) => t.typeId === formData.deviceTypeId) ?? null,
        [types, formData.deviceTypeId]
    );

    const onSheetChange = useCallback(
        (_: unknown, newValue: Sheet | null) => {
            setFormData((prev) => ({
                ...prev,
                sheetId: newValue ? newValue.sheetId : null,
            }));
        },
        [setFormData]
    );

    const onTypeChange = useCallback(
        (_: unknown, newValue: DeviceType | null) => {
            setFormData((prev) => ({
                ...prev,
                deviceTypeId: newValue ? newValue.typeId : null,
            }));
        },
        [setFormData]
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            disableEnforceFocus
            disableAutoFocus
            disableRestoreFocus
        >
            <DialogTitle>
                {formData.sheetId ? "Cập Nhật Check Sheet" : "Thêm Check Sheet"}
            </DialogTitle>
            <DialogContent>
                <Autocomplete
                    sx={AUTOCOMPLETE_SX}
                    disablePortal
                    fullWidth
                    size="medium"
                    options={sheets ?? []}
                    getOptionLabel={(option) => option.sheetName}
                    value={sheetValue}
                    onChange={onSheetChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Check Sheet"
                            variant="outlined"
                        />
                    )}
                />

                <Autocomplete
                    sx={AUTOCOMPLETE_SX}
                    disablePortal
                    fullWidth
                    size="medium"
                    options={types ?? []}
                    getOptionLabel={(option) => option.typeName}
                    value={typeValue}
                    onChange={onTypeChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Loại Thiết Bị"
                            variant="outlined"
                        />
                    )}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button onClick={onSave} variant="contained">
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// memoize the whole component so it only re-renders when props shallow-change
const TypeSheetDialog = React.memo(TypeSheetDialogComponent);
export default TypeSheetDialog;
