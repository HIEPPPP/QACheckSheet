import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
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
import { useEffect, useState } from "react";

import { getListDeviceType } from "../../mstDeviceType/services/deviceTypeServices";

interface DeviceFormDialogProps {
    open: boolean;
    formData: Device;
    setFormData: (data: Device) => void;
    onSave: () => void;
    onClose: () => void;
}

const DeviceFormDialog: React.FC<DeviceFormDialogProps> = ({
    open,
    formData,
    setFormData,
    onSave,
    onClose,
}) => {
    const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);

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
                    value={
                        deviceTypes.find(
                            (type) => type.typeId === formData.typeId
                        ) || null
                    }
                    onChange={(event, newValue) => {
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
                />
                <TextField
                    label="Số Serial"
                    fullWidth
                    margin="dense"
                    value={formData.seriNumber ?? ""}
                    onChange={(e) =>
                        setFormData({ ...formData, seriNumber: e.target.value })
                    }
                />
                <TextField
                    label="Model"
                    fullWidth
                    margin="dense"
                    value={formData.model ?? ""}
                    onChange={(e) =>
                        setFormData({ ...formData, model: e.target.value })
                    }
                />
                <TextField
                    label="Vị trí"
                    fullWidth
                    margin="dense"
                    value={formData.location ?? ""}
                    onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                    }
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
                    >
                        <MenuItem value={"F1"}>Nhà máy 1</MenuItem>
                        <MenuItem value={"F2"}>Nhà máy 2</MenuItem>
                    </Select>
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
                </FormControl>
                <TextField
                    type="number"
                    label="Tần suất kiểm tra"
                    fullWidth
                    margin="dense"
                    value={formData.frequencyOverride ?? ""}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            frequencyOverride: Number(e.target.value),
                        })
                    }
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
                <Button onClick={onSave} variant="contained">
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeviceFormDialog;
