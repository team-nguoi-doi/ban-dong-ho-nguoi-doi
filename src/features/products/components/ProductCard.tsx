import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Watch } from '../utils/types';
import { formatPrice } from '../../cart';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { addToWishlist, removeFromWishlist } from '../../account/wishlistSlice';
import {useAddToCartHero} from "../../cart/useAddToCartHero.ts";

interface ProductCardProps {
    watch: Watch;
}

export default function ProductCard({ watch }: ProductCardProps) {
    const dispatch = useAppDispatch();
    const addToCartChecked = useAddToCartHero();

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

    const handleAddToCart = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        addToCartChecked(
            {
                productId: watch.id,
                name: watch.name,
                description: subtitle,
                image: watch.images[0],
                price: watch.price,
            },
            1
        );
    };

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
                        aria-label={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                    >
                        <svg
                            width="22"
                            height="22"
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

                    <button
                        type="button"
                        className="bv-card__quick-add"
                        onClick={handleAddToCart}
                    >
                        ADD TO BAG
                    </button>
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
                            <Link
                                to={`/products/${watch.id}`}
                                className="bv-card__discover"
                                onClick={(e) => e.stopPropagation()}
                            >
                                DISCOVER MORE
                            </Link>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}