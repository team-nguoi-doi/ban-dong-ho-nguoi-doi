import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAddToCart } from '../../cart';
import { formatPrice } from '../../cart';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks.ts';
import { addToWishlist, removeFromWishlist } from '../../account/wishlistSlice.ts';
import type { Product } from '../../product/util/types.ts';

export default function ProductShowcase() {
    const dispatch = useAppDispatch();
    const addItem = useAddToCart();

    const user = useAppSelector((state) => state.auth.user);
    const wishlistItems = useAppSelector((state) => state.wishlist?.items || []);

    const [products, setProducts] = useState<Product[]>([]);
    const [activeTab, setActiveTab] = useState<'new' | 'best-seller'>('new');
    const [scrollProgress, setScrollProgress] = useState<number>(0);
    const [visibleRatio, setVisibleRatio] = useState<number>(1);

    const sliderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch('http://localhost:3001/watches')
            .then((res) => res.json())
            .then((data: Product[]) => {
                setProducts(data);
                setTimeout(() => handleScroll(), 100);
            })
            .catch((err) => console.error('Lỗi tải sản phẩm:', err));
    }, []);

    const filteredProducts =
        activeTab === 'new'
            ? products.filter((p) => p.isNew)
            : products.filter((p) => !p.isNew);

    const handleScroll = () => {
        if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            const totalScroll = scrollWidth - clientWidth;

            if (scrollWidth > 0) {
                setVisibleRatio(clientWidth / scrollWidth);
            }
            setScrollProgress(totalScroll > 0 ? scrollLeft / totalScroll : 0);
        }
    };

    const handleSlide = (direction: 'prev' | 'next') => {
        if (sliderRef.current) {
            const scrollAmount = sliderRef.current.clientWidth;
            sliderRef.current.scrollBy({
                left: direction === 'next' ? scrollAmount : -scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const handleTabChange = (tab: 'new' | 'best-seller') => {
        setActiveTab(tab);
        setScrollProgress(0);
        if (sliderRef.current) {
            sliderRef.current.scrollLeft = 0;
            setTimeout(() => handleScroll(), 50);
        }
    };

    const handleToggleWishlist = (product: Product, e: React.MouseEvent) => {
        e.stopPropagation();

        if (!user) {
            alert('Vui lòng đăng nhập để lưu sản phẩm yêu thích!');
            return;
        }

        const existingItem = wishlistItems.find(
            (item) => String(item.watchId || item.productId) === String(product.id)
        );
        const mainImage = product.images?.[0] || product.image || '';

        if (existingItem) {
            dispatch(removeFromWishlist(existingItem.id));
        } else {
            dispatch(
                addToWishlist({
                    watchId: product.id,
                    productName: product.name,
                    price: product.price,
                    image: mainImage,
                })
            );
        }
    };

    const progressWidth = Math.min(100, Math.max(10, visibleRatio * 100));
    const progressLeft = scrollProgress * (100 - progressWidth);

    return (
        <section className="product-showcase">
            <div className="product-showcase__tabs">
                <button
                    className={`product-showcase__tab-btn ${
                        activeTab === 'new' ? 'product-showcase__tab-btn--active' : ''
                    }`}
                    onClick={() => handleTabChange('new')}
                >
                    NEW
                </button>
                <button
                    className={`product-showcase__tab-btn ${
                        activeTab === 'best-seller' ? 'product-showcase__tab-btn--active' : ''
                    }`}
                    onClick={() => handleTabChange('best-seller')}
                >
                    BEST SELLERS
                </button>
            </div>

            <div
                ref={sliderRef}
                onScroll={handleScroll}
                className="product-showcase__slider-track"
            >
                {filteredProducts.map((product) => {
                    const existingItem = wishlistItems.find(
                        (item) => String(item.watchId || item.productId) === String(product.id)
                    );
                    const isFavorite = Boolean(existingItem);
                    const mainImage = product.images?.[0] || product.image || '';
                    const description = [product.movement, product.caseMaterial]
                        .filter(Boolean)
                        .join(' - ');

                    return (
                        <div key={product.id} className="product-card">
                            <div className="product-card__image-box">
                                {product.isNew && (
                                    <span className="product-card__badge">New</span>
                                )}

                                <button
                                    type="button"
                                    className={`btn-wishlist ${isFavorite ? 'active' : ''}`}
                                    onClick={(e) => handleToggleWishlist(product, e)}
                                    title={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                                    aria-label={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill={isFavorite ? 'currentColor' : 'none'}
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                </button>

                                <Link to={`/products/${product.id}`} className="product-card__img-link">
                                    <img
                                        src={mainImage}
                                        alt={product.name}
                                        className="product-card__image"
                                    />
                                </Link>
                            </div>
                            <div className="product-card__info">
                                <Link to={`/products/${product.id}`} className="product-card__title-link">
                                    <h3 className="product-card__title">{product.name}</h3>
                                </Link>
                                <p className="product-card__description">{description}</p>
                                <span className="product-card__price">
                                    {formatPrice(product.price)}
                                </span>
                                <button
                                    type="button"
                                    className="product-card__add"
                                    onClick={() =>
                                        addItem({
                                            productId: product.id,
                                            name: product.name,
                                            description,
                                            image: mainImage,
                                            price: product.price,
                                        })
                                    }
                                >
                                    ADD TO BAG
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="product-showcase__controls">
                <div className="product-showcase__progress-bar">
                    <div
                        className="product-showcase__progress-fill"
                        style={{
                            width: `${progressWidth}%`,
                            left: `${progressLeft}%`,
                            transition: 'left 0.1s ease-out, width 0.3s ease',
                        }}
                    />
                </div>

                <div className="product-showcase__nav-btns">
                    <button
                        onClick={() => handleSlide('prev')}
                        className="product-showcase__nav-btn"
                        aria-label="Previous Products"
                    >
                        ❮
                    </button>
                    <button
                        onClick={() => handleSlide('next')}
                        className="product-showcase__nav-btn"
                        aria-label="Next Products"
                    >
                        ❯
                    </button>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <Link
                    to="/products"
                    style={{
                        color: '#1a1a1a',
                        textDecoration: 'none',
                        borderBottom: '1px solid #1a1a1a',
                        paddingBottom: '3px',
                        fontSize: '1.1rem',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                    }}
                >
                    View all watches
                </Link>
            </div>
        </section>
    );
}