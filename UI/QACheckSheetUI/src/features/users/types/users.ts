export interface User {
    userId: number | null;
    userCode?: string;
    password?: string;
    fullName?: string;
    createdAt?: Date | string | null;
    roles?: string[];
    roleIds: number[];
}

export interface Role {
    roleId: number | null;
    roleName?: string | null;
    description?: string | null;
}
