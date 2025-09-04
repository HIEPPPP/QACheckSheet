export interface LoginPayload {
    userCode: string;
    fullName: string;
    roles: string[];
    createdAt: string;
    userID: number;
}

export interface LoginResponse {
    status: number;
    message: string;
    data: LoginPayload;
}

export interface ChangePwdRequest {
    userCode: string | null | undefined;
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
