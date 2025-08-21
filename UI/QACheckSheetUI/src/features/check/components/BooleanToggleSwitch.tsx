import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";

const options = ["NG", "-", "OK"];

const colors = {
    NG: "#f44336",
    "-": "#ff9800",
    OK: "#4caf50",
};

// Tạo hiệu ứng shake
const shake = keyframes`
  0% { transform: translateX(0); }
  20% { transform: translateX(-2px); }
  40% { transform: translateX(2px); }
  60% { transform: translateX(-1.5px); }
  80% { transform: translateX(1.5px); }
  100% { transform: translateX(0); }
`;

type BooleanToggleSwitchProps = {
    defaultValue: string;
    onChange: () => void;
    disabled: boolean;
};

const BooleanToggleSwitch: React.FC<BooleanToggleSwitchProps> = ({
    defaultValue = "-",
    onChange,
    disabled = false,
}) => {
    const [selected, setSelected] = useState(defaultValue);
    const [isShaking, setIsShaking] = useState(false);

    const selectedIndex = options.indexOf(selected);

    const handleClick = (val: any) => {
        // if (disabled || val === selected) return;
        // console.log(disabled);

        setSelected(val);
        val = val === "-" ? null : val; // Chuyển đổi "-" thành null
        onChange?.(val);

        // Kích hoạt hiệu ứng lắc
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 400);
    };

    useEffect(() => {
        if (!options.includes(defaultValue)) {
            setSelected("-");
        }
    }, [defaultValue]);

    return (
        <Box
            position="relative"
            display="flex"
            alignItems="center"
            width={180}
            height={44}
            bgcolor="#f3f4f6"
            borderRadius="999px"
            boxShadow="inset 0 1px 4px rgba(0,0,0,0.1)"
            sx={{
                overflow: "hidden",
                userSelect: "none",
                border: "1px solid #ccc",
                // opacity: disabled ? 0.5 : 1,
                // pointerEvents: disabled ? "none" : "auto",
            }}
        >
            {/* Nút trượt động */}
            <Box
                position="absolute"
                top={3}
                left={`calc(${selectedIndex * 33.33}% + 3px)`}
                width="calc(33.33% - 6px)"
                height="calc(100% - 6px)"
                // bgcolor={colors[selected]}
                borderRadius="999px"
                boxShadow="0 3px 8px rgba(0,0,0,0.2)"
                sx={{
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    animation: isShaking ? `${shake} 0.4s` : "none",
                }}
            />

            {/* Nút văn bản */}
            {options.map((opt) => (
                <Box
                    key={opt}
                    flex={1}
                    textAlign="center"
                    zIndex={1}
                    sx={{
                        cursor: "pointer",
                        fontWeight: 600,
                        transition: "color 0.3s ease",
                        color: selected === opt ? "white" : "#333",
                        "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.05)",
                        },
                        // pointerEvents: disabled ? "none" : "auto",
                    }}
                    onClick={() => handleClick(opt)}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            lineHeight: "44px",
                            fontSize: "15px",
                        }}
                    >
                        {opt}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

export default BooleanToggleSwitch;
