// DashboardPage.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDashboard } from "./hooks/useDashboard";
import Devices from "./components/Devices";
import ErrorIcon from "@mui/icons-material/Error";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FilterDevice from "./components/FilterDevice";
import { Close, Pending, QrCode } from "@mui/icons-material";
import {
    Alert,
    Button,
    IconButton,
    LinearProgress,
    TextField,
} from "@mui/material";
import { useStatus } from "../../contexts/StatusProvider";
import type { DeviceSheet } from "../editData/types/EditData";
import { getDevicesBySheetCode } from "../mstDevice/services/deviceServices";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";

type FilterKey = "All" | "Pending" | "OK" | "NG" | "Confirm";

const DashboardPage: React.FC = () => {
    // const { devices, loading, error } = useDashboard();
    const { devices, loading } = useDashboard();
    const { totals } = useStatus();
    const navigate = useNavigate();

    // UI state
    const [selectedFilter, setSelectedFilter] = useState<FilterKey>("All");

    // Scanner state
    const [showScanner, setShowScanner] = useState<boolean>(false); // for camera on tablet/mobile
    const [showInput, setShowInput] = useState<boolean>(false); // for desktop text input
    const [scannerError, setScannerError] = useState<string>("");
    const scannerRef = useRef<Html5Qrcode | null>(null);
    // const videoStreamRef = useRef<MediaStream | null>(null);

    const inputRef = useRef<HTMLInputElement | null>(null);

    // device detection: desktop vs touch/tablet
    const [isDesktop, setIsDesktop] = useState<boolean>(() => {
        if (typeof window === "undefined") return true;
        const touch = navigator.maxTouchPoints && navigator.maxTouchPoints > 0;
        return !touch && window.innerWidth > 1024;
    });

    useEffect(() => {
        const onResize = () => {
            const touch =
                navigator.maxTouchPoints && navigator.maxTouchPoints > 0;
            setIsDesktop(!touch && window.innerWidth > 1024);
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const sampleStats = [
        {
            id: "Pending",
            title: "Pending",
            value: String(totals.pending ?? 0),
            icon: <Pending />,
            accent: "orange",
        },
        {
            id: "OK",
            title: "OK",
            value: String(Number(totals.ok - totals.confirmed) ?? 0),
            icon: <ThumbUpIcon />,
            accent: "blue",
        },
        {
            id: "NG",
            title: "NG",
            value: String(totals.ng ?? 0),
            icon: <ErrorIcon />,
            accent: "red",
        },
        {
            id: "Confirm",
            title: "Confirm",
            value: String(totals.confirmed ?? 0),
            icon: <CheckCircleIcon />,
            accent: "green",
        },
    ];

    // Called when we get a scanned code
    const handleScannedCode = useCallback(
        async (decodedText: string) => {
            // normalized
            const parts = decodedText.toLocaleUpperCase().split("-");
            const [deviceCode = "", sheetCode = ""] = parts.map((p) =>
                p.trim()
            );
            const raw = `${deviceCode}-${sheetCode}`.toLocaleUpperCase();
            const token = btoa(raw);

            try {
                const res = await getDevicesBySheetCode(sheetCode);
                const exists = res.some(
                    (item: DeviceSheet) =>
                        item.deviceCode === deviceCode &&
                        item.sheetCode === sheetCode
                );
                if (exists) {
                    navigate(`/app/check/${encodeURIComponent(token)}`);
                    // navigate(`/app/check/${raw}`);
                } else {
                    alert("Không tìm thấy mã (device-sheet) tương ứng.");
                }
            } catch (err) {
                console.error(err);
                alert("Lỗi khi kiểm tra mã. Vui lòng thử lại.");
            }
        },
        [navigate]
    );

    // Start camera scanner using Html5Qrcode
    const startScanner = useCallback(async () => {
        setScannerError("");
        const qrRegionId = "qr-reader";

        // Wait for element
        const waitForElement = (id: string, timeout = 3000) =>
            new Promise<HTMLElement | null>((resolve) => {
                const el = document.getElementById(id);
                if (el) return resolve(el as HTMLElement);
                let waited = 0;
                const iv = window.setInterval(() => {
                    const el2 = document.getElementById(id);
                    if (el2) {
                        clearInterval(iv);
                        resolve(el2 as HTMLElement);
                    } else {
                        waited += 100;
                        if (waited >= timeout) {
                            clearInterval(iv);
                            resolve(null);
                        }
                    }
                }, 100);
            });

        const mountEl = await waitForElement(qrRegionId, 3000);
        if (!mountEl) {
            setScannerError("Lỗi giao diện: vùng quét chưa sẵn sàng.");
            setShowScanner(false);
            return;
        }

        let html5Qrcode: Html5Qrcode;
        try {
            html5Qrcode = new Html5Qrcode(qrRegionId);
            scannerRef.current = html5Qrcode;
        } catch (err) {
            setScannerError("Không thể khởi tạo scanner.");
            setShowScanner(false);
            return;
        }

        const config = {
            fps: 10,
            qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
                const size = Math.min(viewfinderWidth, viewfinderHeight, 360); // <= 360px
                return { width: size, height: size }; // vuông
            },
            aspectRatio: 1,
        };
        const onSuccess = (decodedText: string) => {
            (html5Qrcode.stop() as unknown as Promise<void>)
                .catch(() => {})
                .finally(() => setShowScanner(false));
            handleScannedCode(decodedText);
        };
        const onError = (errMsg: string) =>
            console.debug("decode error:", errMsg);

        // helper: enumerate devices (returns videoinput list)
        const listVideoInputs = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                return devices.filter((d) => d.kind === "videoinput");
            } catch (e) {
                console.warn("enumerateDevices error", e);
                return [];
            }
        };

        try {
            // 1) Try to trigger permission prompt on mobile/tablet by calling getUserMedia simple
            // This often makes labels/deviceIds appear on subsequent enumerateDevices()
            try {
                await navigator.mediaDevices.getUserMedia({ video: true });
                // stop tracks immediately (we just wanted permission)
                try {
                    const s = await navigator.mediaDevices.getUserMedia({
                        video: true,
                    });
                    s.getTracks().forEach((t) => t.stop());
                } catch (e) {
                    /* ignore */
                }
            } catch (gmErr) {
                // If user denied or it fails, we'll capture it below
                console.warn("Initial getUserMedia failed:", gmErr);
            }

            // 2) enumerate to pick camera
            const cams = await listVideoInputs();
            console.debug("Video inputs:", cams);

            if (cams.length > 0) {
                // prefer rear/back if label suggests it, else last one
                const rear = cams.find((c) =>
                    /back|rear|environment|rear camera/i.test(c.label || "")
                );
                const chosen = (rear ||
                    cams[cams.length - 1]) as MediaDeviceInfo;
                console.log(
                    "Starting with deviceId:",
                    chosen.deviceId,
                    "label:",
                    chosen.label
                );
                await html5Qrcode.start(
                    chosen.deviceId,
                    config,
                    onSuccess,
                    onError
                );
                return;
            }

            // 3) try non-exact facingMode (less strict than exact)
            try {
                console.log("Trying facingMode: 'environment'");
                await html5Qrcode.start(
                    { facingMode: "environment" } as MediaTrackConstraints,
                    config,
                    onSuccess,
                    onError
                );
                return;
            } catch (fmErr) {
                console.warn("facingMode environment failed:", fmErr);
            }

            // 4) final fallback: try default camera
            console.log("Trying default camera (no constraints)");
            await html5Qrcode.start(
                undefined as unknown as MediaTrackConstraints,
                config,
                onSuccess,
                onError
            );
        } catch (err) {
            console.error("Không thể khởi động máy quét:", err);
            // show detailed error for debugging
            const name = (err && (err as any).name) || "Error";
            const msg = (err && (err as any).message) || String(err);
            setScannerError(`${name}: ${msg}`);
            setShowScanner(false);
        }
    }, [handleScannedCode]);

    // Stop scanner & cleanup
    const stopScanner = useCallback(async () => {
        if (!scannerRef.current) return;
        try {
            await (scannerRef.current.stop() as unknown as Promise<void>);
        } catch (e) {
            // ignore
        }
        try {
            await (scannerRef.current.clear() as unknown as Promise<void>);
        } catch (e) {
            // ignore
        }
        scannerRef.current = null;
    }, []);

    // toggle control: tablet -> camera, desktop -> text input
    const onToggleScan = () => {
        setScannerError("");
        if (isDesktop) {
            // close camera if open, toggle input
            setShowScanner(false);
            void stopScanner();
            setShowInput((prev) => {
                const next = !prev;
                // focus input after it appears
                setTimeout(() => inputRef.current?.focus(), 50);
                return next;
            });
        } else {
            // tablet/mobile -> toggle camera scanner
            setShowInput(false);
            setShowScanner((prev) => !prev);
        }
    };

    // Effect: when showScanner true, start scanner (tablet/mobile)
    useEffect(() => {
        if (showScanner) {
            void startScanner();
        } else {
            void stopScanner();
        }
    }, [showScanner, startScanner, stopScanner]);

    // cleanup on unmount
    useEffect(() => {
        return () => {
            void stopScanner();
        };
    }, [stopScanner]);

    // Handle enter on text input
    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const val = (e.target as HTMLInputElement).value.trim();
            if (val) {
                setShowInput(false);
                handleScannedCode(val);
                (e.target as HTMLInputElement).value = "";
            }
        } else if (e.key === "Escape") {
            setShowInput(false);
        }
    };

    return (
        <div className="flex flex-col">
            <div className="flex justify-between">
                {loading && <LinearProgress />}
                <div className="max-w-2xl w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mr-6">
                        {sampleStats.map((s) => (
                            <FilterDevice
                                key={s.id}
                                title={s.title}
                                value={s.value}
                                icon={s.icon}
                                accent={s.accent as any}
                                active={
                                    selectedFilter ===
                                    (s.id === "Confirm"
                                        ? "Confirm"
                                        : (s.id as FilterKey))
                                }
                                onClick={() =>
                                    setSelectedFilter(
                                        selectedFilter ===
                                            (s.id === "Confirm"
                                                ? "Confirm"
                                                : (s.id as FilterKey))
                                            ? "All"
                                            : ((s.id === "Confirm"
                                                  ? "Confirm"
                                                  : (s.id as FilterKey)) as FilterKey)
                                    )
                                }
                            />
                        ))}
                    </div>
                </div>

                {/* Scan toggle button */}
                <Button
                    variant="outlined"
                    color="info"
                    onClick={onToggleScan}
                    startIcon={<QrCode />}
                >
                    <span className="font-bold text-xl">
                        {/* show context-aware label */}
                        {isDesktop
                            ? showInput
                                ? "TẮT NHẬP MÃ"
                                : "NHẬP MÃ"
                            : showScanner
                            ? "UNCHECK"
                            : "CHECK"}
                    </span>
                </Button>
            </div>

            {scannerError && (
                <div className="mt-4 px-4">
                    <Alert severity="error" onClose={() => setScannerError("")}>
                        {scannerError}
                    </Alert>
                </div>
            )}

            {/* Camera scanner (tablet/mobile) */}
            {showScanner && !scannerError && !isDesktop && (
                <div className="mt-5 relative">
                    {/* container vuông responsive: tối đa 360px, luôn 1:1 */}
                    <div
                        id="qr-reader"
                        className="mx-auto w-full max-w-[360px] aspect-square"
                        style={{ touchAction: "manipulation" }}
                    />
                    <IconButton
                        onClick={() => setShowScanner(false)}
                        sx={{
                            position: "absolute",
                            top: 0,
                            right: "calc(50% - 180px)", // chỉnh lại nếu cần
                        }}
                    >
                        <Close />
                    </IconButton>
                </div>
            )}

            {/* Text input (desktop) */}
            {isDesktop && showInput && (
                <div className="mt-5">
                    <div style={{ maxWidth: 500 }}>
                        <TextField
                            inputRef={inputRef}
                            label="Scan hoặc nhập mã barcode"
                            placeholder="VD: DV4-CS6"
                            fullWidth
                            variant="outlined"
                            onKeyDown={onInputKeyDown}
                            inputProps={{
                                autoComplete: "off",
                            }}
                        />
                        <div className="mt-2 text-sm text-gray-600">
                            Lưu ý: nhiều máy quét barcode hoạt động như bàn phím
                            — khi quét xong sẽ tự gõ giá trị và gửi Enter. Hoặc
                            bạn có thể nhập tay rồi nhấn Enter.
                        </div>
                    </div>
                </div>
            )}

            <hr className="opacity-6 mt-10" />

            <Devices devices={devices} filter={selectedFilter} />
        </div>
    );
};

export default DashboardPage;
