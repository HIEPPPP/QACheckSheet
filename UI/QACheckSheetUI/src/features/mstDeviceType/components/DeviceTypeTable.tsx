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
import { useState } from "react";

import type { DeviceType } from "../types/deviceType";

import { formatDateTime } from "../../../utils/formatDateTiem";

// Định nghĩa props cho component
interface DeviceTypeTableProps {
    deviceTypes?: DeviceType[];
    onEdit: (device: DeviceType) => void;
    onDelete: (id: number) => void;
}

const DeviceTypeTable: React.FC<DeviceTypeTableProps> = ({
    deviceTypes = [],
    onEdit,
    onDelete,
}) => {
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [searchText, setSearchText] = useState<string>("");

    // Lọc theo deviceCode hoặc deviceName
    const filteredDeviceTypes = deviceTypes.filter((type) =>
        `${type.typeCode} ${type.typeName}`
            .toLowerCase()
            .includes(searchText.toLowerCase())
    );

    // Dữ liệu sau phân trang
    const paginatedDeviceTypes = filteredDeviceTypes.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleChangePage = (
        event: React.ChangeEvent<unknown>,
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
                                Mã loại
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Tên loại
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
                        {paginatedDeviceTypes.map(
                            (type: DeviceType, index: number) => (
                                <TableRow
                                    key={type.typeId}
                                    className="hover:bg-gray-100"
                                >
                                    <TableCell>
                                        {page * rowsPerPage + index + 1}
                                    </TableCell>
                                    <TableCell>{type.typeCode}</TableCell>
                                    <TableCell>{type.typeName}</TableCell>
                                    <TableCell>
                                        {type.defaultFrequency}
                                    </TableCell>
                                    <TableCell>{type.description}</TableCell>
                                    <TableCell>
                                        {formatDateTime(type.createAt)}
                                    </TableCell>
                                    <TableCell>{type.createBy}</TableCell>
                                    <TableCell>
                                        {formatDateTime(type.updateAt)}
                                    </TableCell>
                                    <TableCell>{type.updateBy}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="primary"
                                            onClick={() => onEdit(type)}
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() =>
                                                onDelete(Number(type.typeId))
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
                    count={Math.ceil(filteredDeviceTypes.length / rowsPerPage)}
                    page={page + 1}
                    onChange={handleChangePage}
                    color="primary"
                />
            </Box>
        </Box>
    );
};

export default DeviceTypeTable;
