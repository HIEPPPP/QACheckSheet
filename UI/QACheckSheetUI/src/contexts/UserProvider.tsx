import React, { createContext, useState } from "react";

import { getAuthData, clearAuthData } from "../shared/services/auth.service";
import type { UserLocalStorage } from "../shared/type/localstorage";

export const UserContext = createContext<{
    user: UserLocalStorage | null;
    loginUser: (data: UserLocalStorage) => void;
    logoutUser: () => void;
}>({
    user: null,
    loginUser: () => {},
    logoutUser: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<UserLocalStorage | null>(getAuthData());
    const loginUser = (data: UserLocalStorage) => {
        setUser(data);
    };

    const logoutUser = () => {
        setUser(null);
        clearAuthData();
    };

    return (
        <UserContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};
