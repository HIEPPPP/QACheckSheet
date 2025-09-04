import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";

import type { DeviceType } from "../types/deviceType";
import { useEffect, useState } from "react";

interface DeviceFormDialogProps {
    open: boolean;
    formData: DeviceType;
    setFormData: (data: DeviceType) => void;
    onSave: () => void;
    onClose: () => void;
}

type Errors = {
    typeName?: string;
    defaultFrequency?: string;
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

        // typeName: required
        if (!formData.typeName || formData.typeName.trim() === "") {
            e.typeName = "Tên loại thiết bị là bắt buộc";
        }

        if (Number(formData.defaultFrequency) < 1) {
            e.defaultFrequency = "Tần suất phải lớn hơn hoặc bằng 1";
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
                {formData.typeId
                    ? "Cập Nhật Loại Thiết Bị"
                    : "Thêm Loại Thiết Bị"}
            </DialogTitle>
            <DialogContent>
                <TextField
                    label="Tên loại thiết bị"
                    fullWidth
                    margin="dense"
                    value={formData.typeName ?? ""}
                    onChange={(e) =>
                        setFormData({ ...formData, typeName: e.target.value })
                    }
                    error={Boolean(errors.typeName)}
                    helperText={errors.typeName}
                />
                <TextField
                    type="number"
                    label="Tần suất kiểm tra"
                    fullWidth
                    margin="dense"
                    value={formData.defaultFrequency ?? Number(null)}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            defaultFrequency: Number(e.target.value),
                        })
                    }
                    error={Boolean(errors.defaultFrequency)}
                    helperText={errors.defaultFrequency}
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
