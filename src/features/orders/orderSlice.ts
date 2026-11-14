import {createAsyncThunk, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type { RootState } from "../../store/store.ts";
import type {NewOrder, Order, OrderStatus} from "./utils/types.ts";
import {logout} from "../auth/authSlice.ts";
import {orderApi} from "./api/orderApi.ts";

const getMessage = (e: unknown) =>
    e instanceof Error ? e.message : 'Có lỗi xảy ra, vui lòng thử lại'

interface OrderState {
    items: Order[];
    filterStatus: OrderStatus | 'All';
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    items: [],
    filterStatus: 'All',
    loading: false,
    error: null,
}

// action đặt hàng
export const placeOrder = createAsyncThunk<Order, NewOrder, { rejectValue: string }>(
    'orders/place',
    async (payload, { rejectWithValue }) => {
        try {
            return await orderApi.create(payload)
        } catch (e) {
            return rejectWithValue(getMessage(e))
        }
    }
);

//
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
            return await orderApi.getByUser(userId);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Không thể tải danh sách đơn hàng');
        }
    }
);

//
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
            .addCase(placeOrder.fulfilled, (state, action) => {
                state.items.unshift(action.payload); // đơn mới lên đầu danh sách
            })
            .addCase(logout.fulfilled, () => initialState) // đăng xuất thì xóa đơn hàng của người dùng cũ ra khỏi bộ nhớ
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Lỗi tải đơn hàng';
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                    const index = state.items.findIndex((o) => o.id === action.payload.id);
                    if (index !== -1) {
                        state.items[index] = action.payload;
                    }
                });
    }
})

export default orderSlice.reducer;