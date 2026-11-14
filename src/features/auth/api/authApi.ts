import type {User, RegisterPayload, LoginPayload} from "../index.ts";
import axios from "axios"; // axios là thư viện gửi request HTTP, tiện hơn fetch ở chỗ tự chuyển JSON và báo lỗi khi server trả mã lỗi.
import type { Address } from "../../account/utils/types.ts";

const http = axios.create({baseURL: import.meta.env.VITE_API_URL});

type UserRecord = User & { password: string };

function toUser(record: UserRecord): User {
    const { password, ...userWithoutPassword } = record;
    return {
        ...userWithoutPassword,
        addresses: userWithoutPassword.addresses || [],
    };
}

export const authApi = {
    async register(payload: RegisterPayload): Promise<void> {
        const { data: existed } = await http.get<UserRecord[]>('/users', {
            params: { email: payload.email },
        });
        if (existed.length > 0) throw new Error('Email đã được đăng ký');
        await http.post('/users', payload);
    },

    async login(payload: LoginPayload): Promise<User> {
        const { data } = await http.get<UserRecord[]>('/users', {
            params: { email: payload.email },
        });

        const record = data.find((u) => u.password === payload.password);
        if (!record) throw new Error('Email hoặc mật khẩu không đúng');
        return toUser(record);
    },

    async getProfile(id: string) : Promise<User> {
        const { data } = await http.get<UserRecord>(`/users/${id}`);
        return toUser(data);
    },

    async updateAddresses(userId: string, addresses: Address[]): Promise<Address[]> {
        const { data } = await http.patch(`/users/${userId}`, { addresses });
        return data.addresses;
    },

    // updateProfile
    async updateProfile(id: string, changes: Partial<Omit<User, 'id'>>): Promise<User> {
        const { data } = await http.patch<UserRecord>(`/users/${id}`, changes); // PATCH của json-server chỉ ghi đè các field phone, billingAddress
        return toUser(data);   // bỏ password trước khi trả về
    },
}