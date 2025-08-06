import { Navigate, useLocation } from "react-router-dom";
import { getAuthData } from "../shared/services/auth.service";

const isAuthenticated = () => {
    const {
        userCode,
        fullName,
        roles: [],
    } = getAuthData();
    return !!userCode;
};

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();

    if (!isAuthenticated()) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
