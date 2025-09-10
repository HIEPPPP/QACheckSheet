import React, { useState } from "react";
import { CheckRounded, Info, RotateRightRounded } from "@mui/icons-material";
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
    TextField,
} from "@mui/material";
import type { ConfirmApproveResult } from "../types/report";

type ReportTableProps = {
    confirmApproveResults: ConfirmApproveResult[];
    onEdit: (cd: ConfirmApproveResult) => void;
    monthRef: string;
    setMonthRef: (m: string) => void;
    setOpen: (open: boolean) => void;
};

const ReportTable: React.FC<ReportTableProps> = ({
    confirmApproveResults = [],
    onEdit,
    monthRef,
    setMonthRef,
    setOpen,
}) => {
    const [searchText, setSearchText] = useState<string>("");
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

    const filtered = confirmApproveResults.filter((cd) =>
        `${cd.deviceCode} ${cd.deviceName} ${cd.sheetName} ${cd.sheetCode}`
            .toLowerCase()
            .includes(searchText.toLowerCase())
    );

    const notConfirmedCount = filtered.filter((cd) => !cd.confirmedBy).length;
    const notApprovedCount = filtered.filter((cd) => !cd.approvedBy).length;

    const handleRowClick = (cd: ConfirmApproveResult) => {
        const id = `${cd.sheetCode}-${cd.deviceCode}`;
        setSelectedRowId(id);
        onEdit(cd);
    };

    return (
        <div>
            <Box className="space-y-2">
                {/* Search & filter */}
                <Box className="flex flex-wrap justify-between gap-4 items-center">
                    <TextField
                        label="Tìm kiếm"
                        variant="outlined"
                        size="small"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />

                    <div className="flex gap-4 items-center">
                        <TextField
                            type="month"
                            label="Tháng"
                            size="small"
                            value={monthRef ? monthRef.substring(0, 7) : ""} // hiển thị "YYYY-MM" cho input
                            onChange={(e) => {
                                // đặt state dạng "YYYY-MM-01"
                                setMonthRef(`${e.target.value}-01`);
                                // tắt report khi thay đổi tháng
                                setOpen(false);
                            }}
                            InputLabelProps={{ shrink: true }}
                        />

                        {/* <Button
                            variant="outlined"
                            size="medium"
                            onClick={onSearch}
                            startIcon={<Search />}
                            className="h-10"
                            disabled={loading}
                        >
                            Làm mới
                        </Button> */}
                    </div>
                </Box>

                {/* Table */}
                <TableContainer
                    component={Paper}
                    sx={{
                        maxHeight: 355,
                        overflowY: "auto",
                    }}
                >
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                {[
                                    "STT",
                                    "Tên Check Sheet",
                                    "Tên Thiết Bị",
                                    "Mã Check Sheet",
                                    "Mã Thiết bị",
                                    "Phê duyệt",
                                    "Xác nhận",
                                    "Hành động",
                                ].map((head) => (
                                    <TableCell
                                        key={head}
                                        sx={{
                                            fontWeight: 700,
                                            backgroundColor: (theme) =>
                                                theme.palette.background.paper,
                                            top: 0,
                                            position: "sticky",
                                            zIndex: 1,
                                        }}
                                    >
                                        {head}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filtered.map((cd, i) => {
                                const id = `${cd.sheetCode}-${cd.deviceCode}`;
                                return (
                                    <TableRow
                                        key={id + i}
                                        hover
                                        selected={selectedRowId === id}
                                        onClick={() => handleRowClick(cd)}
                                        className="cursor-pointer"
                                        sx={{
                                            "&.Mui-selected": {
                                                backgroundColor: (theme) =>
                                                    theme.palette.action
                                                        .selected,
                                            },
                                        }}
                                    >
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell>{cd.sheetName}</TableCell>
                                        <TableCell>{cd.deviceName}</TableCell>
                                        <TableCell>{cd.sheetCode}</TableCell>
                                        <TableCell>{cd.deviceCode}</TableCell>
                                        <TableCell>
                                            {cd.confirmedBy ? (
                                                <CheckRounded className="text-green-600 animate-pulse" />
                                            ) : (
                                                <RotateRightRounded className="text-red-500 animate-spin" />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {cd.approvedBy ? (
                                                <CheckRounded className="text-green-600 animate-pulse" />
                                            ) : (
                                                <RotateRightRounded className="text-red-500 animate-spin" />
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEdit(cd);
                                                }}
                                            >
                                                <Info className="text-blue-400" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Tổng */}
                <Box className="flex gap-6 px-2 py-1 text-sm">
                    <Box className="font-bold">
                        Chưa phê duyệt:{" "}
                        <span className="text-amber-600">
                            {notApprovedCount}
                        </span>
                    </Box>
                    <span>/</span>
                    <Box className="font-bold">
                        Chưa xác nhận:{" "}
                        <span className="text-amber-600">
                            {notConfirmedCount}
                        </span>
                    </Box>
                </Box>
            </Box>
        </div>
    );
};

export default ReportTable;
