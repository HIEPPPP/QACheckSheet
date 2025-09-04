import { useCallback, useEffect, useState } from "react";
import { getListResultNG } from "../../check/services/checkServices";
import type { NgDetail } from "../types/ngDetail";

type NgDetailResult = {
    resultNgDetails: NgDetail[];
    loading: boolean;
    error: string | null;
    // refresh: () => Promise<void>;
    // createNgDetail: (payload: NgDetail)
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

    return {
        resultNgDetails,
        loading,
        error,
    };
};

export default useNgDetail;
