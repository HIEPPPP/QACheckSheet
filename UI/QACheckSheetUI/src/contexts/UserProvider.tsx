import React, { createContext, useState } from "react";

import { getAuthData, clearAuthData } from "../shared/services/auth.service";
import type { User } from "../shared/type/localstorage";

export const UserContext = createContext<{
    user: User | null;
    loginUser: (data: User) => void;
    logoutUser: () => void;
}>({
    user: null,
    loginUser: () => {},
    logoutUser: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(getAuthData());

    const loginUser = (data: User) => {
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
