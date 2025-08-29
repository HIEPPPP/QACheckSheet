import React from "react";
import { UserProvider } from "./UserProvider";
import { StatusProvider } from "./StatusProvider";

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <UserProvider>
            <StatusProvider>{children}</StatusProvider>
        </UserProvider>
    );
};

export default AppProvider;
