// SheetPage.tsx (optimized with useCallback, useMemo, useTransition)
import React, {
    useState,
    useCallback,
    useMemo,
    useTransition,
    useContext,
} from "react";
import { Button, LinearProgress } from "@mui/material";
import { Add } from "@mui/icons-material";
import TypeSheetTable from "./components/TypeSheetTable";
import TypeSheetDialog from "./components/TypeSheetDialog";
import ConfirmDialog from "../../shared/components/ConfirmDialog";
import Notification from "../../shared/components/Notification";
import useTypeSheet from "./hooks/useTypeSheet";
import type { AlertColor } from "@mui/material";
import { vnTime } from "../../utils/formatDateTime";
import type { TypeSheetDTO } from "./types/typeSheet";
import { UserContext } from "../../contexts/UserProvider";

const DEFAULT_FORM_DATA: TypeSheetDTO = {
    id: null,
    deviceTypeId: null,
    sheetId: null,
    deviceTypeCode: "",
    deviceTypeName: "",
    sheetCode: "",
    sheetName: "",
    createAt: null,
    createBy: "",
    updateAt: null,
    updateBy: "",
};

const SheetPage: React.FC = () => {
    const {
        sheets,
        types,
        typeSheets,
        create,
        update,
        remove,
        refresh,
        loading,
    } = useTypeSheet();

    const { user } = useContext(UserContext);

    const [open, setOpen] = useState(false);
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

    const [formData, setFormData] = useState<TypeSheetDTO>(DEFAULT_FORM_DATA);

    // useTransition helps keep UI responsive when we do several state updates
    const [isPending, startTransition] = useTransition();

    // memoize lists so referential identity is stable when passed to children
    const memoedSheets = useMemo(() => sheets, [sheets]);
    const memoedTypes = useMemo(() => types, [types]);
    const memoedTypeSheets = useMemo(() => typeSheets, [typeSheets]);

    // stable handler to open dialog for adding
    const handleButtonAddClick = useCallback(() => {
        startTransition(() => {
            setFormData({
                ...DEFAULT_FORM_DATA,
                createAt: new Date(vnTime).toISOString(),
                createBy: String(user?.userCode),
                updateAt: new Date(vnTime).toISOString(),
                updateBy: String(user?.userCode),
            });
            setOpen(true);
        });
    }, []);

    // stable handler to open dialog for editing
    const handleOpenForm = useCallback((typeSheet?: TypeSheetDTO | null) => {
        startTransition(() => {
            if (typeSheet) setFormData(typeSheet);
            else
                setFormData({
                    ...DEFAULT_FORM_DATA,
                    createAt: new Date(vnTime).toISOString(),
                    createBy: String(user?.userCode),
                    updateAt: new Date(vnTime).toISOString(),
                    updateBy: String(user?.userCode),
                });
            setOpen(true);
        });
    }, []);

    const handleClose = useCallback(() => setOpen(false), []);

    const handleSave = useCallback(async () => {
        try {
            if (formData.id) {
                const res = await update(formData.id, formData);
                res &&
                    setSnackbar({
                        open: true,
                        message: res
                            ? "Cập nhật thành công"
                            : "Cập nhật thất bại",
                        severity: res ? "success" : "error",
                    });
            } else {
                const res = await create(formData);
                res &&
                    setSnackbar({
                        open: true,
                        message: res
                            ? "Thêm mới thành công"
                            : "Thêm mới thất bại",
                        severity: res ? "success" : "error",
                    });
            }
        } catch (err) {
            setSnackbar({
                open: true,
                message: "Có lỗi xảy ra",
                severity: "error",
            });
        } finally {
            setOpen(false);
            await refresh();
        }
    }, [create, update, formData, refresh]);

    const handleDelete = useCallback(
        async (typeSheetId: number) => {
            try {
                const ok = await remove(typeSheetId);
                setSnackbar({
                    open: true,
                    message: ok ? "Xóa thành công" : "Xóa thất bại",
                    severity: ok ? "success" : "error",
                });
            } catch (err) {
                setSnackbar({
                    open: true,
                    message: "Có lỗi xảy ra",
                    severity: "error",
                });
            } finally {
                setConfirmDelete(null);
                await refresh();
            }
        },
        [remove, refresh]
    );

    // close snackbar stable
    const handleCloseSnackbar = useCallback(
        () => setSnackbar((s) => ({ ...s, open: false })),
        []
    );

    return (
        <div>
            {loading && <LinearProgress />}
            <h1 className="text-3xl font-bold mb-4">
                Danh Sách Thiết Bị - Check Sheet
            </h1>

            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleButtonAddClick}
                disabled={isPending}
            >
                Thêm Check Sheet
            </Button>

            <TypeSheetTable
                typeSheets={memoedTypeSheets}
                onEdit={handleOpenForm}
                onDelete={(id) => setConfirmDelete(id)}
            />

            <TypeSheetDialog
                sheets={memoedSheets}
                types={memoedTypes}
                open={open}
                formData={formData}
                setFormData={setFormData}
                onSave={handleSave}
                onClose={handleClose}
            />

            <ConfirmDialog
                open={Boolean(confirmDelete)}
                onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
                onCancel={() => setConfirmDelete(null)}
                title={"Xác nhận xóa mối quan hệ"}
                content={`Bạn có chắc chắn muốn xóa mối quan hệ này không?`}
            />

            <Notification {...snackbar} onClose={handleCloseSnackbar} />
        </div>
    );
};

export default SheetPage;
