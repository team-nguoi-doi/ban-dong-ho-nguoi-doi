import axios from "axios";
import type { PersonalInfoForm } from "../utils/validation";
import type { Address } from "../utils/types";
import type { User } from "../../auth";

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001'
});

export const accountApi = {
    async updateProfile(userId: number | string, payload: PersonalInfoForm): Promise<User> {
        const { data } = await http.patch<User>(`/users/${userId}`, payload);
        return data;
    },

    async changePassword(userId: number | string, newPassword: string): Promise<void> {
        await http.patch(`/users/${userId}`, { password: newPassword });
    },

    async changeEmail(userId: number | string, newEmail: string): Promise<User> {
        const { data: existed } = await http.get<User[]>('/users', {
            params: { email: newEmail },
        });

        if (existed.length > 0) {
            throw new Error('Email này đã được sử dụng bởi tài khoản khác');
        }

        const { data } = await http.patch<User>(`/users/${userId}`, { email: newEmail });
        return data;
    },

    async updateAddresses(userId: number | string, addresses: Address[]): Promise<User> {
        const { data } = await http.patch<User>(`/users/${userId}`, { addresses });
        return data;
    },
};