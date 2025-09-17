import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Button,
} from "@mui/material";
import type { CreateItemDTO } from "../types/item";

interface ItemChildDialogProps {
    open: boolean;
    /** Initial data for the dialog. Dialog will manage its own item form state. */
    initialData: CreateItemDTO;
    /** Called when user saves. Receives the current form data. */
    onSave: (data: CreateItemDTO) => void | Promise<void>;
    onClose: () => void;
}

type Errors = {
    title?: string;
};

const ItemChildDialog: React.FC<ItemChildDialogProps> = ({
    open,
    initialData,
    onSave,
    onClose,
}) => {
    const [item, setItem] = useState<CreateItemDTO>(initialData);
    const [errors, setErrors] = useState<Errors>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // when opened (or initialData changes) reset item state and errors
        if (open) {
            setItem(initialData);
            setErrors({});
        }
    }, [open, initialData]);

    const validate = (): boolean => {
        const e: Errors = {};
        if (!item.title || item.title.trim() === "") {
            e.title = "Nội dung là bắt buộc";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        try {
            setSaving(true);
            await onSave(item);
            onClose();
        } catch (err) {
            // bạn có thể show snackbar hoặc đặt lỗi chung ở đây
            console.error("Lỗi khi lưu ItemChild:", err);
        } finally {
            setSaving(false);
        }
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
                {item.itemId ? "Cập Nhật Nội dung Con" : "Thêm Nội dung Con"}
            </DialogTitle>

            <DialogContent>
                <TextField
                    label="ID Cha"
                    fullWidth
                    margin="dense"
                    value={
                        item.parentItemId != null
                            ? String(item.parentItemId)
                            : ""
                    }
                    disabled
                />

                <TextField
                    label="ND Cha"
                    fullWidth
                    margin="dense"
                    value={item.parentTitle ?? ""}
                    disabled
                />

                <TextField
                    label="ND Con"
                    fullWidth
                    margin="dense"
                    value={item.title ?? ""}
                    onChange={(e) =>
                        setItem((p) => ({ ...p, title: e.target.value }))
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
                        value={item.dataType ?? ""}
                        onChange={(e) =>
                            setItem((p) => ({
                                ...p,
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
                    {/* nếu muốn hiển thị helper của lỗi chung cho dataType, có thể thêm FormHelperText ở đây */}
                </FormControl>

                <TextField
                    label="Min"
                    fullWidth
                    margin="dense"
                    type="number"
                    value={item.min ?? ""}
                    onChange={(e) =>
                        setItem((p) => ({
                            ...p,
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
                        setItem((p) => ({
                            ...p,
                            max:
                                e.target.value === ""
                                    ? null
                                    : Number(e.target.value),
                        }))
                    }
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={saving}>
                    Hủy
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={saving}
                >
                    {saving ? "Đang lưu..." : "Lưu"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ItemChildDialog;
