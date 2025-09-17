import React from "react";
import {
    Alert,
    Autocomplete,
    Button,
    CircularProgress,
    TextField,
    Tooltip,
} from "@mui/material";
import { UserContext } from "../../contexts/UserProvider";
import ItemNodeComponent from "./components/ItemNodeComponent";
import Notification from "../../shared/components/Notification";
import { useEditPage } from "./hooks/useEditPage";

type EditPageProps = {
    rawCode?: string;
    sheetCode?: string;
    deviceCode?: string;
    dayRef?: string;
    onComplete?: () => void;
};

const EditPage: React.FC<EditPageProps> = ({ rawCode, onComplete }) => {
    // const navigate = useNavigate();

    const { user } = React.useContext(UserContext);
    // const role = user?.roles;

    const {
        template,
        device,
        users,
        itemsTree,
        loading,
        error,
        setError,
        isLocked,
        answers,
        setAnswer,
        submitAll,
        isComplete,
        canSubmit,
        snackbar,
        setSnackbar,
        // user
        checker,
        setChecker,
        confirmer,
        setConfirmer,
        setDirty,
    } = useEditPage(rawCode, user);

    // Handler lưu (Hoàn thành)
    const handleFinish = async () => {
        if (isLocked) return;
        const res = await submitAll();
        if (res.success) {
            setSnackbar({
                open: true,
                message:
                    "Cập nhật dữ liệu thành công. Phiếu kiểm tra đã được hoàn thành.",
                severity: "success",
            });

            onComplete?.();
        } else {
            setSnackbar({
                open: true,
                message: "Kiểm tra thất bại!",
                severity: "error",
            });
            setError?.(res.message ?? "Lưu thất bại");
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
                        <div className="flex flex-col gap-4">
                            {/* Người kiểm tra */}
                            <Autocomplete
                                size="small"
                                options={users}
                                getOptionLabel={(opt) => opt.userCode || ""}
                                value={checker ?? null}
                                onChange={(_, val) => {
                                    setChecker(val ?? undefined);
                                    setConfirmer(undefined);
                                    setDirty(true);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Người kiểm tra"
                                    />
                                )}
                                className="w-72"
                            />

                            {/* Người xác nhận */}
                            <Autocomplete
                                size="small"
                                options={users.filter(
                                    (u) =>
                                        u.userCode !== checker?.userCode &&
                                        !String(u.roles)
                                            .toLowerCase()
                                            .includes("operator")
                                )}
                                getOptionLabel={(opt) => opt.userCode || ""}
                                value={confirmer ?? null}
                                onChange={(_, val) => {
                                    setConfirmer(val ?? undefined);
                                    setDirty(true);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Người xác nhận"
                                    />
                                )}
                                className="w-72"
                            />
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
                                disabled={
                                    !canSubmit ||
                                    isLocked ||
                                    !checker ||
                                    !confirmer
                                }
                            >
                                Lưu
                            </Button>
                        </span>
                    </Tooltip>
                </div>
            </main>
            <Notification
                {...snackbar}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
        </div>
    );
};

export default EditPage;
