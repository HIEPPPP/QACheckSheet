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

import { formatDateTime } from "../../../utils/formatDateTime";
import type { User } from "../types/users";

// Định nghĩa props cho component
interface UserTableProps {
    users?: User[];
    onEdit: (user: User) => void;
    onDelete: (id: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({
    users = [],
    onEdit,
    onDelete,
}) => {
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [searchText, setSearchText] = useState<string>("");

    // Lọc theo deviceCode hoặc deviceName
    const filteredUser = users.filter((u) =>
        `${u.fullName} ${u.userCode}`
            .toLowerCase()
            .includes(searchText.toLowerCase())
    );

    // Dữ liệu sau phân trang
    const paginatedUser = filteredUser.slice(
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
                                Mã người dùng
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Họ và tên
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Quyền
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Ngày tạo
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Hành động
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedUser.map((user: User, index: number) => (
                            <TableRow
                                key={user.userId}
                                className="hover:bg-gray-100"
                            >
                                <TableCell>
                                    {page * rowsPerPage + index + 1}
                                </TableCell>
                                <TableCell>{user.userCode}</TableCell>
                                <TableCell>{user.fullName}</TableCell>
                                <TableCell>{user.roles}</TableCell>
                                <TableCell>
                                    {formatDateTime(user.createdAt ?? null)}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => onEdit(user)}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() =>
                                            onDelete(Number(user.userId))
                                        }
                                    >
                                        <Delete />
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
                    count={Math.ceil(filteredUser.length / rowsPerPage)}
                    page={page + 1}
                    onChange={handleChangePage}
                    color="primary"
                />
            </Box>
        </Box>
    );
};

export default UserTable;
