import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Watch } from '../utils/types';
import { formatPrice } from '../../cart/utils/format';
import { useAddToCart } from '../../cart/useAddToCart';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { addToWishlist, removeFromWishlist } from '../../account/wishlistSlice';

interface ProductCardProps {
    watch: Watch;
}

export default function ProductCard({ watch }: ProductCardProps) {
    const dispatch = useAppDispatch();
    const addItem = useAddToCart();

    const [isHovered, setIsHovered] = useState(false);
    const [imgIndex, setImgIndex] = useState(0);
    const hoverTimer = useRef<number | null>(null);

    const user = useAppSelector((state) => state.auth.user);
    const wishlistItems = useAppSelector((state) => state.wishlist?.items || []);

    const existingWishlist = wishlistItems.find(
        (item) => String(item.watchId || item.productId) === String(watch.id)
    );
    const isFavorite = Boolean(existingWishlist);

    const handleMouseEnter = () => {
        hoverTimer.current = window.setTimeout(() => {
            setIsHovered(true);
            if (watch.images.length > 1) {
                setImgIndex(1);
            }
        }, 120);
    };

    const handleMouseLeave = () => {
        if (hoverTimer.current) {
            clearTimeout(hoverTimer.current);
        }
        setIsHovered(false);
        setImgIndex(0);
    };

    const handlePrevImg = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setImgIndex((prev) => (prev === 0 ? watch.images.length - 1 : prev - 1));
    };

    const handleNextImg = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setImgIndex((prev) => (prev === watch.images.length - 1 ? 0 : prev + 1));
    };

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            alert('Vui lòng đăng nhập để lưu sản phẩm yêu thích!');
            return;
        }

        if (existingWishlist) {
            dispatch(removeFromWishlist(existingWishlist.id));
        } else {
            dispatch(
                addToWishlist({
                    watchId: watch.id,
                    productName: watch.name,
                    price: watch.price,
                    image: watch.images[0],
                })
            );
        }
    };

    const currentImage = watch.images[imgIndex] || watch.images[0];
    const subtitle = `${watch.movement} - ${watch.caseMaterial}`;

    return (
        <div
            className="bv-card-slot"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <article className={`bv-card ${isHovered ? 'is-expanded' : ''}`}>
                <div className="bv-card__media">
                    <button
                        type="button"
                        className={`bv-card__wishlist ${isFavorite ? 'is-active' : ''}`}
                        onClick={handleToggleWishlist}
                        title={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                    >
                        {isFavorite ? '♥' : '♡'}
                    </button>

                    {isHovered && watch.images.length > 1 && (
                        <>
                            <button
                                type="button"
                                className="bv-card__nav bv-card__nav--prev"
                                onClick={handlePrevImg}
                                aria-label="Previous image"
                            >
                                ‹
                            </button>
                            <button
                                type="button"
                                className="bv-card__nav bv-card__nav--next"
                                onClick={handleNextImg}
                                aria-label="Next image"
                            >
                                ›
                            </button>
                        </>
                    )}

                    <Link to={`/products/${watch.id}`} className="bv-card__img-link">
                        <img
                            src={currentImage}
                            alt={watch.name}
                            className="bv-card__img"
                        />
                    </Link>

                    {!isHovered && watch.isNew && (
                        <span className="bv-card__edition">New edition</span>
                    )}
                </div>

                <div className="bv-card__details">
                    <div className="bv-card__details-inner">
                        <h3 className="bv-card__title">
                            <Link to={`/products/${watch.id}`}>{watch.name}</Link>
                        </h3>

                        <p className="bv-card__price">
                            {formatPrice(watch.price)}{' '}
                            <span className="bv-card__tax">Including Taxes</span>
                        </p>

                        <p className="bv-card__specs">{subtitle}</p>

                        <div className="bv-card__actions">
                            <Link to={`/products/${watch.id}`} className="bv-card__discover">
                                DISCOVER MORE
                            </Link>
                            <button
                                type="button"
                                className="bv-card__add-bag"
                                onClick={() =>
                                    addItem({
                                        productId: watch.id,
                                        name: watch.name,
                                        description: subtitle,
                                        image: watch.images[0],
                                        price: watch.price,
                                    })
                                }
                            >
                                ADD TO BAG
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}