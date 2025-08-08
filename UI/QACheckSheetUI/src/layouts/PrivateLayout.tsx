import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Outlet } from "react-router-dom";

export const PrivateLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-y-auto">
                <Header />
                <main className="mt-16 p-6 flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
