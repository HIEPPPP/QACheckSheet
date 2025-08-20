import React, { useState } from "react";
import type { Sheet, ItemDTO } from "../types/item";

// MUI
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";

// icons (keeps your ItemRow)
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Add, Delete, Edit } from "@mui/icons-material";

// --- keep your ItemRow as-is (recursive) ---
const ItemRow: React.FC<{
    item: ItemDTO;
    onAddChild?: (item: ItemDTO) => void;
    onEdit?: (item: ItemDTO) => void;
    onDelete?: (itemId: number) => void;
}> = ({ item, onAddChild, onEdit, onDelete }) => {
    const [open, setOpen] = useState(false);
    const level = Math.max(1, item?.level ?? 1);
    const indentPx = Math.min((level - 1) * 16, 64); // cap indent

    return (
        <>
            <TableRow hover className={`item-row simple level-${level}`}>
                <TableCell className="align-top" sx={{ position: "relative" }}>
                    <div className="flex items-center">
                        {item.children && item.children.length > 0 ? (
                            <IconButton
                                size="small"
                                onClick={() => setOpen((s) => !s)}
                            >
                                {open ? (
                                    <KeyboardArrowUpIcon />
                                ) : (
                                    <KeyboardArrowDownIcon />
                                )}
                            </IconButton>
                        ) : (
                            <div style={{ width: 40 }} />
                        )}

                        <div
                            style={{ paddingLeft: indentPx }}
                            className="max-w-[350px] min-w-[350px] text-wrap truncate"
                        >
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-gray-500">
                                {item.pathTitles}
                            </div>
                        </div>
                    </div>
                </TableCell>

                <TableCell>{item.dataType}</TableCell>
                <TableCell>{item.isRequired ? "Yes" : "No"}</TableCell>
                <TableCell>{item.min ?? "-"}</TableCell>
                <TableCell>{item.max ?? "-"}</TableCell>

                <TableCell>
                    <IconButton
                        color="success"
                        onClick={() => onAddChild && onAddChild(item)}
                    >
                        <Add />
                    </IconButton>
                    <IconButton
                        color="primary"
                        onClick={() => onEdit && onEdit(item)}
                    >
                        <Edit />
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={() =>
                            onDelete && onDelete(Number(item.itemId))
                        }
                    >
                        <Delete />
                    </IconButton>
                </TableCell>
            </TableRow>

            {open &&
                item.children &&
                item.children.map((child) => (
                    <ItemRow
                        key={child.itemId}
                        item={child}
                        onAddChild={onAddChild}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
        </>
    );
};

// --- New ItemTable that shows per-sheet selection ---
interface ItemTableProps {
    sheets: Sheet[];
    onAddChild?: (item: ItemDTO) => void;
    onEdit?: (item: ItemDTO) => void;
    onDelete?: (itemId: number) => void;
    refresh?: () => Promise<void>;
    onCancel?: () => void;
}

const ItemTable: React.FC<ItemTableProps> = ({
    sheets,
    onAddChild,
    onEdit,
    onDelete,
}) => {
    const [selectedSheetId, setSelectedSheetId] = useState<number | "all">(
        sheets && sheets.length > 0 ? "all" : "all"
    );

    // derive which sheets to display based on selection
    const displayedSheets =
        selectedSheetId === "all"
            ? sheets
            : sheets.filter((s) => s.sheetId === selectedSheetId);

    return (
        <div>
            {/* controls: sheet selector */}
            <Box
                className="flex flex-col items-end justify-between float-end"
                my={2}
            >
                <FormControl size="small" style={{ minWidth: 240 }}>
                    <InputLabel id="sheet-select-label">Chọn Sheet</InputLabel>
                    <Select
                        labelId="sheet-select-label"
                        value={selectedSheetId}
                        label="Chọn Sheet"
                        onChange={(e) =>
                            setSelectedSheetId(
                                e.target.value === "all"
                                    ? "all"
                                    : (e.target.value as number)
                            )
                        }
                    >
                        <MenuItem value="all">Tất cả sheets</MenuItem>
                        {sheets.map((s) => (
                            <MenuItem key={s.sheetId} value={s.sheetId}>
                                {s.sheetName} ({s.sheetCode})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* optional: quick info */}
                <div className="text-sm mt-1 text-gray-500">
                    Hiển thị {displayedSheets.length} sheet
                </div>
            </Box>

            <div className="mt-6 space-y-6">
                {displayedSheets.map((sheet) => (
                    <div key={sheet.sheetId}>
                        <TableContainer
                            component={Paper}
                            className="shadow-2xl mt-2 p-1  "
                        >
                            <div className=" flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-orange-600">
                                        {sheet.sheetName}{" "}
                                        <span className="text-blue-800">
                                            ({sheet.sheetCode})
                                        </span>
                                    </h3>
                                    <div className="text-sm text-gray-500">
                                        {sheet.formNO}
                                    </div>
                                </div>
                            </div>
                            <Table>
                                <TableHead className="bg-gray-300">
                                    <TableRow>
                                        <TableCell>Nội dung</TableCell>
                                        <TableCell>Kiểu dữ liệu</TableCell>
                                        <TableCell>Bắt buộc kiểm tra</TableCell>
                                        <TableCell>Min</TableCell>
                                        <TableCell>Max</TableCell>
                                        <TableCell>Hành động</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {sheet.items && sheet.items.length > 0 ? (
                                        sheet.items.map((item) => (
                                            <ItemRow
                                                key={item.itemId}
                                                item={item}
                                                onAddChild={onAddChild}
                                                onEdit={onEdit}
                                                onDelete={onDelete}
                                            />
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="text-center text-gray-500"
                                            >
                                                No items
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                ))}

                {displayedSheets.length === 0 && (
                    <div className="text-gray-500">No sheets found</div>
                )}
            </div>
        </div>
    );
};

export default ItemTable;
