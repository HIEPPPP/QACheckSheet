// src/features/check/pages/CheckPage.tsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, CircularProgress, Tooltip } from "@mui/material";
import { UserContext } from "../../contexts/UserProvider";
import { useCheck } from "./hooks/useCheck";
import ItemNodeComponent from "./components/ItemNodeComponent";
import Notification from "../../shared/components/Notification";
import { useStatus } from "../../contexts/StatusProvider";

const CheckPage: React.FC = () => {
    const { code } = useParams();
    const navigate = useNavigate();

    const { user } = React.useContext(UserContext);
    const role = user?.roles;

    const {
        template,
        device,
        itemsTree,
        loading,
        error,
        setError,
        isLocked,
        checkedBy,
        setIsLocked,
        answers,
        setAnswer,
        submitAll,
        confirmAll,
        dirty,
        isComplete,
        canSubmit,
        canConfirm,
        snackbar,
        setSnackbar,
    } = useCheck(code, user);

    const { refreshStatus } = useStatus();

    // Handler lưu (Hoàn thành)
    const handleFinish = async () => {
        if (isLocked) return;
        const res = await submitAll();
        if (res.success) {
            setSnackbar({
                open: true,
                message:
                    "Hoàn thành kiểm tra, sẽ chuyển hướng về màn hình chính!",
                severity: "success",
            });
            // refresh status
            await refreshStatus();
            setTimeout(() => {
                navigate("/app/dashboard");
            }, 2500);
        } else {
            setSnackbar({
                open: true,
                message: "Kiểm tra thất bại!",
                severity: "error",
            });
            setError?.(res.message ?? "Lưu thất bại");
        }
    };

    // Handler xác nhận
    const handleConfirm = async () => {
        if (isLocked) return;

        // kiểm tra thêm bảo mật (một lần nữa)
        if ((user?.userCode ?? "") === (checkedBy ?? "")) {
            setError("Người xác nhận không được là người kiểm tra.");
            return;
        }

        if (!isComplete) {
            setError("Chưa trả lời hết câu hỏi. Không thể xác nhận.");
            return;
        }

        if (dirty) {
            setError("Vui lòng nhấn Hoàn thành (Lưu) trước khi xác nhận.");
            return;
        }

        if (String(role).toLowerCase().includes("operator")) {
            setError("Operator không có quyền xác nhận.");
            return;
        }

        const res = await confirmAll();
        if (res.success) {
            setSnackbar({
                open: true,
                message:
                    "Xác nhận thành công, sẽ chuyển hướng về màn hình chính",
                severity: "success",
            });
            // refresh status
            await refreshStatus();
            setTimeout(() => {
                navigate("/app/dashboard");
            }, 2500);
        } else {
            setSnackbar({
                open: true,
                message: "Xác nhận thất bại!",
                severity: "error",
            });
            setError?.(res.message ?? "Xác nhận thất bại");
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
                        <p>
                            {String(role).toLowerCase().includes("operator") ? (
                                <span>
                                    Người kiểm tra:{" "}
                                    <strong>{user?.userCode}</strong>
                                </span>
                            ) : (
                                <span>
                                    Người xác nhận:{" "}
                                    <strong>{user?.userCode}</strong>
                                </span>
                            )}
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

                <div className="mt-6 pb-2 flex justify-center gap-4">
                    {/* Hoàn thành */}
                    <Tooltip
                        title={
                            !isComplete
                                ? "Chưa trả lời hết câu hỏi"
                                : !canSubmit
                                ? "Không có thay đổi để lưu"
                                : ""
                        }
                    >
                        <span>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleFinish}
                                disabled={!canSubmit || isLocked}
                            >
                                {!String(role)
                                    .toLowerCase()
                                    .includes("operator")
                                    ? "Lưu"
                                    : "Hoàn thành"}
                            </Button>
                        </span>
                    </Tooltip>

                    {/* Xác nhận (chỉ cho non-operator) */}
                    {!String(role).toLowerCase().includes("operator") && (
                        <Tooltip
                            title={
                                isLocked
                                    ? "Phiếu đã bị khóa"
                                    : !isComplete
                                    ? "Chưa trả lời hết câu hỏi"
                                    : dirty
                                    ? "Vui lòng lưu trước khi xác nhận"
                                    : (user?.userCode ?? "") ===
                                      (checkedBy ?? "")
                                    ? "Người xác nhận không được là người kiểm tra"
                                    : ""
                            }
                        >
                            <span>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleConfirm}
                                    disabled={!canConfirm || isLocked}
                                >
                                    Xác nhận
                                </Button>
                            </span>
                        </Tooltip>
                    )}
                </div>
            </main>
            <Notification
                {...snackbar}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
        </div>
    );
};

export default CheckPage;
