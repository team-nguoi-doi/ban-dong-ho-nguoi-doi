import { useAppDispatch, useAppSelector } from '../../../hooks/hooks.ts';
import {
    MAX_QUANTITY,
    removeFromCart,
    selectSelectedIds,
    toggleSelect,
    updateQuantity,
} from '../CartSlice';
import { formatPrice } from '../utils/format';
import type { CartItem } from '../utils/types';
import {addToast} from "../../toast/toastSlice.ts";

export default function CartItemRow({ item }: { item: CartItem }) {
    const dispatch = useAppDispatch();
    const checked = useAppSelector(selectSelectedIds).includes(item.productId);
    const setQty = (quantity: number) =>
        dispatch(updateQuantity({ productId: item.productId, quantity }));

    const increase = () => {
        if(item.quantity >= MAX_QUANTITY) {
            dispatch(addToast(`Mỗi sản phẩm chỉ mua tối đa ${MAX_QUANTITY} cái.`));
        }
        setQty(item.quantity + 1);
    }

    return (
        <li className={`cart-row ${checked ? 'cart-row--checked' : ''}`}>
            <label className="cart-check cart-row__check">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => dispatch(toggleSelect(item.productId))}
                    aria-label={`Chọn ${item.name}`}
                />
            </label>

            <div className="cart-row__product">
                <div className="cart-row__image-box">
                    <img src={item.image} alt={item.name} className="cart-row__image" />
                </div>
                <div className="cart-row__info">
                    <h3 className="cart-row__name">{item.name}</h3>
                    {item.description && <p className="cart-row__desc">{item.description}</p>}
                </div>
            </div>

            <div className="cart-row__price" data-label="Đơn giá">{formatPrice(item.price)}</div>

            <div className="cart-row__qty">
                <div className="cart-qty" role="group" aria-label={`Số lượng ${item.name}`}>
                    <button
                        type="button"
                        className="cart-qty__btn"
                        onClick={() => setQty(item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Giảm số lượng"
                    >−</button>
                    <span className="cart-qty__value" aria-live="polite">{item.quantity}</span>
                    <button
                        type="button"
                        className="cart-qty__btn"
                        onClick={increase}
                        aria-label="Tăng số lượng"
                    >+</button>
                </div>
            </div>

            <div className="cart-row__total" data-label="Số tiền">{formatPrice(item.price * item.quantity)}</div>

            <div className="cart-row__action">
                <button
                    type="button"
                    className="cart-row__remove"
                    onClick={() => dispatch(removeFromCart(item.productId))}
                >
                    Xóa
                </button>
            </div>
        </li>
    );
}
