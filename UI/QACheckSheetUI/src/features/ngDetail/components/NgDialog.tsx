import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";

import { useEffect, useState } from "react";

import type { NgDetail } from "../types/ngDetail";
import { formatDateTime } from "../../../utils/formatDateTime";

interface NgDialogProps {
    open: boolean;
    formData: NgDetail;
    setFormData: (data: NgDetail) => void;
    onSave: () => void;
    onClose: () => void;
}

type Errors = {
    fixContent?: string;
    value?: string;
};

const NgDialog: React.FC<NgDialogProps> = ({
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

    // ensure default for BOOLEAN when dialog opens
    useEffect(() => {
        if (open && formData.dataType === "BOOLEAN" && !formData.status) {
            setFormData({ ...formData, status: "NG" });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, formData.dataType]); // intentionally not depending on formData.status to avoid extra runs

    const validate = async (): Promise<boolean> => {
        const e: Errors = {};

        if (!formData.fixContent || String(formData.fixContent).trim() === "") {
            e.fixContent = "Nội dung khắc phục là bắt buộc";
        }

        if (formData.dataType === "NUMBER") {
            const val = formData.value;
            if (val === null || val === undefined || val === "") {
                e.value = "Giá trị số là bắt buộc";
            } else {
                const num = Number(val);
                if (Number.isNaN(num)) {
                    e.value = "Giá trị phải là số hợp lệ";
                }
            }
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
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>Cập nhật nội dung khắc phục</DialogTitle>
            <DialogContent>
                <TextField
                    label="Tên thiết bị"
                    fullWidth
                    margin="dense"
                    value={formData.deviceName ?? ""}
                    onChange={(e) =>
                        setFormData({ ...formData, deviceName: e.target.value })
                    }
                    disabled
                />
                <TextField
                    label="Tên Check Sheet"
                    fullWidth
                    margin="dense"
                    value={formData.sheetName ?? ""}
                    onChange={(e) =>
                        setFormData({ ...formData, sheetName: e.target.value })
                    }
                    disabled
                />
                <TextField
                    label="Nội dung kiểm tra NG"
                    fullWidth
                    multiline
                    minRows={1}
                    maxRows={6}
                    margin="dense"
                    value={formData.pathTitles ?? ""}
                    onChange={(e) =>
                        setFormData({ ...formData, pathTitles: e.target.value })
                    }
                    disabled
                />
                <TextField
                    label="Thời gian bắt đầu NG"
                    fullWidth
                    margin="dense"
                    value={formatDateTime(formData.checkedDate ?? "")}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            checkedDate: e.target.value,
                        })
                    }
                    disabled
                />
                <TextField
                    label="Người kiểm tra"
                    fullWidth
                    margin="dense"
                    value={formData.checkedBy ?? ""}
                    onChange={(e) =>
                        setFormData({ ...formData, checkedBy: e.target.value })
                    }
                    disabled
                />
                <TextField
                    label="Chi tiết nội dung bất thường"
                    fullWidth
                    margin="dense"
                    value={formData.nGContentDetail ?? ""}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            nGContentDetail: e.target.value,
                        })
                    }
                />
                <TextField
                    label="Nội dung khắc phục"
                    fullWidth
                    margin="dense"
                    value={formData.fixContent ?? ""}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            fixContent: e.target.value,
                        })
                    }
                    error={Boolean(errors.fixContent)}
                    helperText={errors.fixContent}
                />

                {formData.dataType === "BOOLEAN" ? (
                    <div style={{ margin: "12px 0" }}>
                        <label>Giá trị kiểm tra: </label>
                        <ToggleButtonGroup
                            exclusive
                            value={formData.status ?? "NG"}
                            onChange={(_, newValue) => {
                                if (newValue === null) return;
                                setFormData({ ...formData, status: newValue });
                                setErrors((prev) => ({
                                    ...prev,
                                    value: undefined,
                                }));
                            }}
                            aria-label="status"
                        >
                            <ToggleButton
                                value="NG"
                                aria-label="NG"
                                color="error"
                            >
                                NG
                            </ToggleButton>
                            <ToggleButton
                                value="OK"
                                aria-label="OK"
                                color="success"
                            >
                                OK
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                ) : formData.dataType === "NUMBER" ? (
                    <TextField
                        label="Giá trị kiểm tra (số)"
                        fullWidth
                        margin="dense"
                        type="number"
                        value={formData.value ?? ""}
                        onChange={(e) => {
                            const raw = e.target.value;
                            const parsed = raw === "" ? "" : Number(raw);
                            setErrors((prev) => ({
                                ...prev,
                                value: undefined,
                            }));
                        }}
                        error={Boolean(errors.value)}
                        helperText={errors.value}
                    />
                ) : (
                    <TextField
                        label="Giá trị"
                        fullWidth
                        margin="dense"
                        value={formData.value ?? ""}
                        onChange={(e) =>
                            setFormData({ ...formData, value: e.target.value })
                        }
                    />
                )}
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

export default NgDialog;
