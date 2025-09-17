// src/features/ng/components/NgTable.tsx
import React, { useMemo, useState } from "react";
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
import type { ConfirmNgPayload, NgDetail } from "../types/ngDetail";
import { Edit } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { formatDateTime, vnTime } from "../../../utils/formatDateTime";
import type { UserLocalStorage } from "../../../shared/type/localstorage";

interface NgTableProps {
    resultNgDetail?: NgDetail[];
    onEdit: (result: NgDetail) => void;
    onConfirm: (payload: ConfirmNgPayload) => void;
    user: UserLocalStorage | null;
}

const NgTable: React.FC<NgTableProps> = ({
    resultNgDetail = [],
    onEdit,
    onConfirm,
    user,
}) => {
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [searchText, setSearchText] = useState<string>("");

    const rolesArr = useMemo(() => {
        const raw = user?.roles;
        if (!raw) return [] as string[];
        if (Array.isArray(raw)) return raw.map((r) => String(r).toLowerCase());
        return [String(raw).toLowerCase()];
    }, [user?.roles]);

    const isOperator = rolesArr.some((r) => r === "operator");

    const filteredResults = useMemo(
        () =>
            resultNgDetail.filter((r) =>
                `${r.sheetCode ?? ""} ${r.sheetName ?? ""} ${
                    r.deviceCode ?? ""
                } ${r.deviceName ?? ""}`
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
            ),
        [resultNgDetail, searchText]
    );

    // Dữ liệu sau phân trang
    const paginatedResults = useMemo(
        () =>
            filteredResults.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
            ),
        [filteredResults, page, rowsPerPage]
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
                        {paginatedResults.map((r: NgDetail, index: number) => {
                            // --- tính toán trạng thái disabled cho nút Check ---
                            const dataType = String(
                                r.dataType ?? ""
                            ).toUpperCase();

                            // 1) BOOLEAN: disabled nếu value === "NG"
                            const booleanDisabled =
                                dataType === "BOOLEAN" &&
                                String(r.value ?? "").toUpperCase() === "NG";

                            // 2) NUMBER: disabled nếu value không phải số hoặc không nằm trong [min,max]
                            let numberDisabled = false;
                            if (dataType === "NUMBER") {
                                const num = Number(r.value);
                                if (!Number.isFinite(num)) {
                                    numberDisabled = true;
                                } else {
                                    const min =
                                        r.min != null ? Number(r.min) : null;
                                    const max =
                                        r.max != null ? Number(r.max) : null;
                                    if (min != null && max != null) {
                                        numberDisabled = !(
                                            num >= min && num <= max
                                        );
                                    } else if (min != null) {
                                        numberDisabled = num < min;
                                    } else if (max != null) {
                                        numberDisabled = num > max;
                                    } else {
                                        numberDisabled = false;
                                    }
                                }
                            }

                            // 3) always disable if fixedBy is current user
                            const fixedByIsCurrentUser =
                                !!r.fixedBy &&
                                r.fixedBy ===
                                    (user?.userCode ??
                                        (user as any)?.UserCode ??
                                        "");

                            const disabledCheckButton =
                                booleanDisabled ||
                                numberDisabled ||
                                fixedByIsCurrentUser;

                            return (
                                <TableRow
                                    key={r.resultId ?? `${page}-${index}`}
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
                                    <TableCell>{r.ngContentDetail}</TableCell>
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
                                    {/* Hành động */}
                                    <TableCell className="w-[120px]">
                                        <IconButton
                                            color="primary"
                                            onClick={() => onEdit(r)}
                                        >
                                            <Edit />
                                        </IconButton>

                                        {/* Nếu user là operator thì ẩn nút fix, ngược lại hiển thị nhưng disable theo điều kiện */}
                                        {!isOperator && (
                                            <IconButton
                                                color="success"
                                                onClick={() =>
                                                    onConfirm({
                                                        ngId: r.ngId ?? 0,
                                                        resultId:
                                                            r.resultId ?? 0,
                                                        confirmedBy:
                                                            user?.userCode ??
                                                            "",
                                                        confirmedDate: new Date(
                                                            vnTime
                                                        ).toISOString(),
                                                    })
                                                }
                                                disabled={disabledCheckButton}
                                                title={
                                                    disabledCheckButton
                                                        ? fixedByIsCurrentUser
                                                            ? "Bạn đã khắc phục mục này"
                                                            : dataType ===
                                                                  "BOOLEAN" &&
                                                              booleanDisabled
                                                            ? "Trạng thái NG"
                                                            : dataType ===
                                                                  "NUMBER" &&
                                                              numberDisabled
                                                            ? "Giá trị không nằm trong giới hạn"
                                                            : "Không thể khắc phục"
                                                        : "Khắc phục"
                                                }
                                            >
                                                <CheckCircleIcon />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Phân trang */}
            <Box mt={2} display="flex" justifyContent="center">
                <Pagination
                    count={Math.max(
                        1,
                        Math.ceil(filteredResults.length / rowsPerPage)
                    )}
                    page={page + 1}
                    onChange={handleChangePage}
                    color="primary"
                />
            </Box>
        </div>
    );
};

export default NgTable;
