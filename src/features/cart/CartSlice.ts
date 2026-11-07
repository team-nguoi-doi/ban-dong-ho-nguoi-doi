import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AddToCartPayload, CartItem } from './utils/types';

export const CART_STORAGE_KEY = 'viren_cart';
export const MAX_QUANTITY = 10;

interface CartState {
    items: CartItem[];
}

const loadItems = (): CartItem[] => {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        if (!raw) return [];
        const parsed: unknown = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter(
            (i): i is CartItem =>
                i && typeof i.productId === 'string' &&
                typeof i.price === 'number' &&
                typeof i.quantity === 'number' && i.quantity > 0
        );
    } catch {
        return [];
    }
};

export const saveItems = (items: CartItem[]) => {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {

    }
};

const initialState: CartState = { items: loadItems() };

const clamp = (n: number) => Math.min(MAX_QUANTITY, Math.max(1, Math.floor(n)));

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action: PayloadAction<AddToCartPayload>) {
            const { quantity = 1, ...product } = action.payload;
            const existed = state.items.find((i) => i.productId === product.productId);
            if (existed) {
                existed.quantity = clamp(existed.quantity + quantity);
            } else {
                state.items.push({ ...product, quantity: clamp(quantity) });
            }
        },
        updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
            const item = state.items.find((i) => i.productId === action.payload.productId);
            if (item) item.quantity = clamp(action.payload.quantity);
        },
        removeFromCart(state, action: PayloadAction<string>) {
            state.items = state.items.filter((i) => i.productId !== action.payload);
        },
        clearCart(state) {
            state.items = [];
        },
    },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

type WithCart = { cart: CartState };
export const selectCartItems = (state: WithCart) => state.cart.items;
export const selectCartCount = (state: WithCart) =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartTotal = (state: WithCart) =>
    state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
