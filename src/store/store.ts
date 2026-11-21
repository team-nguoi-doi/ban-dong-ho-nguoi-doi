import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.ts";
import accountReducer from "../features/account/accountSlice.ts";
import orderReducer from "../features/orders/orderSlice.ts";
import wishlistReducer from "../features/account/wishlistSlice.ts";
import cartReducer, { saveItems } from "../features/cart/CartSlice.ts";
import { productReducer } from '../features/products';
import toastReducer from '../features/toast/toastSlice.ts';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        account: accountReducer,
        orders: orderReducer,
        wishlist: wishlistReducer,
        cart: cartReducer,
        products: productReducer,
        toast: toastReducer,
    },
});

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
export type AppDispatch = typeof store.dispatch;