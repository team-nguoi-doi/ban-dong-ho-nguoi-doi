import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { WishlistItem } from './utils/types';
import { wishlistApi } from './api/wishlistApi';
import type { RootState } from '../../store/store';

interface WishlistState {
    items: WishlistItem[];
    loading: boolean;
    error: string | null;
}

const initialState: WishlistState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchUserWishlist = createAsyncThunk<
    WishlistItem[],
    void,
    { state: RootState; rejectValue: string }
>(
    'wishlist/fetchUserWishlist',
    async (_, { getState, rejectWithValue }) => {
        try {
            const userId = getState().auth.user?.id;
            if (!userId) return [];
            return await wishlistApi.getWishlistByUserId(userId);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Không thể tải danh sách yêu thích');
        }
    }
);

export const addToWishlist = createAsyncThunk<
    WishlistItem,
    { watchId: number | string; productName: string; price: number; image: string },
    { state: RootState; rejectValue: string }
>(
    'wishlist/addToWishlist',
    async (product, { getState, rejectWithValue }) => {
        try {
            const userId = getState().auth.user?.id;
            if (!userId) throw new Error('Vui lòng đăng nhập để lưu sản phẩm yêu thích');

            const newItem = {
                userId,
                watchId: product.watchId,
                productId: String(product.watchId),
                productName: product.productName,
                price: product.price,
                image: product.image,
                inStock: true,
            };

            return await wishlistApi.addToWishlist(newItem);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Thêm sản phẩm yêu thích thất bại');
        }
    }
);

export const removeFromWishlist = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>(
    'wishlist/removeFromWishlist',
    async (id, { rejectWithValue }) => {
        try {
            return await wishlistApi.removeFromWishlist(id);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Xóa khỏi danh sách yêu thích thất bại');
        }
    }
);

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserWishlist.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            });
    },
});

export default wishlistSlice.reducer;