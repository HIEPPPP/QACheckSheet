import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";

import type { Sheet } from "../types/sheet";

interface DeviceFormDialogProps {
    open: boolean;
    formData: Sheet;
    setFormData: (data: Sheet) => void;
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
            {formData.sheetId ? "Cập Nhật Loại Thiết Bị" : "Thêm Loại Thiết Bị"}
        </DialogTitle>
        <DialogContent>
            <TextField
                label="Mã loại thiết bị"
                fullWidth
                margin="dense"
                value={formData.sheetCode ?? ""}
                onChange={(e) =>
                    setFormData({ ...formData, sheetCode: e.target.value })
                }
                disabled
            />
            <TextField
                label="Tên loại thiết bị"
                fullWidth
                margin="dense"
                value={formData.sheetName ?? ""}
                onChange={(e) =>
                    setFormData({ ...formData, sheetName: e.target.value })
                }
            />
            <TextField
                label="Form NO"
                fullWidth
                margin="dense"
                value={formData.formNO ?? ""}
                onChange={(e) =>
                    setFormData({ ...formData, formNO: e.target.value })
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
