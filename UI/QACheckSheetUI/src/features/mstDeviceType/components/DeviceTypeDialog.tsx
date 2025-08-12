import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Switch,
    TextField,
} from "@mui/material";

import type { DeviceType } from "../types/deviceType";

interface DeviceFormDialogProps {
    open: boolean;
    formData: DeviceType;
    setFormData: (data: DeviceType) => void;
    onSave: () => void;
    onClose: () => void;
}

const DeviceFormDialog: React.FC<DeviceFormDialogProps> = ({
    open,
    formData,
    setFormData,
    onSave,
    onClose,
}) => (
    <Dialog
        open={open}
        onClose={onClose}
        disableEnforceFocus
        disableAutoFocus
        disableRestoreFocus
    >
        <DialogTitle>
            {formData.typeId ? "Cập Nhật Loại Thiết Bị" : "Thêm Loại Thiết Bị"}
        </DialogTitle>
        <DialogContent>
            <TextField
                label="Mã loại thiết bị"
                fullWidth
                margin="dense"
                value={formData.typeCode ?? ""}
                onChange={(e) =>
                    setFormData({ ...formData, typeCode: e.target.value })
                }
                disabled
            />
            <TextField
                label="Tên loại thiết bị"
                fullWidth
                margin="dense"
                value={formData.typeName ?? ""}
                onChange={(e) =>
                    setFormData({ ...formData, typeName: e.target.value })
                }
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
            />
            <TextField
                label="Mô tả"
                fullWidth
                margin="dense"
                value={formData.description ?? ""}
                onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                }
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

export default DeviceFormDialog;
