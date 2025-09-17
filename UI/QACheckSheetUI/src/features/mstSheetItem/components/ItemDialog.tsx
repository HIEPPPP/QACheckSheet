// ItemDialog.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { ItemDTO, Sheet } from "../types/item";

interface ItemDialogProps {
    open: boolean;
    initialData: ItemDTO;
    onSave: (data: ItemDTO) => void | Promise<void>;
    onClose: () => void;
    sheets: Sheet[];
}

type Errors = { sheetId?: string; title?: string };

const ItemDialog: React.FC<ItemDialogProps> = ({
    open,
    initialData,
    onSave,
    onClose,
    sheets,
}) => {
    const [item, setItem] = useState<ItemDTO>(initialData);
    const [errors, setErrors] = useState<Errors>({});

    useEffect(() => {
        if (open) {
            setItem(initialData);
            setErrors({});
        }
    }, [open, initialData]);

    const validate = (): boolean => {
        const e: Errors = {};
        if (!item.sheetId) e.sheetId = "Sheet ID là bắt buộc";
        if (!item.title || item.title.trim() === "")
            e.title = "Nội dung là bắt buộc";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        await onSave(item);
    };

    const sheetValue = useMemo(
        () => sheets.find((s) => s.sheetId === item.sheetId) || null,
        [sheets, item.sheetId]
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
                {item.itemId ? "Cập Nhật Nội Dung" : "Thêm Nội dung"}
            </DialogTitle>
            <DialogContent>
                <Autocomplete
                    id="sheet-id-autocomplete"
                    options={sheets}
                    getOptionLabel={(option) =>
                        `${option.sheetId} - ${option.sheetName}`
                    }
                    value={sheetValue}
                    isOptionEqualToValue={(option, value) =>
                        option.sheetId === value?.sheetId
                    }
                    onChange={(_, newValue) =>
                        setItem((prev) => ({
                            ...prev,
                            sheetId: newValue ? Number(newValue.sheetId) : null,
                        }))
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Sheet ID"
                            error={Boolean(errors.sheetId)}
                            helperText={errors.sheetId}
                        />
                    )}
                    sx={{ marginTop: 2 }}
                    disabled={item.itemId !== null}
                />

                <TextField
                    label="Nội dung"
                    fullWidth
                    margin="dense"
                    value={item.title ?? ""}
                    onChange={(e) =>
                        setItem((prev) => ({ ...prev, title: e.target.value }))
                    }
                    multiline
                    minRows={1}
                    maxRows={20}
                    error={Boolean(errors.title)}
                    helperText={errors.title}
                />

                <FormControl fullWidth margin="dense">
                    <InputLabel id="data-type-label">Kiểu dữ liệu</InputLabel>
                    <Select
                        labelId="data-type-label"
                        id="data-type-select"
                        value={item.dataType ?? ""}
                        onChange={(e) =>
                            setItem((prev) => ({
                                ...prev,
                                dataType: e.target.value,
                            }))
                        }
                        label="Kiểu dữ liệu"
                    >
                        <MenuItem value="">-- Chọn kiểu dữ liệu --</MenuItem>
                        <MenuItem value="BOOLEAN">BOOLEAN</MenuItem>
                        <MenuItem value="TEXT">TEXT</MenuItem>
                        <MenuItem value="NUMBER">NUMBER</MenuItem>
                        <MenuItem value="DATE">DATE</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="Min"
                    fullWidth
                    margin="dense"
                    type="number"
                    value={item.min ?? ""}
                    onChange={(e) =>
                        setItem((prev) => ({
                            ...prev,
                            min:
                                e.target.value === ""
                                    ? null
                                    : Number(e.target.value),
                        }))
                    }
                />
                <TextField
                    label="Max"
                    fullWidth
                    margin="dense"
                    type="number"
                    value={item.max ?? ""}
                    onChange={(e) =>
                        setItem((prev) => ({
                            ...prev,
                            max:
                                e.target.value === ""
                                    ? null
                                    : Number(e.target.value),
                        }))
                    }
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

export default ItemDialog;
