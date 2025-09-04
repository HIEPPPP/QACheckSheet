import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    FormHelperText,
} from "@mui/material";
import type { ItemDTO, Sheet } from "../types/item";

interface ItemDialogProps {
    open: boolean;
    formData: ItemDTO;
    setFormData: (data: ItemDTO) => void;
    onSave: () => void;
    onClose: () => void;
    sheets: Sheet[];
}

type Errors = {
    sheetId?: string;
    title?: string;
};

const ItemDialog: React.FC<ItemDialogProps> = ({
    open,
    formData,
    setFormData,
    onSave,
    onClose,
    sheets,
}) => {
    const [errors, setErrors] = useState<Errors>({});

    useEffect(() => {
        if (!open) setErrors({});
    }, [open]);

    const validate = async (): Promise<boolean> => {
        const e: Errors = {};
        if (!formData.sheetId) {
            e.sheetId = "Sheet ID là bắt buộc";
        }

        if (!formData.title || formData.title.trim() === "") {
            e.title = "Nội dung là bắt buộc";
        }

        setErrors(e);

        return Object.keys(e).length === 0;
    };

    const handleSave = async () => {
        const ok = await validate();
        if (!ok) return;
        onSave();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            disableEnforceFocus
            disableAutoFocus
            disableRestoreFocus
        >
            <DialogTitle>
                {formData.itemId ? "Cập Nhật Nội Dung" : "Thêm Nội dung"}
            </DialogTitle>
            <DialogContent>
                <Autocomplete
                    id="sheet-id-autocomplete"
                    options={sheets}
                    getOptionLabel={(option) =>
                        `${option.sheetId} - ${option.sheetName}`
                    }
                    value={
                        sheets.find(
                            (sheet) => sheet.sheetId === formData.sheetId
                        ) || null
                    }
                    onChange={(_, newValue) => {
                        if (newValue) {
                            setFormData({
                                ...formData,
                                sheetId: Number(newValue.sheetId),
                            });
                        }
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Sheet ID"
                            error={Boolean(errors.sheetId)}
                            helperText={errors.sheetId}
                        />
                    )}
                    sx={{ marginTop: 2 }}
                    disabled={formData.itemId !== null}
                />
                <TextField
                    label="Nội dung"
                    fullWidth
                    margin="dense"
                    value={formData.title ?? ""}
                    onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                    }
                    error={Boolean(errors.title)}
                    helperText={errors.title}
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel id="data-type-label">Kiểu dữ liệu</InputLabel>
                    <Select
                        labelId="data-type-label"
                        id="data-type-select"
                        value={formData.dataType ?? ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                dataType: e.target.value,
                            })
                        }
                        label="Kiểu dữ liệu"
                    >
                        <MenuItem value="">-- Chọn kiểu dữ liệu --</MenuItem>
                        <MenuItem value="BOOLEAN">BOOLEAN</MenuItem>
                        <MenuItem value="TEXT">TEXT</MenuItem>
                        <MenuItem value="NUMBER">NUMBER</MenuItem>
                        <MenuItem value="DATE">DATE</MenuItem>
                    </Select>
                    {/* {errors.dataType && (
                        <FormHelperText>{errors.dataType}</FormHelperText>
                    )} */}
                    <TextField
                        label="Min"
                        fullWidth
                        margin="dense"
                        type="number"
                        value={formData.min ?? ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                min: Number(e.target.value),
                            })
                        }
                    />
                    <TextField
                        label="Max"
                        fullWidth
                        margin="dense"
                        type="number"
                        value={formData.max ?? ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                max: Number(e.target.value),
                            })
                        }
                    />
                </FormControl>
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
