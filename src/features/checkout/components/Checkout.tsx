
import AddressFields from "../../address/components/AddressFields.tsx";
import '../css/Checkout.css';

import {EMPTY_ADDRESS} from "../../address/utils/constants.ts";
import type {AddressValue} from "../../address/utils/types.ts";

import {useState} from "react";

function Checkout() {
    {/* chỗ này đang gán đỡ là empty address lúc đầu, Hân lấy
    useState<AddressValue>(user?.address ?? EMPTY_ADDRESS) để lấy địa chỉ mặc định từ tài khoản */}
    const [billingAddress, setBillingAddress] = useState<AddressValue>(EMPTY_ADDRESS);
    const [shippingAddress, setShippingAddress] = useState<AddressValue>(EMPTY_ADDRESS)

    return (
        <main className="checkout">
            <div className="checkout__inner">
                <h1 className="checkout__title">Thanh toán</h1>

                {/* Mã ưu đãi */}
                <div className="checkout__notices">
                    <p className="checkout__notice">
                        Bạn có mã ưu đãi?{' '}
                        <button type="button" className="checkout__notice-link">
                            Ấn vào đây để nhập mã
                        </button>
                    </p>

                    {/* Đang ẩn: xóa "hidden" để xem ô nhập mã */}
                    <form className="checkout__coupon" hidden>
                        <input type="text" name="coupon" className="checkout__input" placeholder="Mã ưu đãi" aria-label="Mã ưu đãi" />
                        <button type="submit" className="checkout__button checkout__button--outline">Áp dụng</button>
                    </form>
                </div>

                <form className="checkout__layout">
                    {/* Thông tin thanh toán */}
                    <section className="checkout__billing" aria-labelledby="billing-title">
                        <h2 className="checkout__heading" id="billing-title">Thông tin thanh toán</h2>

                        <div className="checkout__row">
                            <div className="checkout__field">
                                <label htmlFor="co-first-name" className="checkout__label">
                                    Tên <span className="checkout__required">*</span>
                                </label>
                                <input id="co-first-name" name="firstName" type="text" autoComplete="given-name" className="checkout__input" />
                            </div>
                            <div className="checkout__field">
                                <label htmlFor="co-last-name" className="checkout__label">
                                    Họ <span className="checkout__required">*</span>
                                </label>
                                <input id="co-last-name" name="lastName" type="text" autoComplete="family-name" className="checkout__input" />
                            </div>
                        </div>

                        {/* Địa chỉ chi tiết */}
                        <AddressFields idPrefix="co-billing" value={billingAddress} onChange={setBillingAddress} />

                        <div className="checkout__field">
                            <label htmlFor="co-phone" className="checkout__label">
                                Số điện thoại <span className="checkout__required">*</span>
                            </label>
                            <input id="co-phone" name="phone" type="tel" autoComplete="tel" className="checkout__input" />
                        </div>

                        <div className="checkout__field">
                            <label htmlFor="co-email" className="checkout__label">
                                Địa chỉ email <span className="checkout__required">*</span>
                            </label>
                            <input id="co-email" name="email" type="email" autoComplete="email" className="checkout__input" />
                        </div>

                        <label className="checkout__check">
                            <input type="checkbox" name="shipDifferent" />
                            <span>Giao đến một địa chỉ khác?</span>
                        </label>

                        {/* Đang ẩn: xóa "hidden" để xem khung địa chỉ giao hàng */}
                        <div className="checkout__ship" hidden>
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
                            <tr>
                                <td className="checkout__item-name">
                                    Đồng hồ nam Casio MTP-1374 <span className="checkout__item-qty">× 1</span>
                                </td>
                                <td className="checkout__cell--right">3.391.000 ₫</td>
                            </tr>
                            </tbody>
                            <tfoot>
                            <tr>
                                <th scope="row">Tạm tính</th>
                                <td className="checkout__cell--right">3.391.000 ₫</td>
                            </tr>
                            <tr>
                                <th scope="row">Vận chuyển</th>
                                <td className="checkout__cell--right">Đồng giá: 30.000 ₫</td>
                            </tr>
                            <tr className="checkout__total">
                                <th scope="row">Tổng</th>
                                <td className="checkout__cell--right">3.421.000 ₫</td>
                            </tr>
                            </tfoot>
                        </table>

                        <fieldset className="checkout__payment">
                            <legend className="checkout__legend">Phương thức thanh toán</legend>

                            <label className="checkout__payment-option checkout__payment-option--active">
                                <input type="radio" name="payment" value="bank" defaultChecked />
                                <span className="checkout__payment-label">Chuyển khoản online qua ngân hàng</span>
                                <span className="checkout__payment-desc">
                                    Thông tin tài khoản chuyển khoản sẽ hiển thị sau khi bạn bấm “Đặt hàng”. Chúng tôi sẽ liên hệ xác nhận đơn ngay sau đó.
                                </span>
                            </label>

                            <label className="checkout__payment-option">
                                <input type="radio" name="payment" value="cod" />
                                <span className="checkout__payment-label">Thanh toán khi nhận hàng (COD)</span>
                            </label>

                            <label className="checkout__payment-option">
                                <input type="radio" name="payment" value="pickup" />
                                <span className="checkout__payment-label">Nhận sản phẩm tại cửa hàng</span>
                            </label>
                        </fieldset>

                        <button type="submit" className="checkout__button checkout__button--primary">
                            Đặt hàng
                        </button>
                    </aside>
                </form>
            </div>
        </main>
    );
}

export default Checkout
