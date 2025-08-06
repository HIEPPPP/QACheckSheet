import React from "react";
import { UserProvider } from "./UserProvider";

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <UserProvider>{children}</UserProvider>;
};

export default AppProvider;
