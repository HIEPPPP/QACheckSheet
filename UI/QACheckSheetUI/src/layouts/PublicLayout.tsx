import { Outlet } from "react-router-dom";

export const PublicLayout = () => {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-[#f9f7f7] shadow-md">
            <Outlet />
        </div>
    );
};
