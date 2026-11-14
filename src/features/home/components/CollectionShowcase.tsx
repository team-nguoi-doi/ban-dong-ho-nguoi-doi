import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAddToCart } from '../../cart/useAddToCart.ts';
import { formatPrice } from '../../cart/utils/format.ts';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks.ts';
import { addToWishlist, removeFromWishlist } from '../../account/wishlistSlice.ts';
import type { WatchProduct } from './ProductShowcase.tsx';

const COLLECTIONS = ['SERPENTI', 'OCTO FINISSIMO', 'BVLGARI ALUMINIUM'] as const;

export default function CollectionShowcase() {
    const dispatch = useAppDispatch();
    const addItem = useAddToCart();

    const user = useAppSelector((state) => state.auth.user);
    const wishlistItems = useAppSelector((state) => state.wishlist?.items || []);

    const [activeCol, setActiveCol] = useState<string>('SERPENTI');
    const [products, setProducts] = useState<WatchProduct[]>([]);

    useEffect(() => {
        fetch('http://localhost:3001/watches')
            .then((res) => res.json())
            .then((data: WatchProduct[]) => setProducts(data))
            .catch((err) => console.error('Lỗi tải bộ sưu tập:', err));
    }, []);

    const filtered = products.filter((item) => item.collection === activeCol);

    const handleToggleWishlist = (product: WatchProduct, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            alert('Vui lòng đăng nhập để lưu sản phẩm yêu thích!');
            return;
        }
        const existing = wishlistItems.find(
            (item) => String(item.watchId || item.productId) === String(product.id)
        );
        if (existing) {
            dispatch(removeFromWishlist(existing.id));
        } else {
            dispatch(
                addToWishlist({
                    watchId: product.id,
                    productName: product.name,
                    price: product.price,
                    image: product.images[0],
                })
            );
        }
    };

    return (
        <section className="product-showcase" style={{ paddingTop: '4rem' }}>
            <div className="product-showcase__tabs">
                {COLLECTIONS.map((col) => (
                    <button
                        key={col}
                        className={`product-showcase__tab-btn ${
                            activeCol === col ? 'product-showcase__tab-btn--active' : ''
                        }`}
                        onClick={() => setActiveCol(col)}
                    >
                        {col}
                    </button>
                ))}
            </div>

            <div className="product-showcase__slider-track">
                {filtered.map((product) => {
                    const isFavorite = wishlistItems.some(
                        (item) => String(item.watchId || item.productId) === String(product.id)
                    );
                    const description = `${product.movement} - ${product.caseMaterial}`;

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
                                >
                                    {isFavorite ? '♥' : '♡'}
                                </button>
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="product-card__image"
                                />
                            </div>
                            <div className="product-card__info">
                                <h3 className="product-card__title">{product.name}</h3>
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
                                            image: product.images[0],
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

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <Link
                    to={`/products?collection=${encodeURIComponent(activeCol)}`}
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
                    View all {activeCol}
                </Link>
            </div>
        </section>
    );
}