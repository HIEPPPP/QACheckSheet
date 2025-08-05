export interface LoginResponse {
    userID: number;
    userCode: string;
    fullName: string;
    createdAt: Date;
    roles: string[];
}

export interface ChangePwdRequest {
    userId: number;
    oldPassword: string;
    newPassword: string;
}

// hook
export interface UseAuthResult {
    userCode: string;
    password: string;
    error: string;
    loading: boolean;
    setUserCode: (v: string) => void;
    setPassword: (v: string) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}
