
import AddressFields from "../../address/components/AddressFields.tsx";
import '../css/Checkout.css';

import {EMPTY_ADDRESS} from "../../address/utils/constants.ts";
import type {AddressValue} from "../../address/utils/types.ts";

import {type FormEvent, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../hooks/hooks.ts";
import {PAYMENT_OPTIONS, SHIPPING_FEE} from "../utils/constants.ts";
import type {PaymentMethod} from "../utils/types.ts";
import {formatVND, isBlank, splitFullName} from "../../auth/utils/utils.ts";
import {useNavigate} from "react-router-dom";
import type {NewOrder, OrderLine} from "../../orders/utils/types.ts";
import {placeOrder} from "../../orders/orderSlice.ts";
import {updateProfile} from "../../auth/authSlice.ts";

function Checkout() {
    {/* chỗ này đang gán đỡ là empty address lúc đầu, Hân lấy
    useState<AddressValue>(user?.address ?? EMPTY_ADDRESS) để lấy địa chỉ mặc định từ tài khoản */}

    const { user } = useAppSelector((state) => state.auth);

    const [billingAddress, setBillingAddress] = useState<AddressValue>(EMPTY_ADDRESS);
    const [shippingAddress, setShippingAddress] = useState<AddressValue>(EMPTY_ADDRESS);

    const cartItems = useAppSelector((state) => state.cart.items);
    const items: OrderLine[] = cartItems.map((item) => ({
        productId: item.productId,
        productName: item.name,
        productImage: item.image,
        productPrice: item.price,
        quantity: item.quantity,
    }));

    const [shipDifferent, setShipDifferent] = useState(false);
    const [showCoupon, setShowCoupon] = useState(false);
    const [payment, setPayment] = useState<PaymentMethod>('bank');

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { lastName, firstName } = splitFullName(user?.fullName ?? '');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);


    const subtotal = items.reduce((sum, item) =>
        sum + item.productPrice * item.quantity, 0);
    const shipping = payment === 'pickup' ? 0 : SHIPPING_FEE;
    const total = subtotal + shipping;

    const handleCoupon = (e: FormEvent) => {
        e.preventDefault();
        // todo: kiểm tra mã ưu đãi
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();
        if (!user || submitting) return;
        if(items.length === 0) {
            setError('Giỏ hàng đang trống');
            return;
        }

        const formData = new FormData(e.currentTarget);
        const text = (name: string) => String(formData.get(name) ?? '').trim();
        const customerName = `${text('lastName')} ${text('firstName')}`.trim();
        const customerPhone = text('phone');

        const missing =
            isBlank(customerName) ||
            isBlank(customerPhone) ||
            isBlank(text('email')) ||
            isBlank(billingAddress.detail) ||
            (shipDifferent && (
                isBlank(text('shipName')) ||
                isBlank(text('shipPhone')) ||
                isBlank(shippingAddress.detail)
            ));

        if(missing) {
            setError('Vui lòng nhập đầy đủ các trường bắt buộc');
            return;
        }

        const order: NewOrder = {
            userId: user?.id,
            items: items,
            subtotal,
            shippingFee: shipping,
            total,
            payment,
            recipient: shipDifferent
            ? {name: text('shipName'), phone: text('shipPhone'), address: shippingAddress}
                : {name: customerName, phone: customerPhone, address: billingAddress},
            note: text('note'),
        }

        setSubmitting(true);
        setError('');
        try {
            await dispatch(placeOrder(order)).unwrap();

            if(formData.get('saveDefault') === 'on') {
                await dispatch(updateProfile({id: user.id, changes: {phone: customerPhone, billingAddress}
                })).unwrap();
            }

            navigate('/account/orders');
        } catch (message) {
            setError(typeof message === 'string' ? message : 'Không đặt được hàng, vui lòng thử lại');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="checkout">
            <div className="checkout__inner">
                <h1 className="checkout__title">Thanh toán</h1>

                {/* Mã ưu đãi */}
                <div className="checkout__notices">
                    <p className="checkout__notice">
                        Bạn có mã ưu đãi?{' '}
                        <button type="button"
                                aria-expanded={showCoupon}
                                onClick={() => setShowCoupon((open) => !open)}
                                className="checkout__notice-link">
                            Ấn vào đây để nhập mã
                        </button>
                    </p>

                    {showCoupon && (
                        <form className="checkout__coupon" onSubmit={handleCoupon}>
                            <input type="text"
                                   name="coupon"
                                   className="checkout__input"
                                   placeholder="Mã ưu đãi"
                                   aria-label="Mã ưu đãi" />
                            <button type="submit"
                                    className="checkout__button checkout__button--outline">Áp dụng</button>
                        </form>
                    )}
                </div>

                <form className="checkout__layout" onSubmit={handleSubmit}>
                    {/* Thông tin thanh toán */}
                    <section className="checkout__billing" aria-labelledby="billing-title">
                        <h2 className="checkout__heading" id="billing-title">Thông tin thanh toán</h2>

                        <div className="checkout__row">
                            <div className="checkout__field">
                                <label htmlFor="co-first-name" className="checkout__label">
                                    Tên <span className="checkout__required">*</span>
                                </label>
                                <input id="co-first-name"
                                       name="firstName"
                                       type="text"
                                       autoComplete="given-name"
                                       defaultValue={firstName}
                                       className="checkout__input" />
                            </div>
                            <div className="checkout__field">
                                <label htmlFor="co-last-name" className="checkout__label">
                                    Họ <span className="checkout__required">*</span>
                                </label>
                                <input id="co-last-name"
                                       name="lastName"
                                       type="text"
                                       autoComplete="family-name"
                                       defaultValue={lastName}
                                       className="checkout__input" />
                            </div>
                        </div>

                        {/* Địa chỉ chi tiết */}
                        <AddressFields idPrefix="co-billing" value={billingAddress} onChange={setBillingAddress} />

                        <div className="checkout__field">
                            <label htmlFor="co-phone" className="checkout__label">
                                Số điện thoại <span className="checkout__required">*</span>
                            </label>
                            <input id="co-phone"
                                   name="phone"
                                   type="tel"
                                   autoComplete="tel"
                                   defaultValue={user?.phone ?? ''}
                                   pattern="(0|\+84)[0-9]{9}"
                                   className="checkout__input" />
                        </div>

                        <div className="checkout__field">
                            <label htmlFor="co-email" className="checkout__label">
                                Địa chỉ email <span className="checkout__required">*</span>
                            </label>
                            <input id="co-email"
                                   name="email"
                                   type="email"
                                   autoComplete="email"
                                   defaultValue={user?.email ?? ''}
                                   className="checkout__input" />
                        </div>

                        <label className="checkout__check">
                            <input type="checkbox"
                                   checked={shipDifferent}
                                   onChange={(e) => setShipDifferent(e.target.checked)}
                                   name="shipDifferent" />
                            <span>Giao đến một địa chỉ khác?</span>
                        </label>

                        {shipDifferent && (
                            <div className="checkout__ship">
                                <div className="checkout__field">
                                    <label htmlFor="co-ship-name" className="checkout__label">
                                        Người nhận <span className="checkout__required">*</span>
                                    </label>
                                    <input id="co-ship-name" name="shipName" type="text" className="checkout__input" />
                                </div>
                                <div className="checkout__field">
                                    <label htmlFor="co-ship-phone" className="checkout__label">
                                        Số điện thoại người nhận <span className="checkout__required">*</span>
                                    </label>
                                    <input id="co-ship-phone" name="shipPhone" type="tel" className="checkout__input" />
                                </div>

                                <AddressFields idPrefix="co-shipping" value={shippingAddress} onChange={setShippingAddress} />
                            </div>
                        )}

                        <div className="checkout__field">
                            <label htmlFor="co-note" className="checkout__label">Ghi chú đơn hàng (tùy chọn)</label>
                            <textarea
                                id="co-note"
                                name="note"
                                rows={4}
                                placeholder="Ví dụ: giao giờ hành chính, gọi trước khi giao..."
                                className="checkout__input checkout__input--area"
                            />
                        </div>
                    </section>

                    {/* Đơn hàng */}
                    <aside className="checkout__summary" aria-labelledby="summary-title">
                        <h2 className="checkout__heading" id="summary-title">Đơn hàng của bạn</h2>

                        <table className="checkout__table">
                            <thead>
                            <tr>
                                <th scope="col">Sản phẩm</th>
                                <th scope="col" className="checkout__cell--right">Tạm tính</th>
                            </tr>
                            </thead>
                            <tbody>
                            {items.map((item) => (
                                <tr key={item.productId}>
                                    <td className="checkout__item-name">
                                        {item.productName} <span className="checkout__item-qty">× {item.quantity}</span>
                                    </td>
                                    <td className="checkout__cell--right">{formatVND(item.productPrice * item.quantity)}</td>
                                </tr>
                            ))}
                            </tbody>
                            <tfoot>
                            <tr>
                                <th scope="row">Tạm tính</th>
                                <td className="checkout__cell--right">{formatVND(subtotal)}</td>
                            </tr>
                            <tr>
                                <th scope="row">Vận chuyển</th>
                                <td className="checkout__cell--right">
                                    {shipping === 0 ? 'Miễn phí' : `Đồng giá: ${formatVND(shipping)}`}
                                </td>
                            </tr>
                            <tr className="checkout__total">
                                <th scope="row">Tổng</th>
                                <td className="checkout__cell--right">{formatVND(total)}</td>
                            </tr>
                            </tfoot>
                        </table>

                        <fieldset className="checkout__payment">
                            <legend className="checkout__legend">Phương thức thanh toán</legend>
                            {PAYMENT_OPTIONS.map((option) => (
                                <label
                                    key={option.value}
                                    className={`checkout__payment-option ${payment === option.value ? 'checkout__payment-option--active' : ''}`}>
                                    <input type="radio"
                                           name="payment"
                                           checked={payment === option.value}
                                           onChange={() => setPayment(option.value)}
                                           value={option.value} />
                                    <span className="checkout__payment-label">{option.label}</span>
                                    {payment === option.value && (
                                        <span className="checkout__payment-desc">{option.desc}</span>
                                    )}
                                </label>
                            ))}
                        </fieldset>

                        {error && <p className="checkout__error" role="alert">{error}</p>}

                        <button type="submit"
                                className="checkout__button checkout__button--primary"
                                disabled={submitting}>
                            {submitting ? 'Đang đặt hàng...' : 'Đặt hàng'}
                        </button>
                    </aside>
                </form>
            </div>
        </main>
    );
}

export default Checkout
