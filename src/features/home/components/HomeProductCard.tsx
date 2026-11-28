import { Link } from 'react-router-dom';
import { formatPrice } from '../../cart';
import { useAddToCartHero } from '../../cart/useAddToCartHero';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { addToWishlist, removeFromWishlist } from '../../account/wishlistSlice';

export interface HomeProductItem {
    id: string;
    name: string;
    price: number;
    movement?: string;
    caseMaterial?: string;
    isNew?: boolean;
    image?: string;
    images?: string[];
}

interface HomeProductCardProps {
    product: HomeProductItem;
}

export default function HomeProductCard({ product }: HomeProductCardProps) {
    const dispatch = useAppDispatch();
    const addToCartChecked = useAddToCartHero();

    const user = useAppSelector((state) => state.auth.user);
    const wishlistItems = useAppSelector((state) => state.wishlist?.items || []);

    const existingItem = wishlistItems.find(
        (item) => String(item.watchId || item.productId) === String(product.id)
    );
    const isFavorite = Boolean(existingItem);
    const mainImage = product.images?.[0] || product.image || '';
    const description = [product.movement, product.caseMaterial]
        .filter(Boolean)
        .join(' - ');

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!user) {
            alert('Vui lòng đăng nhập để lưu sản phẩm yêu thích!');
            return;
        }

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

    return (
        <div className="product-card">
            <div className="product-card__image-box">
                {product.isNew && (
                    <span className="product-card__badge">New</span>
                )}

                <button
                    type="button"
                    className={`btn-wishlist ${isFavorite ? 'active' : ''}`}
                    onClick={handleToggleWishlist}
                    title={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                    aria-label={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                >
                    <svg
                        width="24"
                        height="24"
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
                        addToCartChecked(
                            {
                                productId: product.id,
                                name: product.name,
                                description,
                                image: mainImage,
                                price: product.price,
                            },
                            1
                        )
                    }
                >
                    ADD TO BAG
                </button>
            </div>
        </div>
    );
}