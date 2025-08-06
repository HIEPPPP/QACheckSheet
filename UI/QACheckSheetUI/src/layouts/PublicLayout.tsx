import { Outlet } from "react-router-dom";

export const PublicLayout = () => {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <Outlet />
        </div>
    );
};
