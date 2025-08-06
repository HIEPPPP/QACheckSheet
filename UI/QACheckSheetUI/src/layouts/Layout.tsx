import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => (
    <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-y-auto">
            <Header />
            <main className="mt-16 p-6 bg-gray-100 flex-1">{children}</main>
        </div>
    </div>
);
