// DeviceTable.tsx
import { Delete, Edit } from "@mui/icons-material";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Box,
    Pagination,
    TextField,
    MenuItem,
    Checkbox,
} from "@mui/material";
import React from "react";

import type { Device } from "../types/device";
import { formatDateTime } from "../../../utils/formatDateTime";

interface DeviceTableProps {
    devices?: Device[];
    onEdit: (device: Device) => void;
    onDelete: (id: number) => void;
    // selection props
    selectedIds?: number[]; // list deviceId đã chọn
    onSelectionChange?: (ids: number[]) => void;
}

const DeviceTable: React.FC<DeviceTableProps> = ({
    devices = [],
    onEdit,
    onDelete,
    selectedIds = [],
    onSelectionChange,
}) => {
    const [page, setPage] = React.useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
    const [searchText, setSearchText] = React.useState<string>("");

    // Lọc theo deviceCode hoặc deviceName etc.
    const filteredDevice = devices.filter((type) =>
        `${type.deviceCode} ${type.deviceName} ${type.typeCode} ${type.typeName} ${type.model} ${type.status} ${type.area} ${type.location} ${type.description} ${type.factory}`
            .toLowerCase()
            .includes(searchText.toLowerCase())
    );

    const paginatedDevice = filteredDevice.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleChangePage = (
        _: React.ChangeEvent<unknown>,
        newPage: number
    ) => {
        setPage(newPage - 1);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // selection handlers
    const selectedSet = new Set(selectedIds.filter((id) => id != null));

    const allFilteredIds = filteredDevice
        .map((d) => Number(d.deviceId))
        .filter((id) => !Number.isNaN(id));

    const areAllSelected =
        allFilteredIds.length > 0 &&
        allFilteredIds.every((id) => selectedSet.has(id));
    const isIndeterminate =
        !areAllSelected && allFilteredIds.some((id) => selectedSet.has(id));

    const toggleOne = (deviceId?: number) => {
        if (deviceId == null) return;
        const newSet = new Set(selectedSet);
        if (newSet.has(deviceId)) newSet.delete(deviceId);
        else newSet.add(deviceId);
        onSelectionChange?.([...newSet]);
    };

    const toggleSelectAllFiltered = () => {
        if (areAllSelected) {
            // unselect all filtered
            const newSelected = selectedIds.filter(
                (id) => !allFilteredIds.includes(id)
            );
            onSelectionChange?.(newSelected);
        } else {
            // add all filtered ids (merge unique)
            const merged = Array.from(
                new Set([...selectedIds, ...allFilteredIds])
            );
            onSelectionChange?.(merged);
        }
    };

    return (
        <Box>
            <Box className="flex justify-between flex-wrap gap-2 my-4">
                <TextField
                    label="Tìm kiếm"
                    variant="outlined"
                    size="small"
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                        setPage(0);
                    }}
                />
                <TextField
                    label="Số dòng/trang"
                    select
                    size="small"
                    value={rowsPerPage}
                    onChange={handleChangeRowsPerPage}
                    sx={{ width: 120 }}
                >
                    {[5, 10, 20, 50].map((option) => (
                        <MenuItem key={option} value={option}>
                            {option} dòng
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow className="bg-gray-200">
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={areAllSelected}
                                    indeterminate={isIndeterminate}
                                    onChange={toggleSelectAllFiltered}
                                    inputProps={{ "aria-label": "Chọn tất cả" }}
                                />
                            </TableCell>

                            <TableCell sx={{ fontWeight: 700 }}>STT</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Mã Loại thiết bị
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Tên loại thiết bị
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Mã Sheet
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Tên Sheet
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Mã thiết bị
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Tên thiết bị
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Số Serial
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Model
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Khu vực
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Vị trí
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Nhà máy
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Trạng thái hoạt động
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Tần suất
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Mô tả
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Ngày tạo
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Người tạo
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Ngày cập nhật
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Người cập nhật
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Hành động
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginatedDevice.map(
                            (device: Device, index: number) => {
                                const id = Number(device.deviceId);
                                const checked = selectedSet.has(id);
                                return (
                                    <TableRow
                                        key={device.deviceId}
                                        className="hover:bg-gray-100"
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={checked}
                                                onChange={() => toggleOne(id)}
                                                inputProps={{
                                                    "aria-label": `Chọn thiết bị ${device.deviceCode}`,
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            {page * rowsPerPage + index + 1}
                                        </TableCell>
                                        <TableCell>{device.typeCode}</TableCell>
                                        <TableCell>{device.typeName}</TableCell>
                                        <TableCell>
                                            {device.sheetCode}
                                        </TableCell>
                                        <TableCell>
                                            {device.sheetName}
                                        </TableCell>
                                        <TableCell>
                                            {device.deviceCode}
                                        </TableCell>
                                        <TableCell>
                                            {device.deviceName}
                                        </TableCell>
                                        <TableCell>
                                            {device.seriNumber}
                                        </TableCell>
                                        <TableCell>{device.model}</TableCell>
                                        <TableCell>{device.area}</TableCell>
                                        <TableCell>{device.location}</TableCell>
                                        <TableCell>{device.factory}</TableCell>

                                        {device.status === "Đang sử dụng" && (
                                            <TableCell className="min-w-[120px]">
                                                <span className="p-2 bg-[#d3f3df] rounded-sm text-green-600">
                                                    Sử dụng
                                                </span>
                                            </TableCell>
                                        )}
                                        {device.status === "Bảo trì" && (
                                            <TableCell>
                                                <span className="p-2 bg-[#fcdfdf] rounded-sm text-black">
                                                    Bảo trì
                                                </span>
                                            </TableCell>
                                        )}
                                        {device.status === "Hỏng" && (
                                            <TableCell className="text-red-500">
                                                <span className="p-2 bg-[#fcdfdf] rounded-sm text-orange-500">
                                                    Hỏng
                                                </span>
                                            </TableCell>
                                        )}

                                        <TableCell>
                                            {device.frequencyOverride}
                                        </TableCell>
                                        <TableCell>
                                            {device.description}
                                        </TableCell>
                                        <TableCell>
                                            {formatDateTime(device.createAt)}
                                        </TableCell>
                                        <TableCell>{device.createBy}</TableCell>
                                        <TableCell>
                                            {formatDateTime(device.updateAt)}
                                        </TableCell>
                                        <TableCell>{device.updateBy}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                color="primary"
                                                onClick={() => onEdit(device)}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() =>
                                                    onDelete(
                                                        Number(device.deviceId)
                                                    )
                                                }
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            }
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box mt={2} display="flex" justifyContent="center">
                <Pagination
                    count={Math.max(
                        1,
                        Math.ceil(filteredDevice.length / rowsPerPage)
                    )}
                    page={page + 1}
                    onChange={handleChangePage}
                    color="primary"
                />
            </Box>
        </Box>
    );
};

export default React.memo(DeviceTable);
