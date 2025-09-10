import React, { useContext, useState } from "react";
import { useNgDetail } from "./hooks/useNgDetail";
import { Button, LinearProgress, type AlertColor } from "@mui/material";
import NgTable from "./components/NgTable";
import NgDialog from "./components/NgDialog";
import type {
    ConfirmNgPayload,
    NgDetail,
    UpdateValueResultPayload,
} from "./types/ngDetail";
import { vnTime } from "../../utils/formatDateTime";
import Notification from "../../shared/components/Notification";
import { UserContext } from "../../contexts/UserProvider";

const NgDetailPage: React.FC = () => {
    const {
        resultNgDetails,
        loading,
        error,
        refresh,
        create,
        updateValueOrStatusResult,
        confirmNGDetail,
    } = useNgDetail();

    const [open, setOpen] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: AlertColor;
    }>({
        open: false,
        message: "",
        severity: "success",
    });

    const { user } = useContext(UserContext);

    const [formData, setFormData] = useState<NgDetail>({
        resultId: null,
        ngId: null,
        sheetCode: "",
        sheetName: "",
        deviceCode: "",
        deviceName: "",
        pathTitles: "",
        value: "",
        status: "",
        dataType: "",
        checkedBy: "",
        checkedDate: null,
        ngContentDetail: "",
        fixContent: "",
        fixedDate: null,
        confirmedBy: "",
        confirmedDate: null,
        note: "",
    });

    const handleOpenForm = async (result: NgDetail) => {
        result && setFormData(result);
        setOpen(true);
    };

    const handleSave = async () => {
        const updateValuePayload: UpdateValueResultPayload = {
            resultId: formData?.resultId ?? 0,
            value: formData.value ?? "",
        };
        if (formData.ngId) {
            const updated = await updateValueOrStatusResult(
                formData.resultId!,
                updateValuePayload
            );
            if (updated) {
                setSnackbar({
                    open: true,
                    message: "Hoàn tất khắc phục",
                    severity: "success",
                });
            } else {
                setSnackbar({
                    open: true,
                    message: "Khắc phục thất bại",
                    severity: "error",
                });
            }
        } else {
            const createNgDetailPayload = {
                ...formData,
                fixedDate: new Date(vnTime).toISOString(),
                fixedBy: user?.userCode,
            };

            const created = await create(createNgDetailPayload);
            const updated = await updateValueOrStatusResult(
                formData.resultId!,
                updateValuePayload
            );
            if (created && updated) {
                setSnackbar({
                    open: true,
                    message: "Hoàn tất khắc phục",
                    severity: "success",
                });
            } else {
                setSnackbar({
                    open: true,
                    message: "Khắc phục thất bại",
                    severity: "error",
                });
            }
        }
        setOpen(false);
        await refresh();
    };

    const handleConfirm = async (payload: ConfirmNgPayload) => {
        const updateStatusPayload: UpdateValueResultPayload = {
            resultId: payload?.resultId ?? 0,
            status: "OK",
        };
        const updated = await updateValueOrStatusResult(
            payload.resultId!,
            updateStatusPayload
        );
        const confirmed = await confirmNGDetail(payload.ngId, payload);
        if (confirmed && updated) {
            setSnackbar({
                open: true,
                message: "Xác nhận hoàn tất",
                severity: "success",
            });
        } else {
            setSnackbar({
                open: true,
                message: "Xác nhận thất bại",
                severity: "error",
            });
        }
        await refresh();
    };

    const handleClose = async () => {
        setOpen(false);
    };

    return (
        <div>
            {loading && <LinearProgress />}
            <h1 className="text-3xl font-bold mb-4 text-red-500">
                Danh Sách Nội Dung Bất Thường
            </h1>

            <NgTable
                resultNgDetail={resultNgDetails}
                onEdit={(result: NgDetail) => handleOpenForm(result)}
                user={user}
                onConfirm={(payload: ConfirmNgPayload) =>
                    handleConfirm(payload)
                }
            />

            <NgDialog
                open={open}
                formData={formData}
                setFormData={setFormData}
                onSave={handleSave}
                onClose={handleClose}
            />

            <Notification
                {...snackbar}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
        </div>
    );
};

export default NgDetailPage;
