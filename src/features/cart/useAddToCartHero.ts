
import type {CartItem} from "./utils/types.ts";
import {addToCart, MAX_QUANTITY, selectCartItems} from "./CartSlice.ts";
import {addToast} from "../toast/toastSlice.ts";
import {useAppDispatch, useAppSelector} from "../../hooks/hooks.ts";
import {useCallback} from "react";

export function useAddToCartHero() {
    const dispatch = useAppDispatch();
    const items = useAppSelector(selectCartItems);

    return useCallback((product: Omit<CartItem, 'quantity'>, quantity = 1) => {
        const current = items.find((i) => i.productId === product.productId)?.quantity ?? 0;
        const room = MAX_QUANTITY - current;

        if(room <= 0) {
            dispatch(addToast(`Mỗi sản phẩm chỉ mua tối đa ${MAX_QUANTITY} cái.`));
            return;
        }

        if(quantity > room) {
            dispatch(addToCart({...product, quantity: room}));
            dispatch(addToast(`Chỉ thêm được ${room} sản phẩm nữa (tối đa ${MAX_QUANTITY}).`));
            return;
        }

        dispatch(addToCart({...product, quantity}));
    }, [dispatch, items]);
}