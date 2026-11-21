import axios from 'axios';
import type { WishlistItem } from '../utils/types';

const http = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const wishlistApi = {
    async getWishlistByUserId(userId: string | number): Promise<WishlistItem[]> {
        const { data } = await http.get<(WishlistItem & { userId?: string | number })[]>('/wishlist');
        return data.filter((item) => String(item.userId) === String(userId));
    },

    async addToWishlist(item: Omit<WishlistItem, 'id'>): Promise<WishlistItem> {
        const { data } = await http.post<WishlistItem>('/wishlist', item);
        return data;
    },

    async removeFromWishlist(id: string): Promise<string> {
        await http.delete(`/wishlist/${id}`);
        return id;
    },
};