import { useEffect, useState, useCallback } from "react";
import type { User } from "../types/users";
import {
    createUser,
    deleteUser,
    getListUser,
    updateUser,
} from "../services/users.service";

type UserResult = {
    users: User[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    create: (payload: User) => Promise<User | null>;
    update: (id: number, payload: User) => Promise<User | null>;
    remove: (id: number) => Promise<boolean>;
};

export const useUser = (): UserResult => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchList = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getListUser();
            if (res) setUsers(res);
        } catch (err: any) {
            setError(err?.message || "Lỗi khi lấy danh sách");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchList();
    }, [fetchList]);

    const create = async (payload: User) => {
        setLoading(true);
        try {
            const res = await createUser(payload);
            setUsers((prev) => [res, ...prev]);
            return res;
        } catch (err) {
            return null;
        } finally {
            setLoading(false);
        }
    };

    const update = async (id: number, payload: User) => {
        setLoading(true);
        try {
            const res = await updateUser(id, payload);
            setUsers((prev) =>
                prev.map((p) => (p.userId === id ? { ...p, ...res } : p))
            );
            return res;
        } catch {
            return null;
        } finally {
            setLoading(false);
        }
    };

    const remove = async (id: number) => {
        setLoading(true);
        try {
            const res = await deleteUser(id);
            if (res) setUsers((prev) => prev.filter((p) => p.userId !== id));
            return !!res;
        } catch {
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        users,
        loading,
        error,
        refresh: fetchList,
        create,
        update,
        remove,
    };
};

export default useUser;
