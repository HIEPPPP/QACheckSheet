// ItemPage.tsx
import React, { useState, useContext, useCallback } from "react";
import { Button, LinearProgress } from "@mui/material";
import { Add } from "@mui/icons-material";
import ConfirmDialog from "../../shared/components/ConfirmDialog";
import Notification from "../../shared/components/Notification";
import useItem from "./hooks/useItem";
import type { AlertColor } from "@mui/material";
import { UserContext } from "../../contexts/UserProvider";
import { vnTime } from "../../utils/formatDateTime";
import type { ItemDTO, CreateItemDTO } from "./types/item";
import ItemTable from "./components/ItemTable";
import ItemDialog from "./components/ItemDialog";
import ItemChildDialog from "./components/ItemChildDialog";

const emptyItem = (userRoles?: unknown): CreateItemDTO => ({
    itemId: null,
    sheetId: null,
    parentItemId: null,
    title: "",
    dataType: "",
    min: null,
    max: null,
    createAt: new Date(vnTime).toISOString(),
    createBy: String(userRoles ?? ""),
    updateAt: new Date(vnTime).toISOString(),
    updateBy: String(userRoles ?? ""),
    children: [],
    isRequired: true,
});

const ItemPage: React.FC = () => {
    const { sheets, create, update, remove, refresh, loading } = useItem();
    const { user } = useContext(UserContext);

    // dialog control
    const [open, setOpen] = useState(false);
    const [formType, setFormType] = useState<"parent" | "child">("parent");
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

    // initial data passed to dialog (isolated, not updated on each key stroke)
    const [dialogInitialData, setDialogInitialData] = useState<
        ItemDTO | CreateItemDTO | null
    >(null);

    // open parent form (new or edit) - note: we just set initial data, dialog owns editing state
    const handleOpenForm = useCallback(
        (item?: CreateItemDTO | null) => {
            if (item) {
                setDialogInitialData({
                    ...item,
                    createAt: new Date(vnTime).toISOString(),
                    updateAt: new Date(vnTime).toISOString(),
                });
                setFormType(item.parentItemId ? "child" : "parent");
            } else {
                setDialogInitialData(emptyItem(user?.roles));
                setFormType("parent");
            }
            setOpen(true);
        },
        [user?.roles]
    );

    // open child form
    const handleFormChild = useCallback(
        (parent: CreateItemDTO) => {
            setDialogInitialData({
                itemId: null,
                sheetId: parent.sheetId ?? null,
                parentItemId: parent.itemId ?? null,
                parentTitle: parent.title,
                title: "",
                dataType: "",
                min: null,
                max: null,
                createAt: new Date(vnTime).toISOString(),
                createBy: String(user?.userCode ?? ""),
                updateAt: new Date(vnTime).toISOString(),
                updateBy: String(user?.userCode ?? ""),
                isRequired: true,
                children: [],
            });
            setFormType("child");
            setOpen(true);
        },
        [user?.roles]
    );

    // ItemPage.tsx — phần handler lưu nhận data từ dialog
    const handleSaveFromDialog = useCallback(
        async (data: any) => {
            try {
                // chuẩn hóa các trường thời gian/người tạo/người sửa trước khi gửi
                const nowIso = new Date(vnTime).toISOString();
                const currentUser = String(user?.userCode ?? "");

                // copy để không mutate object từ dialog
                const payload = {
                    ...data,
                    updateAt: nowIso,
                    updateBy: data.updateBy ?? currentUser, // nếu dialog đã có updateBy thì giữ, không thì set
                    // nếu là create (itemId null), set createAt/createBy nếu backend cần
                    ...(data.itemId == null
                        ? {
                              createAt: nowIso,
                              createBy: data.createBy ?? currentUser,
                          }
                        : {}),
                };
                if (
                    payload &&
                    payload.itemId != null &&
                    payload.itemId !== ""
                ) {
                    // update
                    const id = Number(payload.itemId);
                    if (Number.isNaN(id))
                        throw new Error(
                            "Invalid itemId: " + String(payload.itemId)
                        );
                    const res = await update(id, payload);
                    // console.log("[ItemPage] update result:", res);
                    if (res) {
                        setSnackbar({
                            open: true,
                            message: "Cập nhật thành công",
                            severity: "success",
                        });
                        await refresh();
                    } else {
                        setSnackbar({
                            open: true,
                            message: "Cập nhật thất bại",
                            severity: "error",
                        });
                    }
                } else {
                    // create
                    const res = await create(payload);
                    // console.log("[ItemPage] create result:", res);
                    if (res) {
                        setSnackbar({
                            open: true,
                            message: "Thêm mới thành công",
                            severity: "success",
                        });
                        await refresh();
                    } else {
                        setSnackbar({
                            open: true,
                            message: "Thêm mới thất bại",
                            severity: "error",
                        });
                    }
                }
            } catch (err: any) {
                // console.error("[ItemPage] handleSaveFromDialog error:", err);
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
        async (itemId: number) => {
            try {
                const ok = await remove(itemId);
                if (ok) {
                    setSnackbar({
                        open: true,
                        message: "Xóa dữ liệu thành công",
                        severity: "success",
                    });
                } else {
                    setSnackbar({
                        open: true,
                        message: "Xóa dữ liệu thất bại",
                        severity: "error",
                    });
                }
            } catch (error) {
                console.error("Lỗi khi xóa dữ liệu:", error);
                setSnackbar({
                    open: true,
                    message: "Xóa dữ liệu thất bại",
                    severity: "error",
                });
            } finally {
                setConfirmDelete(null);
            }
        },
        [remove]
    );

    const handleCloseSnackbar = useCallback(
        () => setSnackbar((s) => ({ ...s, open: false })),
        []
    );

    // callbacks stable to avoid child re-renders
    const memoOnAddChild = useCallback(
        (p: CreateItemDTO) => handleFormChild(p),
        [handleFormChild]
    );
    const memoOnEdit = useCallback(
        (it?: CreateItemDTO | null) => handleOpenForm(it ?? null),
        [handleOpenForm]
    );
    const memoOnDelete = useCallback((id: number) => setConfirmDelete(id), []);
    const memoOnCancel = useCallback(() => setConfirmDelete(null), []);

    return (
        <div>
            {loading && <LinearProgress />}
            <h1 className="text-3xl font-bold mb-4">
                Danh Sách Nội Dung Kiểm Tra
            </h1>

            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenForm()}
            >
                Thêm Nội Dung Kiểm Tra
            </Button>

            <ItemTable
                sheets={sheets}
                onAddChild={memoOnAddChild}
                onEdit={memoOnEdit}
                onDelete={memoOnDelete}
                onCancel={memoOnCancel}
            />

            {formType === "child" && dialogInitialData && (
                <ItemChildDialog
                    open={open}
                    initialData={dialogInitialData as any}
                    onSave={handleSaveFromDialog}
                    onClose={() => setOpen(false)}
                />
            )}

            {formType === "parent" && dialogInitialData && (
                <ItemDialog
                    open={open}
                    initialData={dialogInitialData as any}
                    onSave={handleSaveFromDialog}
                    onClose={() => setOpen(false)}
                    sheets={sheets}
                />
            )}

            <ConfirmDialog
                open={Boolean(confirmDelete)}
                onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
                onCancel={() => setConfirmDelete(null)}
                title={"Xác nhận xóa nội dung kiểm tra"}
                content={`Bạn có chắc chắn muốn xóa nội dung kiểm tra này không?`}
            />

            <Notification {...snackbar} onClose={handleCloseSnackbar} />
        </div>
    );
};

export default ItemPage;
