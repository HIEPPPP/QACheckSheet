import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";

import type { Sheet } from "../types/sheet";
import { useEffect, useState } from "react";

interface DeviceFormDialogProps {
    open: boolean;
    formData: Sheet;
    setFormData: (data: Sheet) => void;
    onSave: () => void;
    onClose: () => void;
}

type Errors = {
    sheetName?: string;
    formNO?: string;
};

const DeviceFormDialog: React.FC<DeviceFormDialogProps> = ({
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
            e.sheetName = "Tên check sheet là bắt buộc";
        }

        if (!formData.formNO || formData.formNO.trim() === "") {
            e.formNO = "Số Form là bắt buộc";
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
                {formData.sheetId ? "Cập Nhật Check Sheet" : "Thêm Check Sheet"}
            </DialogTitle>
            <DialogContent>
                {/* <TextField
                label="Mã Check Sheet"
                fullWidth
                margin="dense"
                value={formData.sheetCode ?? ""}
                onChange={(e) =>
                    setFormData({ ...formData, sheetCode: e.target.value })
                }
                disabled
            /> */}
                <TextField
                    label="Tên Check Sheet"
                    fullWidth
                    margin="dense"
                    value={formData.sheetName ?? ""}
                    onChange={(e) =>
                        setFormData({ ...formData, sheetName: e.target.value })
                    }
                    error={Boolean(errors.sheetName)}
                    helperText={errors.sheetName}
                />
                <TextField
                    label="Form NO"
                    fullWidth
                    margin="dense"
                    value={formData.formNO ?? ""}
                    onChange={(e) =>
                        setFormData({ ...formData, formNO: e.target.value })
                    }
                    error={Boolean(errors.formNO)}
                    helperText={errors.formNO}
                />
                <TextField
                    label="Mô tả"
                    fullWidth
                    margin="dense"
                    value={formData.description ?? ""}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            description: e.target.value,
                        })
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

export default DeviceFormDialog;
