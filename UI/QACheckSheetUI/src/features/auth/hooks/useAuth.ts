import { useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../services/authAPI";
import type { UseAuthResult } from "../type/auth";
import { UserContext } from "../../../contexts/UserProvider";

export function useAuth(): UseAuthResult {
    const [userCode, setUserCode] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const { loginUser } = useContext(UserContext);

    const navigate = useNavigate();

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
                const user = await login(userCode, password);

                if (!user) {
                    setError(
                        "Đăng nhập không thành công. Vui lòng kiểm tra lại."
                    );
                    setPassword("");
                    setLoading(false);
                    return;
                }

                loginUser(user);

                setLoading(false);
                navigate("/app/dashboard");
            } catch (err: any) {
                setLoading(false);
                // hiển thị message nếu axios trả về message, nếu không thì fallback chung
                setError(
                    err?.response?.data?.message ??
                        "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau."
                );
            }
        },
        [userCode, password, navigate, loginUser] // thêm loginUser vào dependency
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
