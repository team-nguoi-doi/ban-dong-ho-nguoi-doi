import {configureStore} from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.ts"
import cartReducer, { saveItems } from "../features/cart/CartSlice.ts";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
    },
});

// Lưu giỏ hàng vào localStorage mỗi khi nó thay đổi (reload không mất giỏ)
let prevItems = store.getState().cart.items;
store.subscribe(() => {
    const items = store.getState().cart.items;
    if (items !== prevItems) {
        prevItems = items;
        saveItems(items);
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;