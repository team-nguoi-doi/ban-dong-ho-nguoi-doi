import type { User, RegisterPayload } from "../index.ts";
import axios from "axios"; // axios là thư viện gửi request HTTP, tiện hơn fetch ở chỗ tự chuyển JSON và báo lỗi khi server trả mã lỗi.

const http = axios.create({baseURL: import.meta.env.VITE_API_URL});

type UserRecord = User & { password: string };

export const authApi = {
    async register(payload: RegisterPayload): Promise<void> {
        const { data: existed } = await http.get<UserRecord[]>('/users', {
            params: { email: payload.email },
        });
        if (existed.length > 0) throw new Error('Email đã được đăng ký');
        await http.post('/users', payload);
    }
}