import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import HourglassBottomOutlinedIcon from "@mui/icons-material/HourglassBottomOutlined";

import type { Device } from "../types/device";
import type { DeviceType } from "../../mstDeviceType/types/deviceType";
import { useEffect, useMemo, useState } from "react";

import { getListDeviceType } from "../../mstDeviceType/services/deviceTypeServices";

interface DeviceFormDialogProps {
    open: boolean;
    initialData: Partial<Device>;
    onSave: (data: Partial<Device>) => void | Promise<void>;
    onClose: () => void;
}

type Errors = {
    typeName?: string;
    deviceName?: string;
    seriNumber?: string;
    model?: string;
    location?: string;
    factory?: string;
    status?: string;
};

const DeviceFormDialog: React.FC<DeviceFormDialogProps> = ({
    open,
    initialData,
    onSave,
    onClose,
}) => {
    const [formData, setFormData] = useState<Partial<Device>>(initialData);
    const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
    const [errors, setErrors] = useState<Errors>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getListDeviceType();
                res && setDeviceTypes(res);
            } catch (error) {
                console.error("Failed to fetch device types", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!open) setErrors({});
        // clone để tránh tham chiếu tới object bên ngoài
        setFormData({ ...(initialData ?? {}) });
    }, [initialData, open]);

    const validate = async (): Promise<boolean> => {
        const e: Errors = {};

        if (!formData.typeId) {
            e.typeName = "Loại thiết bị là bắt buộc";
        }

        if (!formData.deviceName || formData.deviceName.trim() === "") {
            e.deviceName = "Tên thiết bị là bắt buộc";
        }

        // if (!formData.seriNumber || formData.seriNumber.trim() === "") {
        //     e.seriNumber = "Số serial là bắt buộc";
        // }

        // if (!formData.model || formData.model.trim() === "") {
        //     e.model = "Model thiết bị là bắt buộc";
        // }

        if (!formData.location || formData.location.trim() === "") {
            e.location = "Vị trí để thiết bị là bắt buộc";
        }

        if (!formData.factory || formData.factory.trim() === "") {
            e.factory = "Nhà máy là bắt buộc";
        }

        if (!formData.status || formData.status.trim() === "") {
            e.status = "Trạng thái là bắt buộc";
        }

        setErrors(e);

        return Object.keys(e).length === 0;
    };

    const handleSave = async () => {
        const ok = await validate();
        if (!ok) return;
        try {
            setSaving(true);
            await onSave(formData);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
            // onClose();
        }
    };

    const selectedType = useMemo(
        () => deviceTypes.find((t) => t.typeId === formData.typeId) || null,
        [deviceTypes, formData.typeId]
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
                {formData.deviceId ? "Cập Nhật Thiết Bị" : "Thêm Thiết Bị"}
            </DialogTitle>
            <DialogContent>
                <Autocomplete
                    sx={{ my: 2 }}
                    disablePortal
                    fullWidth
                    size="medium"
                    options={deviceTypes}
                    getOptionLabel={(option) => option.typeName}
                    value={selectedType}
                    onChange={(_, newValue) => {
                        setFormData({
                            ...formData,
                            typeId: newValue ? newValue.typeId : null,
                        });
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Loại Thiết Bị"
                            variant="outlined"
                            error={Boolean(errors.typeName)}
                            helperText={errors.typeName}
                        />
                    )}
                />
                <TextField
                    label="Tên thiết bị"
                    fullWidth
                    margin="dense"
                    value={formData.deviceName ?? ""}
                    onChange={(e) =>
                        setFormData({ ...formData, deviceName: e.target.value })
                    }
                    error={Boolean(errors.deviceName)}
                    helperText={errors.deviceName}
                />
                <TextField
                    label="Số Serial"
                    fullWidth
                    margin="dense"
                    value={formData.seriNumber ?? ""}
                    onChange={(e) =>
                        setFormData({ ...formData, seriNumber: e.target.value })
                    }
                    error={Boolean(errors.seriNumber)}
                    helperText={errors.seriNumber}
                />
                <TextField
                    label="Model"
                    fullWidth
                    margin="dense"
                    value={formData.model ?? ""}
                    onChange={(e) =>
                        setFormData({ ...formData, model: e.target.value })
                    }
                    error={Boolean(errors.model)}
                    helperText={errors.model}
                />
                <TextField
                    label="Vị trí"
                    fullWidth
                    margin="dense"
                    value={formData.location ?? ""}
                    onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                    }
                    error={Boolean(errors.location)}
                    helperText={errors.location}
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel id="factory">Nhà máy</InputLabel>
                    <Select
                        labelId="factory"
                        id="factory"
                        value={formData.factory ?? ""}
                        label="Nhà máy"
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                factory: e.target.value,
                            })
                        }
                        error={Boolean(errors.factory)}
                    >
                        <MenuItem value={"F1"}>Nhà máy 1</MenuItem>
                        <MenuItem value={"F2"}>Nhà máy 2</MenuItem>
                    </Select>
                    {errors.factory && (
                        <FormHelperText>{errors.factory}</FormHelperText>
                    )}
                </FormControl>
                <FormControl fullWidth margin="dense">
                    <InputLabel id="status">Trạng thái hoạt động</InputLabel>
                    <Select
                        labelId="status"
                        id="status"
                        value={formData.status ?? ""}
                        label="Trạng thái hoạt động"
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                status: e.target.value,
                            })
                        }
                        error={Boolean(errors.status)}
                    >
                        <MenuItem value={"Đang sử dụng"}>
                            Sử dụng{" "}
                            <span className="ml-4">
                                <CheckCircleOutlinedIcon color="success" />
                            </span>
                        </MenuItem>
                        <MenuItem value={"Bảo trì"}>
                            Bảo trì{" "}
                            <span className="ml-4">
                                <HourglassBottomOutlinedIcon color="warning" />
                            </span>
                        </MenuItem>
                        <MenuItem value={"Hỏng"}>
                            Hỏng{" "}
                            <span className="ml-4">
                                <CancelOutlinedIcon color="error" />
                            </span>
                        </MenuItem>
                    </Select>
                    {errors.status && (
                        <FormHelperText>{errors.status}</FormHelperText>
                    )}
                </FormControl>
                <TextField
                    type="number"
                    label="Tần suất kiểm tra"
                    fullWidth
                    margin="dense"
                    value={formData.frequencyOverride ?? ""}
                    onChange={(e) => {
                        const val = e.target.value;
                        setFormData({
                            ...formData,
                            frequencyOverride: val === "" ? null : Number(val),
                        });
                    }}
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
                <Button onClick={onClose} disabled={saving}>
                    Hủy
                </Button>
                <Button onClick={handleSave} variant="contained">
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeviceFormDialog;
