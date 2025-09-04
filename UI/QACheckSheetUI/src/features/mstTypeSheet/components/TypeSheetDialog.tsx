import React, { useMemo, useCallback, useState, useEffect } from "react";
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

type Errors = {
    sheetName?: string;
    typeName?: string;
};

const TypeSheetDialogComponent: React.FC<TypeSheetDialogProps> = ({
    sheets,
    types,
    open,
    formData,
    setFormData,
    onSave,
    onClose,
}) => {
    const [errors, setErrors] = useState<Errors>({});

    useEffect(() => {
        if (!open) setErrors({});
    }, [open]);

    const validate = async (): Promise<boolean> => {
        const e: Errors = {};

        if (!formData.sheetName || formData.sheetName.trim() === "") {
            e.sheetName = "Check Sheet là bắt buộc";
        }

        if (!formData.deviceTypeName || formData.deviceTypeName.trim() === "") {
            e.typeName = "Loại thiết bị là bắt buộc";
        }

        setErrors(e);

        return Object.keys(e).length === 0;
    };

    const handleSave = async () => {
        const ok = await validate();
        if (!ok) return;
        onSave();
    };

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
            fullWidth
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
                            error={Boolean(errors.sheetName)}
                            helperText={errors.sheetName}
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
                            error={Boolean(errors.typeName)}
                            helperText={errors.typeName}
                        />
                    )}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button onClick={handleSave} variant="contained">
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// memoize the whole component so it only re-renders when props shallow-change
const TypeSheetDialog = React.memo(TypeSheetDialogComponent);
export default TypeSheetDialog;
