import React from "react";
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
    colors,
} from "@mui/material";
import { useState } from "react";
import type { NgDetail } from "../types/ngDetail";
import { Delete, Edit } from "@mui/icons-material";
import { formatDateTime } from "../../../utils/formatDateTime";
import { red } from "@mui/material/colors";

interface NgTableProps {
    resultNgDetail?: NgDetail[];
    onEdit: (result: NgDetail) => void;
}

const NgTable: React.FC<NgTableProps> = ({ resultNgDetail = [], onEdit }) => {
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [searchText, setSearchText] = useState<string>("");

    const filteredResults = resultNgDetail.filter((r) =>
        `${r.sheetCode} ${r.sheetName} ${r.deviceCode} ${r.deviceName}`
            .toLowerCase()
            .includes(searchText.toLowerCase())
    );

    // Dữ liệu sau phân trang
    const paginatedResults = filteredResults.slice(
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
        <div>
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
                                Bắt đầu NG (Time)
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
                                Nội dung kiểm tra
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Nội dung bất thường
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Nội dung khắc phục
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Giá trị kiểm tra
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Trạng thái
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Hành động
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedResults.map((r: NgDetail, index: number) => (
                            <TableRow
                                key={r.resultId}
                                className="hover:bg-gray-100"
                            >
                                <TableCell>
                                    {page * rowsPerPage + index + 1}
                                </TableCell>
                                <TableCell>
                                    {formatDateTime(r.checkedDate ?? null)}
                                </TableCell>
                                <TableCell>{r.sheetCode}</TableCell>
                                <TableCell>{r.sheetName}</TableCell>
                                <TableCell>{r.deviceCode}</TableCell>
                                <TableCell>{r.deviceName}</TableCell>
                                <TableCell>{r.pathTitles}</TableCell>
                                <TableCell>{r.nGContentDetail}</TableCell>
                                <TableCell>{r.fixContent}</TableCell>
                                <TableCell>{r.value}</TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: 600,
                                        color: "#FF0000",
                                    }}
                                    className="animate-pulse"
                                >
                                    {r.status}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        color="warning"
                                        onClick={() => onEdit(r)}
                                    >
                                        <Edit />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Phân trang */}
            <Box mt={2} display="flex" justifyContent="center">
                <Pagination
                    count={Math.ceil(filteredResults.length / rowsPerPage)}
                    page={page + 1}
                    onChange={handleChangePage}
                    color="primary"
                />
            </Box>
        </div>
    );
};

export default NgTable;
