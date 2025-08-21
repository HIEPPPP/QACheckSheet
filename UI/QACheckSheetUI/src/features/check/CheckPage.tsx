import React, { use, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSheetByCode } from "../mstSheet/services/sheetServices";
import { getDeviceByCode } from "../mstDevice/services/deviceServices";

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

    useEffect(() => {
        if (!code) return navigate("/");
        const parts = code.split("-");
        if (parts.length !== 2) return navigate("/");
        setDeviceCode(parts[0]);
        setSheetCode(parts[1]);
    }, [code, navigate]);

    // Lấy Template (Sheet) và danh sách item
    useEffect(() => {
        const fetchTemplate = async () => {
            setLoading(true);
            try {
                const res = await getSheetByCode(sheetCode);
                res && setTemplate(res);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        const fetchItems = async () => {
            setLoading(true);
            try {
                const res = await getDeviceByCode(deviceCode);
                res && setDevice(res);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTemplate();
        fetchItems();
    }, [sheetCode]);

    // Lấy thiết bị
    useEffect(() => {
        const fetchDevice = async () => {
            setLoading(true);
            try {
                const res = await getDeviceByCode(deviceCode);
                res && setDevice(res);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDevice();
    }, [deviceCode]);

    return (
        <div>
            <p>{deviceCode}</p>
            <p>{sheetCode}</p>
            <p>{template.sheetCode}</p>
            <p>{template.sheetName}</p>
            <p>{template.formNO}</p>
            <p>{device.deviceCode}</p>
            <p>{device.deviceName}</p>
        </div>
    );
};

export default CheckPage;
