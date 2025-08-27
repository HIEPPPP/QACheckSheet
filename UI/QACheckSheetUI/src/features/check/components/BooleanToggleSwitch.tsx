import React, { useMemo, useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";

const options = ["NG", "-", "OK"] as const;
type Opt = (typeof options)[number];

const colors: Record<Opt, string> = {
    NG: "#f44336",
    "-": "#9e9e9e",
    OK: "#4caf50",
};

const shake = keyframes`
  0% { transform: translateX(0); }
  20% { transform: translateX(-2px); }
  40% { transform: translateX(2px); }
  60% { transform: translateX(-1.5px); }
  80% { transform: translateX(1.5px); }
  100% { transform: translateX(0); }
`;

type Props = {
    value?: "OK" | "NG" | null; // controlled value
    onChange?: (val: "OK" | "NG" | null) => void;
    disabled?: boolean;
    size?: number; // width px, default 180
};

const BooleanToggleSwitch: React.FC<Props> = ({
    value = null,
    onChange,
    disabled = false,
    size = 180,
}) => {
    const [isShaking, setIsShaking] = useState(false);
    const idx = useMemo(() => {
        if (value === "NG") return 0;
        if (value === "OK") return 2;
        return 1; // "-"
    }, [value]);

    useEffect(() => {
        // play a gentle appear animation when value changes
        setIsShaking(true);
        const t = setTimeout(() => setIsShaking(false), 240);
        return () => clearTimeout(t);
    }, [value]);

    const handleClick = (opt: Opt) => {
        if (disabled) return;
        const val = opt === "-" ? null : (opt as "OK" | "NG");
        onChange?.(val);
    };

    return (
        <Box
            position="relative"
            display="flex"
            alignItems="center"
            width={size}
            height={44}
            bgcolor="#f3f4f6"
            borderRadius="999px"
            sx={{
                overflow: "hidden",
                userSelect: "none",
                border: "1px solid #e3e3e3",
                opacity: disabled ? 0.6 : 1,
                pointerEvents: disabled ? "none" : "auto",
            }}
        >
            {/* sliding background */}
            <Box
                position="absolute"
                top={4}
                left={`calc(${(idx * 100) / 3}% + 4px)`}
                width={`calc(${100 / 3}% - 8px)`}
                height="calc(100% - 8px)"
                borderRadius="999px"
                sx={{
                    transition:
                        "left 0.22s cubic-bezier(.4,0,.2,1), background-color 0.22s",
                    backgroundColor: value
                        ? value === "OK"
                            ? colors.OK
                            : colors.NG
                        : "transparent",
                    boxShadow: value ? "0 6px 18px rgba(0,0,0,0.12)" : "none",
                    animation: isShaking ? `${shake} 0.24s` : "none",
                }}
            />

            {options.map((opt) => {
                const isSelected =
                    (opt === "OK" && value === "OK") ||
                    (opt === "NG" && value === "NG");
                return (
                    <Box
                        key={opt}
                        flex={1}
                        textAlign="center"
                        zIndex={1}
                        onClick={() => handleClick(opt)}
                        sx={{
                            cursor: disabled ? "not-allowed" : "pointer",
                            userSelect: "none",
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                lineHeight: "44px",
                                fontSize: 14,
                                fontWeight: 600,
                                color: isSelected ? "#fff" : "#333",
                            }}
                        >
                            {opt}
                        </Typography>
                    </Box>
                );
            })}
        </Box>
    );
};

export default React.memo(BooleanToggleSwitch);
