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
    ngContentDetail?: string;
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

    useEffect(() => {
        if (open && formData.dataType === "BOOLEAN" && !formData.status) {
            setFormData({ ...formData, status: "NG" });
        }
    }, [open, formData.dataType]);

    const validate = async (): Promise<boolean> => {
        const e: Errors = {};

        if (
            !formData.ngContentDetail ||
            String(formData.ngContentDetail).trim() === ""
        ) {
            e.ngContentDetail = "Nội dung bất thường là bắt buộc";
        }

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
                } else {
                    // check min / max when provided
                    const hasMin =
                        formData.min !== undefined && formData.min !== null;
                    const hasMax =
                        formData.max !== undefined && formData.max !== null;

                    const minNum = hasMin ? Number(formData.min) : undefined;
                    const maxNum = hasMax ? Number(formData.max) : undefined;

                    if (hasMin && Number.isNaN(minNum)) {
                        e.value = "Giá trị min không hợp lệ";
                    }

                    if (hasMax && Number.isNaN(maxNum)) {
                        e.value = "Giá trị max không hợp lệ";
                    }

                    if (!e.value) {
                        if (
                            minNum !== undefined &&
                            maxNum !== undefined &&
                            minNum > maxNum
                        ) {
                            e.value = `Sai ranh giới: min (${minNum}) > max (${maxNum})`;
                        } else if (
                            minNum !== undefined &&
                            num < (minNum as number)
                        ) {
                            e.value = `Giá trị phải lớn hơn hoặc bằng ${minNum}`;
                        } else if (
                            maxNum !== undefined &&
                            num > (maxNum as number)
                        ) {
                            e.value = `Giá trị phải nhỏ hơn hoặc bằng ${maxNum}`;
                        }
                    }
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
                    value={formData.ngContentDetail ?? ""}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            ngContentDetail: e.target.value,
                        })
                    }
                    multiline
                    minRows={1}
                    maxRows={20}
                    error={Boolean(errors.ngContentDetail)}
                    helperText={errors.ngContentDetail}
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
                    multiline
                    minRows={1}
                    maxRows={20}
                    error={Boolean(errors.fixContent)}
                    helperText={errors.fixContent}
                />

                {formData.dataType === "BOOLEAN" ? (
                    <div style={{ margin: "12px 0" }}>
                        <label>Giá trị kiểm tra: </label>
                        <ToggleButtonGroup
                            exclusive
                            // Nếu đang lưu "UPDATED", hiện thị "OK" để button tương ứng được chọn
                            value={
                                formData.value === "UPDATED"
                                    ? "OK"
                                    : formData.value ?? "NG"
                            }
                            onChange={(_, newValue) => {
                                if (newValue === null) return;
                                // Nếu user chọn "OK" thì lưu "UPDATED", ngược lại lưu chính xác giá trị được chọn (ví dụ "NG")
                                const storedValue =
                                    newValue === "OK" ? "UPDATED" : newValue;
                                setFormData({
                                    ...formData,
                                    value: storedValue,
                                });
                                setErrors((prev) => ({
                                    ...prev,
                                    value: undefined,
                                }));
                            }}
                            aria-label="value"
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
                        label={`Giá trị kiểm tra (số)${
                            formData.min !== undefined ||
                            formData.max !== undefined
                                ? ` — khoảng ${formData.min ?? "-"} đến ${
                                      formData.max ?? "-"
                                  }`
                                : ""
                        }`}
                        fullWidth
                        margin="dense"
                        type="number"
                        value={formData.value ?? ""}
                        onChange={(e) => {
                            const raw = e.target.value;
                            const parsed = raw === "" ? "" : raw;
                            setFormData({ ...formData, value: parsed });
                            setErrors((prev) => ({
                                ...prev,
                                value: undefined,
                            }));
                        }}
                        error={Boolean(errors.value)}
                        helperText={errors.value}
                        inputProps={{
                            min: formData.min ?? undefined,
                            max: formData.max ?? undefined,
                            step: "any",
                        }}
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
