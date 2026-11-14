import {Link} from "react-router-dom";
import {PLACEHOLDER_IMAGE} from "../mockData.ts";
import '../css/ProductDetail.css';

function ProductDetail() {
    return (
        <main className="product-detail">
            <div className="product-detail__inner">
                {/* Đường dẫn */}
                <nav className="product-detail__breadcrumb" aria-label="Đường dẫn">
                    <ol className="product-detail__crumbs">
                        <li className="product-detail__crumb">
                            <Link to="/" className="product-detail__crumb-link">
                                Trang chủ
                            </Link>
                        </li>
                        <li className="product-detail__crumb">
                            <Link to="/products" className="product-detail__crumb-link">
                                Đồng hồ nam
                            </Link>
                        </li>
                        <li className="product-detail__crumb product-detail__crumb--current" aria-current="page">
                            HYDROCONQUEST
                        </li>
                    </ol>
                </nav>

                <div className="product-detail__layout">
                    {/* Cột trái: thư viện ảnh */}
                    <section className="product-detail__gallery" aria-label="Hình ảnh sản phẩm">
                        <ul className="product-detail__thumbs">
                            <li>
                                <button type="button" className="product-detail__thumb
                                product-detail__thumb--active"
                                        aria-label="Xem ảnh 1"
                                        aria-current="true">
                                    <img src={PLACEHOLDER_IMAGE} alt="" />
                                </button>
                            </li>
                            <li>
                                <button type="button" className="product-detail__thumb"
                                        aria-label="Xem ảnh 2">
                                    <img src={PLACEHOLDER_IMAGE} alt="" />
                                </button>
                            </li>
                            <li>
                                <button type="button" className="product-detail__thumb"
                                        aria-label="Xem ảnh 3">
                                    <img src={PLACEHOLDER_IMAGE} alt="" />
                                </button>
                            </li>
                            <li>
                                <button type="button" className="product-detail__thumb"
                                        aria-label="Xem ảnh 4">
                                    <img src={PLACEHOLDER_IMAGE} alt="" />
                                </button>
                            </li>
                        </ul>

                        <div className="product-detail__main">
                            <span className="product-detail__badge">Mới</span>
                            <img className="product-detail__main-image" src={PLACEHOLDER_IMAGE} alt="HYDROCONQUEST" />
                        </div>
                    </section>

                    {/* Cột phải: thông tin và mua hàng */}
                    <section className="product-detail__info" aria-labelledby="pd-name">
                        <p className="product-detail__category">Đồng hồ nam</p>
                        <h1 className="product-detail__name" id="pd-name">HYDROCONQUEST</h1>
                        <p className="product-detail__desc">
                            42 mm - Automatic watch - Stainless steel and ceramic bezel
                        </p>

                        <p className="product-detail__price">1.950 VND</p>
                        <p className="product-detail__vat">Đã bao gồm thuế VAT</p>

                        <div className="product-detail__option">
                            <span className="product-detail__option-label">
                                Màu mặt số: <strong>Đen</strong>
                            </span>
                            <div className="product-detail__swatches">
                                <button type="button"
                                        className="product-detail__swatch product-detail__swatch--black
                                        product-detail__swatch--active"
                                        aria-label="Đen" aria-pressed={true} />
                                <button type="button"
                                        className="product-detail__swatch product-detail__swatch--silver"
                                        aria-label="Bạc" aria-pressed={false} />
                                <button type="button"
                                        className="product-detail__swatch product-detail__swatch--blue"
                                        aria-label="Xanh" aria-pressed={false} />
                            </div>
                        </div>

                        <div className="product-detail__option">
                            <label className="product-detail__option-label"
                                   htmlFor="pd-qty">
                                Số lượng
                            </label>
                            <div className="product-detail__qty">
                                <button type="button"
                                        className="product-detail__qty-btn"
                                        aria-label="Giảm số lượng">−</button>
                                <input id="pd-qty"
                                       className="product-detail__qty-input"
                                       type="number" min={1} defaultValue={1} />
                                <button type="button"
                                        className="product-detail__qty-btn"
                                        aria-label="Tăng số lượng">+</button>
                            </div>
                        </div>

                        <div className="product-detail__actions">
                            <button type="button" className="product-detail__btn product-detail__btn--primary">
                                Thêm vào giỏ hàng
                            </button>
                            <button type="button" className="product-detail__wishlist" aria-label="Thêm vào yêu thích">
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
                                </svg>
                            </button>
                            <button type="button" className="product-detail__btn product-detail__btn--outline">
                                Mua ngay
                            </button>
                        </div>

                        <ul className="product-detail__perks">
                            <li className="product-detail__perk">
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M3 7h11v9H3z" />
                                    <path d="M14 10h4l3 3v3h-7z" />
                                    <circle cx="7" cy="18" r="1.8" />
                                    <circle cx="17" cy="18" r="1.8" />
                                </svg>
                                <span>Miễn phí vận chuyển toàn quốc</span>
                            </li>
                            <li className="product-detail__perk">
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6z" />
                                    <path d="M9 12l2 2 4-4" />
                                </svg>
                                <span>Bảo hành chính hãng</span>
                            </li>
                            <li className="product-detail__perk">
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M20 11a8 8 0 1 0-2.3 5.7" />
                                    <path d="M20 5v6h-6" />
                                </svg>
                                <span>Đổi trả trong 7 ngày</span>
                            </li>
                        </ul>
                    </section>
                </div>

                {/* Mô tả, thông số, bảo hành (bấm tiêu đề để mở/đóng, không cần JavaScript) */}
                <div className="product-detail__sections">
                    <details className="product-detail__section" open>
                        <summary className="product-detail__section-title">Mô tả sản phẩm</summary>
                        <div className="product-detail__section-body">
                            <p>
                                Mẫu đồng hồ cơ tự động với mặt số 42 mm, vỏ thép không gỉ và viền gốm. Thiết kế thể thao
                                gọn gàng, phù hợp cả đi làm lẫn hoạt động ngoài trời.
                            </p>
                        </div>
                    </details>

                    <details className="product-detail__section" open>
                        <summary className="product-detail__section-title">Thông số kỹ thuật</summary>
                        <div className="product-detail__section-body">
                            {/* Các dòng sau chỉ là dữ liệu mẫu */}
                            <table className="product-detail__specs">
                                <tbody>
                                <tr>
                                    <th scope="row">Đường kính mặt</th>
                                    <td>42 mm</td>
                                </tr>
                                <tr>
                                    <th scope="row">Loại máy</th>
                                    <td>Automatic (tự động lên cót)</td>
                                </tr>
                                <tr>
                                    <th scope="row">Chất liệu vỏ</th>
                                    <td>Thép không gỉ</td>
                                </tr>
                                <tr>
                                    <th scope="row">Chất liệu viền</th>
                                    <td>Gốm</td>
                                </tr>
                                <tr>
                                    <th scope="row">Mặt kính</th>
                                    <td>Sapphire</td>
                                </tr>
                                <tr>
                                    <th scope="row">Chống nước</th>
                                    <td>100 m</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </details>

                    <details className="product-detail__section">
                        <summary className="product-detail__section-title">Bảo hành và đổi trả</summary>
                        <div className="product-detail__section-body">
                            <ul className="product-detail__list">
                                <li>
                                    Bảo hành chính hãng theo chính sách của nhà sản xuất.
                                </li>
                                <li>
                                    Đổi trả trong 7 ngày nếu sản phẩm lỗi do nhà sản xuất.
                                </li>
                                <li>
                                    Hỗ trợ lau dầu, vệ sinh máy miễn phí tại cửa hàng.
                                </li>
                            </ul>
                        </div>
                    </details>
                </div>
            </div>
        </main>
    )
}

export default ProductDetail