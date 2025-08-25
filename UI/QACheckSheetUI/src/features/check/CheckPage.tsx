import React, { use, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSheetByCode } from "../mstSheet/services/sheetServices";
import { getDeviceByCode } from "../mstDevice/services/deviceServices";
import { Alert } from "@mui/material";
import { UserContext } from "../../contexts/UserProvider";

interface Template {
    sheetCode?: string;
    sheetName?: string;
    formNO?: string;
}

interface Device {
    deviceCode?: string;
    deviceName?: string;
}

const CheckPage: React.FC = () => {
    const { code } = useParams();
    const navigate = useNavigate();
    const [deviceCode, setDeviceCode] = useState<string>("");
    const [sheetCode, setSheetCode] = useState<string>("");

    // State Loading, Error
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    // State Template
    const [template, setTemplate] = useState<Template>({});
    const [device, setDevice] = useState<Device>({});

    // Sate khóa màn khi đã xác nhận
    const [isLocked, setIsLocked] = useState(false);

    // UserContext
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (!code) return navigate("/");
        const parts = code.split("-");
        if (parts.length !== 2) return navigate("/");
        setDeviceCode(parts[0]);
        setSheetCode(parts[1]);
    }, [code, navigate]);

    // Lấy Template, thiết bị và danh sách item
    useEffect(() => {
        if (!sheetCode || !deviceCode) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const [templateRes, deviceRes] = await Promise.all([
                    getSheetByCode(sheetCode),
                    getDeviceByCode(deviceCode),
                ]);
                templateRes && setTemplate(templateRes);
                deviceRes && setDevice(deviceRes);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [sheetCode, deviceCode]);

    return (
        <div>
            <div className="overflow-auto">
                {isLocked && (
                    <Alert severity="info">
                        Phiếu kiểm tra này đã được xác nhận, bạn không thể thao
                        tác thêm.
                    </Alert>
                )}
                <header>
                    <div
                        className={`p-4 space-y-6 relative ${
                            isLocked ? "pointer-events-none opacity-50" : ""
                        }`}
                    >
                        <h1 className="text-3xl font-bold">
                            {template.sheetName}
                        </h1>
                        <div className="flex justify-between mt-4">
                            <div>
                                <p>
                                    Mã thiết bị:{" "}
                                    <strong>{device.deviceCode}</strong>{" "}
                                </p>
                                <p>
                                    Tên thiết bị:{" "}
                                    <strong>{device.deviceName}</strong>
                                </p>
                            </div>
                            <p>
                                Người kiểm tra:{" "}
                                <strong>{user?.userCode}</strong>{" "}
                            </p>
                        </div>
                    </div>
                </header>
            </div>
        </div>
    );
};

export default CheckPage;
