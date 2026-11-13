import axios from 'axios';
import type { Order } from '../utils/types';

const http = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const orderApi = {
    async getOrdersByUserId(userId: string): Promise<Order[]> {
        const { data } = await http.get<Order[]>('/orders', {
            params: { userId },
        });

        return data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },

    async cancelOrder(orderId: string): Promise<Order> {
        const { data } = await http.patch<Order>(`/orders/${orderId}`, {
            status: 'Cancelled',
        });
        return data;
    },
};