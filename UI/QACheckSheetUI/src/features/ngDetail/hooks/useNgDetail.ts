import { useCallback, useEffect, useState } from "react";
import { getListResultNG } from "../../check/services/checkServices";
import type {
    ConfirmNgPayload,
    NgDetail,
    UpdateValueResultPayload,
} from "../types/ngDetail";
import { createNgDetail, updateNgDetail } from "../services/ngDetail.service";
import { updateValueOrStatus } from "../services/result.service";

type NgDetailResult = {
    resultNgDetails: NgDetail[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    create: (payload: NgDetail) => Promise<NgDetail | null>;
    updateValueOrStatusResult: (
        resultId: number,
        payload: UpdateValueResultPayload
    ) => Promise<boolean | null>;
    confirmNGDetail: (
        ngId: number,
        payload: ConfirmNgPayload
    ) => Promise<NgDetail | null>;
};

export const useNgDetail = (): NgDetailResult => {
    const [resultNgDetails, setResultNgDetails] = useState<NgDetail[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchList = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getListResultNG();
            if (res) setResultNgDetails(res);
        } catch (err: any) {
            setError(err?.message || "Lỗi khi lấy danh sách");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchList();
    }, [fetchList]);

    const create = async (payload: NgDetail) => {
        setLoading(true);
        try {
            const res = await createNgDetail(payload);
            setResultNgDetails((prev) => [res, ...prev]);
            return res;
        } catch (err) {
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateValueOrStatusResult = async (
        resultId: number,
        payload: UpdateValueResultPayload
    ) => {
        setLoading(true);
        try {
            const res = await updateValueOrStatus(resultId, payload);
            res && (await fetchList());
            return res;
        } catch (err) {
            return null;
        } finally {
            setLoading(false);
        }
    };

    const confirmNGDetail = async (ngId: number, payload: ConfirmNgPayload) => {
        setLoading(true);
        try {
            const res = await updateNgDetail(ngId, payload);
            res && (await fetchList());
            return res;
        } catch (err) {
            return null;
        } finally {
            setLoading(false);
        }
    };

    const refresh = async () => {
        await fetchList();
    };

    return {
        resultNgDetails,
        refresh,
        loading,
        error,
        create,
        updateValueOrStatusResult,
        confirmNGDetail,
    };
};

export default useNgDetail;
