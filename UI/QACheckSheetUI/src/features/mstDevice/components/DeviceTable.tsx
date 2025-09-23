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
} from "@mui/material";
import React, { useState } from "react";

import type { Device } from "../types/device";

import { formatDateTime } from "../../../utils/formatDateTime";

// Định nghĩa props cho component
interface DeviceTableProps {
    devices?: Device[];
    onEdit: (device: Device) => void;
    onDelete: (id: number) => void;
}

const DeviceTable: React.FC<DeviceTableProps> = ({
    devices = [],
    onEdit,
    onDelete,
}) => {
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [searchText, setSearchText] = useState<string>("");

    // Lọc theo deviceCode hoặc deviceName
    const filteredDevice = devices.filter((type) =>
        `${type.deviceCode} ${type.deviceName} ${type.typeCode} ${type.typeName} ${type.model} ${type.status} ${type.area} ${type.location} ${type.description} ${type.factory}`
            .toLowerCase()
            .includes(searchText.toLowerCase())
    );

    // Dữ liệu sau phân trang
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

    return (
        <Box>
            {/* Thanh tìm kiếm và chọn số dòng */}
            <Box className="flex justify-between flex-wrap gap-2 my-4">
                <TextField
                    label="Tìm kiếm"
                    variant="outlined"
                    size="small"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
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

            {/* Bảng thiết bị */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow className="bg-gray-200">
                            <TableCell sx={{ fontWeight: 700 }}>STT</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Mã Loại thiết bị
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Tên loại thiết bị
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
                            (device: Device, index: number) => (
                                <TableRow
                                    key={device.deviceId}
                                    className="hover:bg-gray-100"
                                >
                                    <TableCell>
                                        {page * rowsPerPage + index + 1}
                                    </TableCell>
                                    {/* <TableCell>{device.typeId}</TableCell> */}
                                    <TableCell>{device.typeCode}</TableCell>
                                    <TableCell>{device.typeName}</TableCell>
                                    <TableCell>{device.deviceCode}</TableCell>
                                    <TableCell>{device.deviceName}</TableCell>
                                    <TableCell>{device.seriNumber}</TableCell>
                                    <TableCell>{device.model}</TableCell>
                                    <TableCell>{device.area}</TableCell>
                                    <TableCell>{device.location}</TableCell>
                                    <TableCell>{device.factory}</TableCell>
                                    {device.status === "Đang sử dụng" && (
                                        <TableCell>
                                            <span className="p-2 bg-[#d3f3df] rounded-sm text-green-600">
                                                Sử dụng
                                            </span>
                                        </TableCell>
                                    )}
                                    {device.status === "Bảo trì" && (
                                        <TableCell className="">
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
                                    <TableCell>{device.description}</TableCell>
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
                            )
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Phân trang */}
            <Box mt={2} display="flex" justifyContent="center">
                <Pagination
                    count={Math.ceil(filteredDevice.length / rowsPerPage)}
                    page={page + 1}
                    onChange={handleChangePage}
                    color="primary"
                />
            </Box>
        </Box>
    );
};

export default React.memo(DeviceTable);
