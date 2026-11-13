import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Order, OrderStatus } from './utils/types';
import { orderApi } from './api/orderApi';
import type { RootState } from '../../store/store';

interface OrderState {
    orders: Order[];
    filterStatus: OrderStatus | 'All';
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    orders: [],
    filterStatus: 'All',
    loading: false,
    error: null,
};

export const fetchUserOrders = createAsyncThunk<
    Order[],
    void,
    { state: RootState; rejectValue: string }
>(
    'orders/fetchUserOrders',
    async (_, { getState, rejectWithValue }) => {
        try {
            const userId = getState().auth.user?.id;
            if (!userId) throw new Error('Phiên đăng nhập đã hết hạn');
            return await orderApi.getOrdersByUserId(userId);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Không thể tải danh sách đơn hàng');
        }
    }
);

export const cancelOrder = createAsyncThunk<
    Order,
    string,
    { rejectValue: string }
>(
    'orders/cancelOrder',
    async (orderId, { rejectWithValue }) => {
        try {
            return await orderApi.cancelOrder(orderId);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Hủy đơn hàng thất bại');
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setFilterStatus(state, action: PayloadAction<OrderStatus | 'All'>) {
            state.filterStatus = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Lỗi tải đơn hàng';
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                const index = state.orders.findIndex((o) => o.id === action.payload.id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            });
    },
});

export const { setFilterStatus } = orderSlice.actions;
export default orderSlice.reducer;