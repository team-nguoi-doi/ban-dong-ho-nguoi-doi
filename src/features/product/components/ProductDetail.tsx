import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Product } from "../util/types";
import { PLACEHOLDER_IMAGE } from "../mockData.ts";
import { formatPrice, useAddToCart } from "../../cart";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { addToWishlist, removeFromWishlist } from "../../account/wishlistSlice";
import '../css/ProductDetail.css';

function getSwatchClass(color: string): string {
    const normalized = color.toLowerCase();
    if (normalized.includes("bạc") || normalized.includes("silver") || normalized.includes("trắng") || normalized.includes("white")) {
        return "product-detail__swatch--silver";
    }
    if (normalized.includes("xanh") || normalized.includes("blue")) {
        return "product-detail__swatch--blue";
    }
    return "product-detail__swatch--black";
}

function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const addItem = useAddToCart();

    const user = useAppSelector((state) => state.auth.user);
    const wishlistItems = useAppSelector((state) => state.wishlist?.items || []);

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImgIndex, setActiveImgIndex] = useState(0);
    const [quantity, setQuantity] = useState<number>(1);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetch(`http://localhost:3001/watches/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Không tìm thấy sản phẩm");
                return res.json();
            })
            .then((data: Product) => {
                setProduct(data);
                setActiveImgIndex(0);
                setQuantity(1);
            })
            .catch(() => setProduct(null))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <main className="product-detail">
                <div className="product-detail__inner" style={{ padding: "5rem 0", textAlign: "center" }}>
                    Đang tải thông tin sản phẩm...
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="product-detail">
                <div className="product-detail__inner" style={{ padding: "5rem 0", textAlign: "center" }}>
                    <p>Không tìm thấy sản phẩm.</p>
                    <Link to="/products" className="product-detail__crumb-link">Quay lại danh sách đồng hồ</Link>
                </div>
            </main>
        );
    }

    const images = product.images && product.images.length > 0
        ? product.images
        : [product.image || PLACEHOLDER_IMAGE];
    const currentImage = images[activeImgIndex] || images[0];
    const genderLabel = product.gender === "HER" ? "Đồng hồ nữ" : "Đồng hồ nam";
    const description = [product.caseSize, product.movement, product.caseMaterial]
        .filter(Boolean)
        .join(" - ") || product.meta || "";

    const existingWishlist = wishlistItems.find(
        (item) => String(item.watchId || item.productId) === String(product.id)
    );
    const isFavorite = Boolean(existingWishlist);

    const handleToggleWishlist = () => {
        if (!user) {
            alert("Vui lòng đăng nhập để thêm vào yêu thích!");
            return;
        }
        if (existingWishlist) {
            dispatch(removeFromWishlist(existingWishlist.id));
        } else {
            dispatch(
                addToWishlist({
                    watchId: String(product.id),
                    productName: product.name,
                    price: product.price,
                    image: images[0],
                })
            );
        }
    };

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addItem({
                productId: String(product.id),
                name: product.name,
                description,
                image: images[0],
                price: product.price,
            });
        }
    };

    const handleBuyNow = () => {
        handleAddToCart();
        navigate("/checkout");
    };

    return (
        <main className="product-detail">
            <div className="product-detail__inner">
                <nav className="product-detail__breadcrumb" aria-label="Đường dẫn">
                    <ol className="product-detail__crumbs">
                        <li className="product-detail__crumb">
                            <Link to="/" className="product-detail__crumb-link">
                                Trang chủ
                            </Link>
                        </li>
                        <li className="product-detail__crumb">
                            <Link
                                to={product.gender ? `/products?gender=${product.gender}` : "/products"}
                                className="product-detail__crumb-link"
                            >
                                {genderLabel}
                            </Link>
                        </li>
                        <li className="product-detail__crumb product-detail__crumb--current" aria-current="page">
                            {product.name}
                        </li>
                    </ol>
                </nav>

                <div className="product-detail__layout">
                    <section className="product-detail__gallery" aria-label="Hình ảnh sản phẩm">
                        <ul className="product-detail__thumbs">
                            {images.map((imgSrc, index) => (
                                <li key={index}>
                                    <button
                                        type="button"
                                        className={`product-detail__thumb ${
                                            activeImgIndex === index ? "product-detail__thumb--active" : ""
                                        }`}
                                        onClick={() => setActiveImgIndex(index)}
                                        aria-label={`Xem ảnh ${index + 1}`}
                                        aria-current={activeImgIndex === index}
                                    >
                                        <img src={imgSrc} alt={`${product.name} ${index + 1}`} />
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="product-detail__main">
                            {(product.isNew || product.badge) && (
                                <span className="product-detail__badge">{product.badge || "New"}</span>
                            )}
                            <img className="product-detail__main-image" src={currentImage} alt={product.name} />
                        </div>
                    </section>

                    <section className="product-detail__info" aria-labelledby="pd-name">
                        <p className="product-detail__category">{genderLabel}</p>
                        <h1 className="product-detail__name" id="pd-name">{product.name}</h1>
                        <p className="product-detail__desc">{description}</p>

                        <p className="product-detail__price">{formatPrice(product.price)}</p>
                        <p className="product-detail__vat">Đã bao gồm thuế VAT</p>

                        {product.dialColor && (
                            <div className="product-detail__option">
                                <span className="product-detail__option-label">
                                    Màu mặt số: <strong>{product.dialColor}</strong>
                                </span>
                                <div className="product-detail__swatches">
                                    <span
                                        className={`product-detail__swatch product-detail__swatch--active ${getSwatchClass(product.dialColor)}`}
                                        title={product.dialColor}
                                        aria-label={product.dialColor}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="product-detail__option">
                            <label className="product-detail__option-label" htmlFor="pd-qty">
                                Số lượng
                            </label>
                            <div className="product-detail__qty">
                                <button
                                    type="button"
                                    className="product-detail__qty-btn"
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    aria-label="Giảm số lượng"
                                >
                                    −
                                </button>
                                <input
                                    id="pd-qty"
                                    className="product-detail__qty-input"
                                    type="number"
                                    min={1}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                                />
                                <button
                                    type="button"
                                    className="product-detail__qty-btn"
                                    onClick={() => setQuantity((q) => q + 1)}
                                    aria-label="Tăng số lượng"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="product-detail__actions">
                            <button
                                type="button"
                                className="product-detail__btn product-detail__btn--primary"
                                onClick={handleAddToCart}
                            >
                                Thêm vào giỏ hàng
                            </button>
                            <button
                                type="button"
                                className="product-detail__wishlist"
                                onClick={handleToggleWishlist}
                                aria-label="Thêm vào yêu thích"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    width="22"
                                    height="22"
                                    fill={isFavorite ? "currentColor" : "none"}
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                className="product-detail__btn product-detail__btn--outline"
                                onClick={handleBuyNow}
                            >
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

                <div className="product-detail__sections">
                    <details className="product-detail__section" open>
                        <summary className="product-detail__section-title">Mô tả sản phẩm</summary>
                        <div className="product-detail__section-body">
                            <p>
                                Mẫu đồng hồ {product.name} thuộc bộ sưu tập {product.collection || "cao cấp"} với mặt số{" "}
                                {product.caseSize || "tiêu chuẩn"}, vỏ {product.caseMaterial || "thép không gỉ"} và dây{" "}
                                {product.strapMaterial || "chính hãng"}. Thiết kế tinh xảo, phù hợp cả đi làm lẫn dự tiệc.
                            </p>
                        </div>
                    </details>

                    <details className="product-detail__section" open>
                        <summary className="product-detail__section-title">Thông số kỹ thuật</summary>
                        <div className="product-detail__section-body">
                            <table className="product-detail__specs">
                                <tbody>
                                <tr>
                                    <th scope="row">Bộ sưu tập</th>
                                    <td>{product.collection || "—"}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Đường kính mặt</th>
                                    <td>{product.caseSize || "—"}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Loại máy</th>
                                    <td>{product.movement || "—"}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Chất liệu vỏ</th>
                                    <td>{product.caseMaterial || "—"}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Chất liệu dây</th>
                                    <td>{product.strapMaterial || "—"}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Màu mặt số</th>
                                    <td>{product.dialColor || "—"}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </details>

                    <details className="product-detail__section">
                        <summary className="product-detail__section-title">Bảo hành và đổi trả</summary>
                        <div className="product-detail__section-body">
                            <ul className="product-detail__list">
                                <li>Bảo hành chính hãng theo chính sách của nhà sản xuất.</li>
                                <li>Đổi trả trong 7 ngày nếu sản phẩm lỗi do nhà sản xuất.</li>
                                <li>Hỗ trợ lau dầu, vệ sinh máy miễn phí tại cửa hàng.</li>
                            </ul>
                        </div>
                    </details>
                </div>
            </div>
        </main>
    );
}

export default ProductDetail;