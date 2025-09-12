import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Autocomplete,
    TextField,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Button,
    FormHelperText,
} from "@mui/material";
import type { CreateItemDTO } from "../types/item";

interface ItemChildDialogProps {
    open: boolean;
    formData: any; // replace with actual type
    setFormData: (data: any) => void; // replace with actual type
    onSave: () => void;
    onClose: () => void;
}

type Errors = {
    title?: string;
};

const ItemChildDialog: React.FC<ItemChildDialogProps> = ({
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
                {formData.itemId
                    ? "Cập Nhật Nội dung Con"
                    : "Thêm Nội dung Con"}
            </DialogTitle>
            <DialogContent>
                <TextField
                    label="ID Cha"
                    fullWidth
                    margin="dense"
                    value={formData.parentItemId ?? ""}
                    disabled
                />
                <TextField
                    label="ND Cha"
                    fullWidth
                    margin="dense"
                    value={formData.parentTitle ?? ""}
                    disabled
                />
                <TextField
                    label="ND Con"
                    fullWidth
                    margin="dense"
                    value={formData.title ?? ""}
                    onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                    }
                    multiline
                    minRows={1}
                    maxRows={20}
                    error={Boolean(errors.title)}
                    helperText={errors.title}
                />
                <FormControl fullWidth margin="dense" required>
                    <InputLabel id="data-type-label">Kiểu dữ liệu *</InputLabel>
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

export default ItemChildDialog;
