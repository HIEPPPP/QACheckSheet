import React, { use, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, CircularProgress } from "@mui/material";
import { UserContext } from "../../contexts/UserProvider";
import { useCheck } from "./hooks/useCheck";
import ItemNodeComponent from "./components/ItemNodeComponent";

type AnswerValue = boolean | number | string | null;
type ItemAnswer = {
    itemId: number;
    value: AnswerValue;
    status?: "OK" | "NG" | null;
    note?: string | null;
};

const CheckPage: React.FC = () => {
    const { code } = useParams();
    const navigate = useNavigate();

    const {
        template,
        device,
        itemsTree,
        loading,
        error,
        isLocked,
        setIsLocked,
    } = useCheck(code);

    const { user } = useContext(UserContext);

    const [answers, setAnswers] = useState<Record<number, ItemAnswer>>({});

    const setAnswer = (itemId: number, partial: Partial<ItemAnswer>) => {
        setAnswers((prev) => {
            const existing = prev[itemId] ?? {
                itemId,
                value: null,
                status: null,
                note: null,
            };

            const merged: ItemAnswer = { ...existing, ...partial };

            merged.itemId = itemId;

            // const next = {
            //     ...prev,
            //     [itemId]: merged,
            // };

            // console.log("Updated answers:", next);

            return {
                ...prev,
                [itemId]: merged,
            };
        });
    };

    return (
        <div className="overflow-auto">
            {isLocked && (
                <Alert severity="info" className="mb-4">
                    Phiếu kiểm tra này đã được xác nhận, bạn không thể thao tác
                    thêm.
                </Alert>
            )}
            <header>
                <div
                    className={`pt-4 space-y-6 relative ${
                        isLocked ? "pointer-events-none opacity-50" : ""
                    }`}
                >
                    <h1 className="text-3xl font-bold">
                        {template?.sheetName}
                    </h1>
                    <div className="flex justify-between mt-4">
                        <div>
                            <p>
                                Mã thiết bị:{" "}
                                <strong>{device?.deviceCode}</strong>
                            </p>
                            <p>
                                Tên thiết bị:{" "}
                                <strong>{device?.deviceName}</strong>
                            </p>
                        </div>
                        <p>
                            Người kiểm tra: <strong>{user?.userCode}</strong>
                        </p>
                    </div>
                </div>
            </header>

            <main className="mt-6">
                {loading && (
                    <div className="flex justify-center py-6">
                        <CircularProgress />
                    </div>
                )}
                {error && <div className="text-red-600">{error}</div>}

                {itemsTree?.map((node) => (
                    <ItemNodeComponent
                        key={node.itemId}
                        node={node}
                        answers={answers}
                        setAnswer={setAnswer}
                        disabled={isLocked}
                    />
                ))}

                <div className="mt-6 pb-2 flex justify-center">
                    <Button
                        variant="contained"
                        color="primary"
                        // onClick={handleSubmit}
                        disabled={isLocked}
                    >
                        Lưu Dữ Liệu
                    </Button>
                </div>
            </main>
        </div>
    );
};

export default CheckPage;
