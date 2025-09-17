import type { UserLocalStorage } from "../type/localstorage";

export const USERCODE_KEY = "userCode";
export const FULLNAME_KEY = "fullName";
export const ROLES_KEY = "roles";

export const saveAuthData = (auth: UserLocalStorage) => {
    const { userCode, fullName, roles } = auth;
    localStorage.setItem(USERCODE_KEY, userCode ?? "");
    localStorage.setItem(FULLNAME_KEY, fullName ?? "");
    localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
};

export const getAuthData = (): UserLocalStorage => {
    const userCode = localStorage.getItem(USERCODE_KEY);
    const fullName = localStorage.getItem(FULLNAME_KEY);
    const rolesRaw = localStorage.getItem(ROLES_KEY);
    const roles: string[] = rolesRaw ? JSON.parse(rolesRaw) : [];
    return { userCode, fullName, roles };
};

export const clearAuthData = () => {
    localStorage.removeItem(USERCODE_KEY);
    localStorage.removeItem(FULLNAME_KEY);
    localStorage.removeItem(ROLES_KEY);
};
