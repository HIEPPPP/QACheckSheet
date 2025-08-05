import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authAPI";

import type { UseAuthResult } from "../type/auth";

export function useAuth(): UseAuthResult {
    const [userCode, setUserCode] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    // const navigate = useNavigate();

    const handleSubmit = useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setError("");
            if (!userCode || !password) {
                setError("Vui lòng nhập mã nhân viên và mật khẩu.");
                return;
            }

            setLoading(true);
            try {
                const result = await login(userCode, password);
                setLoading(false);

                if (!result) {
                    setError(
                        "Đăng nhập không thành công. Vui lòng kiểm tra lại."
                    );
                    setPassword("");
                } else {
                    // navigate("/dashboard");
                }
            } catch (err) {
                setLoading(false);
                setError("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.");
            }
        },

        [
            userCode,
            password,
            // navigate
        ]
    );

    return {
        userCode,
        password,
        error,
        loading,
        setUserCode,
        setPassword,
        handleSubmit,
    };
}
