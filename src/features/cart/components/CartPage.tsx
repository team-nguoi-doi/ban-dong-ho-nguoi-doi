import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks.ts';
import {
    removeSelected,
    selectCartItems,
    selectSelectedCount,
    selectSelectedIds,
    selectSelectedTotal,
    toggleSelectAll,
} from '../CartSlice';
import { formatPrice } from '../utils/format';
import CartItemRow from './CartItemRow';

export default function CartPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const items = useAppSelector(selectCartItems);
    const selectedIds = useAppSelector(selectSelectedIds);
    const selectedCount = useAppSelector(selectSelectedCount);
    const total = useAppSelector(selectSelectedTotal);
    const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
    const [notice, setNotice] = useState('');

    const allSelected = items.length > 0 && selectedIds.length === items.length;

    const handleCheckout = () => {
        if (selectedCount === 0) {
            setNotice('Vui lòng chọn ít nhất 1 sản phẩm để mua hàng.');
            return;
        }
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        // TODO: chuyển sang trang thanh toán (/checkout) với các sản phẩm đã chọn
        setNotice('Trang thanh toán sẽ được bổ sung ở bước tiếp theo.');
    };

    if (items.length === 0) {
        return (
            <div className="cart-page cart-page--empty">
                <h1 className="cart-page__title">Giỏ hàng</h1>
                <p className="cart-empty__text">Giỏ hàng của bạn đang trống.</p>
                <Link to="/" className="cart-btn cart-btn--primary">Mua sắm ngay</Link>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h1 className="cart-page__title">Giỏ hàng <span className="cart-page__count">({items.length} sản phẩm)</span></h1>

            <div className="cart-table">
                <div className="cart-head" role="row">
                    <label className="cart-check">
                        <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={(e) => dispatch(toggleSelectAll(e.target.checked))}
                            aria-label="Chọn tất cả"
                        />
                    </label>
                    <span className="cart-head__product">Sản phẩm</span>
                    <span>Đơn giá</span>
                    <span>Số lượng</span>
                    <span>Số tiền</span>
                    <span>Thao tác</span>
                </div>

                <ul className="cart-list">
                    {items.map((item) => (
                        <CartItemRow key={item.productId} item={item} />
                    ))}
                </ul>
            </div>

            {notice && <p className="cart-notice" role="status">{notice}</p>}

            <div className="cart-bar">
                <label className="cart-check cart-bar__all">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={(e) => dispatch(toggleSelectAll(e.target.checked))}
                    />
                    <span>Chọn tất cả ({items.length})</span>
                </label>

                <button
                    type="button"
                    className="cart-bar__delete"
                    onClick={() => dispatch(removeSelected())}
                    disabled={selectedCount === 0}
                >
                    Xóa
                </button>

                <div className="cart-bar__total">
                    <span className="cart-bar__total-label">Tổng thanh toán ({selectedCount} sản phẩm):</span>
                    <strong className="cart-bar__total-value">{formatPrice(total)}</strong>
                </div>

                <button type="button" className="cart-btn cart-btn--primary cart-bar__buy" onClick={handleCheckout}>
                    Mua hàng
                </button>
            </div>
        </div>
    );
}
