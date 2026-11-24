import type {NewOrder, Order, OrderStatus} from "../utils/types.ts";
import axios from "axios";

const http = axios.create({baseURL: import.meta.env.VITE_API_URL});

export const orderApi = {
    async create(payload: NewOrder): Promise<Order> {
        const { data } = await http.post<Order>('/orders', {
            ...payload,
            status: 'Pending',
            createdAt: new Date().toISOString(),
        })
        return data;
    },

    async getByUser(userId: string | number): Promise<Order[]> {
        const { data } = await http.get<Order[]>('/orders', { params: { userId } });
        return [...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt)); // copy một mảng mới trước khi lọc, tránh sửa trực tiếp data
    },

    async updateStatus(id: string | number, status: OrderStatus): Promise<Order> {
        const { data } = await http.patch<Order>(`/orders/${id}`, {status});
        return data;
    },

    async cancelOrder(orderId: string | number): Promise<Order> {
        const { data } = await http.patch<Order>(`/orders/${orderId}`, {
            status: 'Cancelled',
        });
        return data;
    },
}