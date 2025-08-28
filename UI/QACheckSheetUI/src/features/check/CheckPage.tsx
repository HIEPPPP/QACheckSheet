// src/features/check/pages/CheckPage.tsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, CircularProgress } from "@mui/material";
import { UserContext } from "../../contexts/UserProvider";
import { useCheck } from "./hooks/useCheck";
import ItemNodeComponent from "./components/ItemNodeComponent";

const CheckPage: React.FC = () => {
    const { code } = useParams();
    const navigate = useNavigate();

    const { user } = React.useContext(UserContext);

    console.log("User " + user?.roles);

    // pass user into useCheck so it can use CheckedBy/UpdateBy info in submit
    const {
        template,
        device,
        itemsTree,
        loading,
        error,
        isLocked,
        setIsLocked,
        answers,
        setAnswer,
        submitAll,
    } = useCheck(code, user);

    const handleFinish = async () => {
        if (isLocked) return;
        const res = await submitAll();
        if (res.success) {
            // optionally show toast / notification; here just console
            console.log("Submitted:", res);
        } else {
            console.error("Submit failed:", res);
        }
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
                        onClick={handleFinish}
                        disabled={isLocked}
                    >
                        Hoàn thành
                    </Button>
                </div>
            </main>
        </div>
    );
};

export default CheckPage;
