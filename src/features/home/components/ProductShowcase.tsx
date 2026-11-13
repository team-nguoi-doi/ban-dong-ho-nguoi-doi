import { useState, useRef } from 'react';
import { useAddToCart } from '../../cart/useAddToCart.ts';
import { formatPrice } from '../../cart/utils/format.ts';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks.ts';
import { addToWishlist, removeFromWishlist } from '../../account/wishlistSlice.ts';

import imageHomeNew1 from '../../../assets/images/home-new/home-new-1.avif';
import imageHomeNew2 from '../../../assets/images/home-new/home-new-2.avif';
import imageHomeNew3 from '../../../assets/images/home-new/home-new-3.avif';
import imageHomeNew4 from '../../../assets/images/home-new/home-new-4.avif';
import imageHomeNew5 from '../../../assets/images/home-new/home-new-5.avif';
import imageHomeNew6 from '../../../assets/images/home-new/home-new-6.avif';
import imageHomeNew7 from '../../../assets/images/home-new/home-new-7.avif';
import imageHomeNew8 from '../../../assets/images/home-new/home-new-8.avif';
import imageHomeNew9 from '../../../assets/images/home-new/home-new-9.avif';

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    isNew?: boolean;
    category: 'new' | 'best-seller';
}

const DUMMY_PRODUCTS: Product[] = [
    {
        id: 1,
        name: 'HYDROCONQUEST',
        description: '42 mm - Automatic watch - Stainless steel and ceramic bezel',
        price: 1950,
        image: imageHomeNew1,
        isNew: true,
        category: 'new',
    },
    {
        id: 2,
        name: 'HYDROCONQUEST',
        description: '42 mm - Automatic watch - Stainless steel and ceramic bezel',
        price: 1950,
        image: imageHomeNew2,
        isNew: true,
        category: 'new',
    },
    {
        id: 3,
        name: 'HYDROCONQUEST',
        description: '42 mm - Quartz watch - Stainless steel',
        price: 1300,
        image: imageHomeNew3,
        isNew: true,
        category: 'new',
    },
    {
        id: 4,
        name: 'LONGINES LEGEND DIVER',
        description: '42 mm - Automatic watch - Stainless steel',
        price: 3400,
        image: imageHomeNew4,
        isNew: true,
        category: 'new',
    },
    {
        id: 5,
        name: 'SERPENTI TUBOGAS',
        description: '35 mm - Quartz watch - Single-spiral steel curve',
        price: 6200,
        image: imageHomeNew5,
        isNew: false,
        category: 'best-seller',
    },
    {
        id: 6,
        name: 'HYDROCONQUEST',
        description: '42 mm - Automatic watch - Stainless steel and ceramic bezel',
        price: 1950,
        image: imageHomeNew6,
        isNew: true,
        category: 'best-seller',
    },
    {
        id: 7,
        name: 'HYDROCONQUEST',
        description: '42 mm - Quartz watch - Stainless steel',
        price: 1300,
        image: imageHomeNew7,
        isNew: true,
        category: 'best-seller',
    },
    {
        id: 8,
        name: 'LONGINES LEGEND DIVER',
        description: '42 mm - Automatic watch - Stainless steel',
        price: 3400,
        image: imageHomeNew8,
        isNew: true,
        category: 'best-seller',
    },
    {
        id: 9,
        name: 'SERPENTI TUBOGAS',
        description: '35 mm - Quartz watch - Single-spiral steel curve',
        price: 6200,
        image: imageHomeNew9,
        isNew: false,
        category: 'best-seller',
    },
];

export default function ProductShowcase() {
    const dispatch = useAppDispatch();
    const addItem = useAddToCart();

    // Lấy thông tin user và danh sách wishlist từ Redux
    const user = useAppSelector((state) => state.auth.user);
    const wishlistItems = useAppSelector((state) => state.wishlist?.items || []);

    const [activeTab, setActiveTab] = useState<'new' | 'best-seller'>('new');
    const [scrollProgress, setScrollProgress] = useState<number>(0);
    const [visibleRatio, setVisibleRatio] = useState<number>(1);

    const sliderRef = useRef<HTMLDivElement>(null);

    const filteredProducts = DUMMY_PRODUCTS.filter(
        (product) => product.category === activeTab
    );

    const handleScroll = () => {
        if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            const totalScroll = scrollWidth - clientWidth;

            if (scrollWidth > 0) {
                setVisibleRatio(clientWidth / scrollWidth);
            }

            if (totalScroll > 0) {
                const progress = scrollLeft / totalScroll;
                setScrollProgress(progress);
            } else {
                setScrollProgress(0);
            }
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
            setTimeout(() => {
                handleScroll();
            }, 50);
        }
    };

    // Xử lý bật/tắt yêu thích (Wishlist toggle)
    const handleToggleWishlist = (product: Product, e: React.MouseEvent) => {
        e.stopPropagation();

        if (!user) {
            alert('Vui lòng đăng nhập để lưu sản phẩm yêu thích!');
            return;
        }

        const existingItem = wishlistItems.find(
            (item) => String(item.watchId || item.productId) === String(product.id)
        );

        if (existingItem) {
            dispatch(removeFromWishlist(existingItem.id));
        } else {
            dispatch(
                addToWishlist({
                    watchId: product.id,
                    productName: product.name,
                    price: product.price,
                    image: product.image,
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

                    return (
                        <div key={product.id} className="product-card">
                            <div className="product-card__image-box">
                                {product.isNew && (
                                    <span className="product-card__badge">New</span>
                                )}

                                {/* Nút icon trái tim yêu thích */}
                                <button
                                    type="button"
                                    className={`btn-wishlist ${isFavorite ? 'active' : ''}`}
                                    onClick={(e) => handleToggleWishlist(product, e)}
                                    title={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                                >
                                    {isFavorite ? '♥' : '♡'}
                                </button>

                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="product-card__image"
                                />
                            </div>
                            <div className="product-card__info">
                                <h3 className="product-card__title">{product.name}</h3>
                                <p className="product-card__description">{product.description}</p>
                                <span className="product-card__price">{formatPrice(product.price)}</span>
                                <button
                                    type="button"
                                    className="product-card__add"
                                    onClick={() =>
                                        addItem({
                                            productId: String(product.id),
                                            name: product.name,
                                            description: product.description,
                                            image: product.image,
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
        </section>
    );
}