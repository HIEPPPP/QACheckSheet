import React, { useState, useContext, useCallback, useEffect } from "react";
import { Button, LinearProgress } from "@mui/material";
import { Add, Print } from "@mui/icons-material";
import type { Device } from "./types/device";
import DeviceTable from "./components/DeviceTable";
import DeviceDialog from "./components/DeviceDialog";
import ConfirmDialog from "../../shared/components/ConfirmDialog";
import Notification from "../../shared/components/Notification";
import { useDevices } from "./hooks/useDevice";
import type { AlertColor } from "@mui/material";
import { UserContext } from "../../contexts/UserProvider";
import { vnTime } from "../../utils/formatDateTime";
import Barcode from "react-barcode";

const emptyDevice = (userCode?: string): Partial<Device> => ({
    deviceId: null,
    typeId: null,
    typeName: "",
    typeCode: "",
    deviceCode: "",
    deviceName: "",
    seriNumber: "",
    model: "",
    location: "",
    factory: "",
    status: "",
    frequencyOverride: null,
    description: "",
    createAt: new Date(vnTime).toISOString(),
    createBy: String(userCode ?? ""),
    updateAt: new Date(vnTime).toISOString(),
    updateBy: String(userCode ?? ""),
});

const DevicePage: React.FC = () => {
    const { devices, create, update, remove, refresh, loading } = useDevices();
    const { user } = useContext(UserContext);

    const [open, setOpen] = useState(false);
    const [dialogInitial, setDialogInitial] = useState<Partial<Device> | null>(
        null
    );

    // ... existing states
    const [selectedDeviceIds, setSelectedDeviceIds] = useState<number[]>([]);
    const [showPrintArea, setShowPrintArea] = useState(false);

    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: AlertColor;
    }>({
        open: false,
        message: "",
        severity: "success",
    });

    // clear selection when devices list changes (optional behavior)
    useEffect(() => {
        // keep selection only for existing devices
        const existingIds = new Set(devices.map((d) => Number(d.deviceId)));
        setSelectedDeviceIds((prev) =>
            prev.filter((id) => existingIds.has(id))
        );
    }, [devices]);

    // hàm gọi khi bấm in
    const handlePrintSelected = useCallback(() => {
        if (selectedDeviceIds.length === 0) return;
        setShowPrintArea(true);

        // ensure print area rendered before calling print
        setTimeout(() => {
            window.print();
        }, 100);

        const after = () => {
            setShowPrintArea(false);
            window.removeEventListener("afterprint", after);
        };
        window.addEventListener("afterprint", after);
    }, [selectedDeviceIds]);

    const handleOpenForm = useCallback(
        (device?: Device | null) => {
            const userCode = String(user?.userCode ?? "");
            if (device) {
                setDialogInitial({
                    ...device,
                    updateAt: new Date(vnTime).toISOString(),
                    updateBy: userCode,
                });
            } else {
                setDialogInitial(emptyDevice(userCode) as Partial<Device>);
            }
            setOpen(true);
        },
        [user]
    );

    const handleSaveFromDialog = useCallback(
        async (data: Partial<Device>) => {
            console.log("[DevicePage] saving device payload:", data);
            const nowIso = new Date(vnTime).toISOString();
            const currentUser = String(user?.userCode ?? "");
            const payload: any = {
                ...data,
                updateAt: nowIso,
                updateBy: data.updateBy ?? currentUser,
            };
            if (!payload.createAt) payload.createAt = data.createAt ?? nowIso;
            if (!payload.createBy)
                payload.createBy = data.createBy ?? currentUser;

            try {
                if (payload.deviceId) {
                    const id = Number(payload.deviceId);
                    if (Number.isNaN(id))
                        throw new Error(
                            "Invalid deviceId: " + String(payload.deviceId)
                        );
                    const res = await update(id, payload);
                    if (res)
                        setSnackbar({
                            open: true,
                            message: "Cập nhật thành công",
                            severity: "success",
                        });
                    else
                        setSnackbar({
                            open: true,
                            message: "Cập nhật thất bại",
                            severity: "error",
                        });
                } else {
                    const res = await create(payload);
                    if (res)
                        setSnackbar({
                            open: true,
                            message: "Thêm mới thành công",
                            severity: "success",
                        });
                    else
                        setSnackbar({
                            open: true,
                            message: "Thêm mới thất bại",
                            severity: "error",
                        });
                }
                await refresh();
            } catch (err: any) {
                console.error("[DevicePage] save error:", err);
                const message =
                    err?.message ??
                    err?.response?.data?.title ??
                    "Lỗi khi lưu dữ liệu";
                setSnackbar({ open: true, message, severity: "error" });
            } finally {
                setOpen(false);
            }
        },
        [create, update, refresh, user]
    );

    const handleDelete = useCallback(
        async (deviceId: number) => {
            try {
                const ok = await remove(deviceId);
                if (ok)
                    setSnackbar({
                        open: true,
                        message: "Xóa thành công",
                        severity: "success",
                    });
                else
                    setSnackbar({
                        open: true,
                        message: "Xóa thất bại",
                        severity: "error",
                    });
                await refresh();
            } catch (err) {
                console.error(err);
                setSnackbar({
                    open: true,
                    message: "Lỗi khi xóa",
                    severity: "error",
                });
            } finally {
                setConfirmDelete(null);
            }
        },
        [remove, refresh]
    );

    const handleButtonAddClick = useCallback(() => {
        setDialogInitial(
            emptyDevice(String(user?.userCode)) as Partial<Device>
        );
        setOpen(true);
    }, [user]);

    return (
        <div>
            {loading && <LinearProgress />}
            <h1 className="text-3xl font-bold mb-4">Danh Sách Thiết Bị</h1>
            <div className="flex gap-2 mb-4">
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleButtonAddClick}
                >
                    Thêm Thiết Bị
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<Print />}
                    onClick={handlePrintSelected}
                    disabled={selectedDeviceIds.length === 0}
                >
                    In barcode ({selectedDeviceIds.length})
                </Button>
            </div>

            <DeviceTable
                devices={devices}
                onEdit={(d: Device) => handleOpenForm(d)}
                onDelete={(id: number) => setConfirmDelete(id)}
                selectedIds={selectedDeviceIds}
                onSelectionChange={(ids) => setSelectedDeviceIds(ids)}
            />

            {/* phần in: chỉ hiển thị khi showPrintArea = true hoặc khi in (CSS @media print sẽ chỉ show vùng này) */}
            {showPrintArea && (
                <>
                    <style>
                        {`
                        @media print {
                            body * { visibility: hidden; }
                            .print-area, .print-area * { visibility: visible; }
                            .print-area { position: absolute; left: 0; top: 0; width: 100%; }
                            /* chia từng barcode 1 hàng, can chỉnh */
                            .barcode-card { page-break-inside: avoid; margin: 8px 0; padding: 8px; border-bottom: 1px solid #ccc;}
                        }
                        `}
                    </style>

                    <div className="print-area" style={{ padding: 16 }}>
                        {selectedDeviceIds.map((id) => {
                            const device = devices.find(
                                (d) => Number(d.deviceId) === id
                            );
                            if (!device) return null;
                            const value =
                                String(
                                    `${device.deviceCode} - ${device.sheetCode}`
                                ) ?? "";
                            // const label =
                            //     String(
                            //         `${device.deviceName} / ${device.sheetName}`
                            //     ) ?? "";
                            return (
                                <div
                                    key={id}
                                    className="barcode-card"
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: 16,
                                    }}
                                >
                                    <div style={{ minWidth: 260 }}>
                                        <Barcode
                                            value={value}
                                            format="CODE128"
                                            displayValue={true}
                                            width={2}
                                            height={60}
                                        />
                                    </div>
                                    <div className="max-w-[300px] min-w-[300px]">
                                        <div style={{ fontWeight: 700 }}>
                                            {value}
                                        </div>
                                        <div className="text-sm min-w-[200px]">
                                            <span className="text-amber-400">
                                                {device.deviceName}
                                            </span>{" "}
                                            / <span>{device.sheetName}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {dialogInitial && (
                <DeviceDialog
                    key={JSON.stringify(dialogInitial)}
                    open={open}
                    initialData={dialogInitial}
                    onSave={handleSaveFromDialog}
                    onClose={() => setOpen(false)}
                />
            )}

            <ConfirmDialog
                open={Boolean(confirmDelete)}
                onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
                onCancel={() => setConfirmDelete(null)}
                title={"Xác nhận xóa thiết bị"}
                content={`Bạn có chắc chắn muốn xóa thiết bị này không?`}
            />

            <Notification
                {...snackbar}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
        </div>
    );
};

export default DevicePage;
