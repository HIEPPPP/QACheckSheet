import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import type { ItemAnswer, ItemNode } from "../types/CheckResult";
import LeafRow from "./LeafRow";

const ItemNodeComponent: React.FC<{
    node: ItemNode;
    answers: Record<number, ItemAnswer>;
    setAnswer: (itemId: number, partial: Partial<ItemAnswer>) => void;
    disabled?: boolean;
}> = ({ node, answers, setAnswer, disabled = false }) => {
    const ans = answers[node.itemId];
    const isGroup =
        node.children &&
        node.children.length > 0 &&
        (!node.dataType || node.dataType === "");

    if (isGroup) {
        return (
            <Card
                sx={{
                    borderRadius: 1.5,
                    border: "1px solid #ddd",
                    mb: 2,
                    opacity: disabled ? 0.5 : 1,
                }}
            >
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        {node.title}
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                        {node.children!.map((child) => (
                            <ItemNodeComponent
                                key={child.itemId}
                                node={child}
                                answers={answers}
                                setAnswer={setAnswer}
                                disabled={disabled}
                            />
                        ))}
                    </Box>
                </CardContent>
            </Card>
        );
    }

    return (
        <LeafRow
            item={node}
            ans={ans}
            onChange={setAnswer}
            disabled={disabled}
        />
    );
};

export default React.memo(ItemNodeComponent);
