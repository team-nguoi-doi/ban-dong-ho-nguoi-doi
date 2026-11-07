import { useAppDispatch } from '../../../hooks/hooks.ts';
import { MAX_QUANTITY, removeFromCart, updateQuantity } from '../CartSlice';
import { formatPrice } from '../utils/format';
import type { CartItem } from '../utils/types';

export default function CartItemRow({ item }: { item: CartItem }) {
    const dispatch = useAppDispatch();
    const setQty = (quantity: number) =>
        dispatch(updateQuantity({ productId: item.productId, quantity }));

    return (
        <li className="cart-item">
            <div className="cart-item__image-box">
                <img src={item.image} alt={item.name} className="cart-item__image" />
            </div>

            <div className="cart-item__details">
                <div className="cart-item__top">
                    <div>
                        <h3 className="cart-item__name">{item.name}</h3>
                        {item.description && <p className="cart-item__desc">{item.description}</p>}
                    </div>
                    <span className="cart-item__line-total">{formatPrice(item.price * item.quantity)}</span>
                </div>

                <div className="cart-item__bottom">
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
                            onClick={() => setQty(item.quantity + 1)}
                            disabled={item.quantity >= MAX_QUANTITY}
                            aria-label="Tăng số lượng"
                        >+</button>
                    </div>

                    <span className="cart-item__unit">{formatPrice(item.price)} / chiếc</span>

                    <button
                        type="button"
                        className="cart-item__remove"
                        onClick={() => dispatch(removeFromCart(item.productId))}
                    >
                        Xóa
                    </button>
                </div>

                {item.quantity >= MAX_QUANTITY && (
                    <p className="cart-item__warning">Đã đạt số lượng tối đa ({MAX_QUANTITY}) cho mỗi sản phẩm.</p>
                )}
            </div>
        </li>
    );
}