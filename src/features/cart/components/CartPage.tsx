import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks.ts';
import { clearCart, selectCartCount, selectCartItems, selectCartTotal } from '../CartSlice';
import { formatPrice } from '../utils/format';
import CartItemRow from './CartItemRow';

export default function CartPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const items = useAppSelector(selectCartItems);
    const count = useAppSelector(selectCartCount);
    const total = useAppSelector(selectCartTotal);
    const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
    const [notice, setNotice] = useState('');

    const handleCheckout = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        // TODO: bước thanh toán (tạo đơn vào /orders rồi clearCart) sẽ làm sau
        setNotice('Chức năng thanh toán sẽ được bổ sung ở bước tiếp theo.');
    };

    if (items.length === 0) {
        return (
            <div className="cart-page cart-page--empty">
                <h1 className="cart-page__title">Giỏ hàng</h1>
                <p className="cart-empty__text">Giỏ hàng của bạn đang trống.</p>
                <Link to="/" className="cart-btn cart-btn--primary">Tiếp tục mua sắm</Link>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h1 className="cart-page__title">Giỏ hàng <span className="cart-page__count">({count} sản phẩm)</span></h1>

            <div className="cart-page__layout">
                <ul className="cart-list">
                    {items.map((item) => (
                        <CartItemRow key={item.productId} item={item} />
                    ))}
                </ul>

                <aside className="cart-summary" aria-label="Tóm tắt đơn hàng">
                    <h2 className="cart-summary__title">Tóm tắt đơn hàng</h2>
                    <div className="cart-summary__row">
                        <span>Tạm tính</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                    <div className="cart-summary__row">
                        <span>Vận chuyển</span>
                        <span>Tính ở bước thanh toán</span>
                    </div>
                    <div className="cart-summary__row cart-summary__row--total">
                        <span>Tổng cộng</span>
                        <span>{formatPrice(total)}</span>
                    </div>

                    <button type="button" className="cart-btn cart-btn--primary cart-btn--block" onClick={handleCheckout}>
                        {isAuthenticated ? 'Thanh toán' : 'Đăng nhập để thanh toán'}
                    </button>
                    {notice && <p className="cart-summary__notice" role="status">{notice}</p>}

                    <Link to="/" className="cart-summary__link">Tiếp tục mua sắm</Link>
                    <button type="button" className="cart-summary__clear" onClick={() => dispatch(clearCart())}>
                        Xóa toàn bộ giỏ hàng
                    </button>
                </aside>
            </div>
        </div>
    );
}