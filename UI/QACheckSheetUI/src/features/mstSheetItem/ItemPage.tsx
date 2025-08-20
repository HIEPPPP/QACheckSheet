import React, { useState, useContext } from "react";
import { Box, Button, CircularProgress, LinearProgress } from "@mui/material";
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

const ItemPage: React.FC = () => {
    const { sheets, create, update, remove, refresh, loading } = useItem();
    const { user } = useContext(UserContext);

    const [open, setOpen] = useState(false);
    const [formType, setFormType] = useState<String>("parent");
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

    const [formData, setFormData] = useState<CreateItemDTO>({
        itemId: null,
        sheetId: null,
        parentItemId: null,
        title: "",
        dataType: "",
        min: null,
        max: null,
        createAt: null,
        createBy: "",
        updateAt: null,
        updateBy: "",
        children: [],
        isRequired: true,
    });

    const handleOpenForm = (item?: CreateItemDTO | null) => {
        if (item) {
            setFormData({
                itemId: item.itemId,
                sheetId: item.sheetId,
                parentItemId: item.parentItemId ?? null,
                title: item.title,
                dataType: item.dataType ?? "",
                min: item.min ?? null,
                max: item.max ?? null,
                createAt: new Date(vnTime).toISOString(),
                createBy: "55555",
                updateAt: new Date(vnTime).toISOString(),
                updateBy: "24182",
                isRequired: true,
                children: [],
            });
            // xác định form type dựa trên parentItemId
            setFormType(item.parentItemId ? "child" : "parent");
        } else {
            setFormData({
                itemId: null,
                sheetId: null,
                parentItemId: null,
                title: "",
                dataType: "",
                min: null,
                max: null,
                createAt: new Date(vnTime).toISOString(),
                createBy: String(user?.roles),
                updateAt: new Date(vnTime).toISOString(),
                updateBy: String(user?.roles),
                isRequired: true,
                children: [],
            });
            setFormType("parent");
        }
        setOpen(true);
    };

    const handleSave = async () => {
        if (formData.itemId) {
            const res = await update(formData.itemId, formData);
            if (res) {
                setSnackbar({
                    open: true,
                    message: "Cập nhật thành công",
                    severity: "success",
                });
                refresh();
            } else {
                setSnackbar({
                    open: true,
                    message: "Cập nhật thất bại",
                    severity: "error",
                });
            }
        } else {
            const res = await create(formData);
            if (res) {
                setSnackbar({
                    open: true,
                    message: "Thêm mới thành công",
                    severity: "success",
                });
            } else {
                setSnackbar({
                    open: true,
                    message: "Thêm mới thất bại",
                    severity: "error",
                });
            }
        }
        setOpen(false);
    };

    const handleDelete = async (itemId: number) => {
        try {
            const response = await remove(itemId);
            if (response) {
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
            setConfirmDelete(null);
        } catch (error) {
            console.error("Lỗi khi xóa dữ liệu:", error);
            setSnackbar({
                open: true,
                message: "Xóa dữ liệu thất bại",
                severity: "error",
            });
        }
    };

    const handleFormChild = (parent: CreateItemDTO) => {
        setFormData({
            itemId: null,
            sheetId: parent.sheetId ?? null,
            parentItemId: parent.itemId ?? null,
            parentTitle: parent.title,
            title: "",
            dataType: "",
            min: null,
            max: null,
            createAt: new Date(vnTime).toISOString(),
            createBy: "24182",
            updateAt: new Date(vnTime).toISOString(),
            updateBy: "24182",
            isRequired: true,
            children: [],
        });
        setFormType("child");
        setOpen(true);
    };

    const handleButtonAddClick = () => {
        setFormData({
            itemId: null,
            sheetId: null,
            parentItemId: null,
            title: "",
            dataType: "",
            min: null,
            max: null,
            createAt: new Date(vnTime).toISOString(),
            createBy: "24182",
            updateAt: new Date(vnTime).toISOString(),
            updateBy: "24182",
            isRequired: true,
            children: [],
        });
        setFormType("parent");
        setOpen(true);
    };

    return (
        <div>
            {loading && (
                // <Box sx={{ display: "flex" }}>
                //     <CircularProgress />
                // </Box>
                <LinearProgress />
            )}
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
                onAddChild={handleFormChild}
                onEdit={handleOpenForm}
                onDelete={setConfirmDelete}
                onCancel={() => {
                    setConfirmDelete(null);
                }}
            />

            {formType === "child" && (
                <ItemChildDialog
                    open={open}
                    formData={formData}
                    onSave={handleSave}
                    setFormData={setFormData}
                    onClose={() => setOpen(false)}
                />
            )}

            {formType === "parent" && (
                <ItemDialog
                    open={open}
                    formData={formData}
                    setFormData={setFormData}
                    onSave={handleSave}
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

            <Notification
                {...snackbar}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
        </div>
    );
};

export default ItemPage;
