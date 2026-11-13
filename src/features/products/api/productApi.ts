import type { Watch } from '../utils/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const BASE_URL = `${API_URL}/watches`;

export const productApi = {
    getAllWatches: async (): Promise<Watch[]> => {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
            throw new Error('Không thể tải danh sách đồng hồ');
        }
        return (await response.json()) as Watch[];
    },

    getWatchById: async (id: string): Promise<Watch> => {
        const response = await fetch(`${BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Không tìm thấy thông tin đồng hồ');
        }
        return (await response.json()) as Watch;
    },
};