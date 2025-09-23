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
import React, { useMemo, useState } from "react";

import type { TypeSheetDTO } from "../types/typeSheet";

import { formatDateTime } from "../../../utils/formatDateTime";

interface TypeSheetTableProps {
    typeSheets?: TypeSheetDTO[]; // make optional to be safer
    onEdit: (typeSheet: TypeSheetDTO) => void;
    onDelete: (id: number) => void;
}

const TypeSheetTable: React.FC<TypeSheetTableProps> = ({
    typeSheets = [], // default empty array
    onEdit,
    onDelete,
}) => {
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [searchText, setSearchText] = useState<string>("");

    // memoize filtered results to avoid recalculating on unrelated renders
    const filteredSheets = useMemo(() => {
        const q = searchText?.toLowerCase?.() ?? "";
        return (typeSheets ?? []).filter((type) => {
            // defensive: skip null/undefined elements
            if (!type) return false;
            const sheetCode = (type.sheetCode ?? "").toString();
            const sheetName = (type.sheetName ?? "").toString();
            const deviceTypeCode = (type.deviceTypeCode ?? "").toString();
            const deviceTypeName = (type.deviceTypeName ?? "").toString();
            return `${sheetCode} ${sheetName} ${deviceTypeCode} ${deviceTypeName}`
                .toLowerCase()
                .includes(q);
        });
    }, [typeSheets, searchText]);

    // pagination computed from filtered list
    const paginatedSheets = useMemo(() => {
        const start = page * rowsPerPage;
        return filteredSheets.slice(start, start + rowsPerPage);
    }, [filteredSheets, page, rowsPerPage]);

    const handleChangePage = (
        _: React.ChangeEvent<unknown>,
        newPage: number
    ) => {
        setPage(Math.max(0, newPage - 1));
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const v = parseInt(event.target.value, 10) || 10;
        setRowsPerPage(v);
        setPage(0);
    };

    return (
        <Box>
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

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow className="bg-gray-200">
                            <TableCell sx={{ fontWeight: 700 }}>STT</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Mã Sheet
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Tên Sheet
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Mã loại thiết bị
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Tên loại thiết bị
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
                        {paginatedSheets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={10} align="center">
                                    Không có dữ liệu
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedSheets.map(
                                (
                                    typSheet: TypeSheetDTO | null,
                                    index: number
                                ) => {
                                    // defensive: if somehow element is null, skip rendering a normal row
                                    if (!typSheet) {
                                        return (
                                            <TableRow key={`null-${index}`}>
                                                <TableCell colSpan={10}>
                                                    Dữ liệu không hợp lệ
                                                </TableCell>
                                            </TableRow>
                                        );
                                    }

                                    const safeId = typSheet.id ?? index;
                                    return (
                                        <TableRow
                                            key={safeId}
                                            className="hover:bg-gray-100"
                                        >
                                            <TableCell>
                                                {page * rowsPerPage + index + 1}
                                            </TableCell>
                                            <TableCell>
                                                {typSheet.sheetCode ?? ""}
                                            </TableCell>
                                            <TableCell>
                                                {typSheet.sheetName ?? ""}
                                            </TableCell>
                                            <TableCell>
                                                {typSheet.deviceTypeCode ?? ""}
                                            </TableCell>
                                            <TableCell>
                                                {typSheet.deviceTypeName ?? ""}
                                            </TableCell>
                                            <TableCell>
                                                {formatDateTime(
                                                    typSheet.createAt
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {typSheet.createBy ?? ""}
                                            </TableCell>
                                            <TableCell>
                                                {formatDateTime(
                                                    typSheet.updateAt
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {typSheet.updateBy ?? ""}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>
                                                        onEdit(typSheet)
                                                    }
                                                >
                                                    <Edit />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() =>
                                                        onDelete(
                                                            Number(typSheet.id)
                                                        )
                                                    }
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                }
                            )
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box mt={2} display="flex" justifyContent="center">
                <Pagination
                    count={Math.max(
                        1,
                        Math.ceil(filteredSheets.length / rowsPerPage)
                    )}
                    page={page + 1}
                    onChange={handleChangePage}
                    color="primary"
                />
            </Box>
        </Box>
    );
};

export default React.memo(TypeSheetTable);
