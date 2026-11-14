import type {NewOrder, Order} from "../utils/types.ts";
import axios from "axios";

const http = axios.create({baseURL: import.meta.env.VITE_API_URL});

export const orderApi = {
    async create(payload: NewOrder): Promise<Order> {
        const { data } = await http.post<Order>('/orders', {
            ...payload,
            status: 'pending',
            createdAt: new Date().toISOString(),
        })
        return data
    },

    async getByUser(userId: string | number): Promise<Order[]> {
        const { data } = await http.get<Order[]>('/orders', { params: { userId } });
        return [...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt)); // copy một mảng mới trước khi lọc, tránh sửa trực tiếp data
    },

    async cancelOrder(orderId: string): Promise<Order> {
        const { data } = await http.patch<Order>(`/orders/${orderId}`, {
            status: 'Cancelled',
        });
        return data;
    },
}