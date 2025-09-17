import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Outlet } from "react-router-dom";

export const PrivateLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-y-auto bg-[#f9f7f7]">
                <Header />
                <main className="p-6 flex-1 ">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
