import { Box, TextField, Typography } from "@mui/material";
import BooleanToggleSwitch from "./BooleanToggleSwitch";
import type { ItemAnswer, ItemNode } from "../types/CheckResult";

const LeafRow: React.FC<{
    item: ItemNode;
    ans?: ItemAnswer;
    onChange: (itemId: number, partial: Partial<ItemAnswer>) => void;
    disabled?: boolean;
}> = ({ item, ans, onChange, disabled = false }) => {
    const value = ans?.value ?? "";
    const status = ans?.status ?? null;

    return (
        <Box
            className="flex items-center justify-between gap-4 mb-2"
            sx={{
                padding: "10px 12px",
                borderRadius: 1,
                bgcolor: "#fff",
                border: "1px solid #eee",
                opacity: disabled ? 0.5 : 1,
            }}
        >
            <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 600 }}>{item.title}</Typography>
                {item.pathTitles && (
                    <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", mt: 0.5 }}
                    >
                        {item.pathTitles}
                    </Typography>
                )}
            </Box>

            <Box
                sx={{
                    minWidth: 180,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                    alignItems: "center",
                }}
            >
                {/* BOOLEAN */}
                {item.dataType === "BOOLEAN" && (
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <BooleanToggleSwitch
                            value={status}
                            onChange={(v) => {
                                if (v === "OK")
                                    onChange(item.itemId, {
                                        status: "OK",
                                        value: "OK",
                                    });
                                else if (v === "NG")
                                    onChange(item.itemId, {
                                        status: "NG",
                                        value: "OK",
                                    });
                                else
                                    onChange(item.itemId, {
                                        status: null,
                                        value: null,
                                    });
                            }}
                            size={200}
                            disabled={disabled}
                        />
                    </Box>
                )}
                {/* NUMBER */}
                {item.dataType === "NUMBER" && (
                    <TextField
                        size="small"
                        type="number"
                        value={value ?? ""}
                        onChange={(e) =>
                            onChange(item.itemId, {
                                value:
                                    e.target.value === ""
                                        ? null
                                        : Number(e.target.value),
                            })
                        }
                        inputProps={{
                            min: item.min ?? undefined,
                            max: item.max ?? undefined,
                        }}
                        error={
                            value !== "" &&
                            ((item.min !== undefined &&
                                Number(value) < Number(item.min)) ||
                                (item.max !== undefined &&
                                    Number(value) > Number(item.max)))
                        }
                        helperText={
                            value !== "" &&
                            (Number(item.min) !== undefined &&
                            Number(value) < Number(item.min)
                                ? `Giá trị nhỏ hơn ${Number(
                                      item.min
                                  )} => Đánh giá NG`
                                : Number(item.max) !== undefined &&
                                  Number(value) > Number(item.max)
                                ? `Giá trị vượt quá ${Number(
                                      item.max
                                  )} => Đánh giá NG`
                                : "")
                        }
                    />
                )}
                {/* TEXT */}
                {(item.dataType === "TEXT" || item.dataType === "") && (
                    <TextField
                        size="small"
                        multiline
                        minRows={2}
                        value={value ?? ""}
                        onChange={(e) =>
                            onChange(item.itemId, { value: e.target.value })
                        }
                        sx={{ width: 280 }}
                    />
                )}
            </Box>
        </Box>
    );
};

export default LeafRow;
