import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { fetchUserWishlist, removeFromWishlist } from '../wishlistSlice';
import { useAddToCart } from '../../cart/useAddToCart.ts';
import { formatPrice } from '../../cart/utils/format.ts';

export const Wishlist: React.FC = () => {
    const dispatch = useAppDispatch();
    const addItem = useAddToCart();

    const { items: wishlist = [], loading, error } = useAppSelector(
        (state) => state.wishlist || { items: [], loading: false, error: null }
    );

    useEffect(() => {
        dispatch(fetchUserWishlist());
    }, [dispatch]);

    const handleRemoveItem = (id: string) => {
        dispatch(removeFromWishlist(id));
    };

    if (loading) return <div className="wishlist-loading"><p>Loading your wishlist...</p></div>;
    if (error) return <div className="wishlist-error"><p className="account__error">{error}</p></div>;

    return (
        <div className="wishlist-page">
            <div className="wishlist__header">
                <h2>My wishlist ({wishlist?.length || 0})</h2>
                <p>Save your favorite timepieces and access them anytime.</p>
            </div>

            {(!wishlist || wishlist.length === 0) ? (
                <div className="wishlist__empty">
                    <p>Your wishlist is currently empty.</p>
                </div>
            ) : (
                <div className="wishlist-list-luxury">
                    {wishlist.map((item) => (
                        <div key={item.id} className="wishlist-item-row">
                            <div className="wishlist-item__img-box">
                                <img
                                    src={item.image}
                                    alt={item.productName}
                                    onError={(e) => {
                                        /* Tự động đổi sang ảnh minh họa sạch nếu link ảnh hỏng */
                                        (e.target as HTMLImageElement).src =
                                            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200';
                                    }}
                                />
                            </div>

                            <div className="wishlist-item__details">
                                <div className="wishlist-item__header">
                                    <div>
                                        <h4 className="product-title">{item.productName}</h4>
                                        {item.referenceNumber && (
                                            <span className="product-code">PRODUCT CODE: {item.referenceNumber}</span>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-remove-link"
                                        onClick={() => handleRemoveItem(item.id)}
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div className="wishlist-item__bottom">
                                    <div className="product-price">
                                        {formatPrice(item.price)}
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-add-to-bag"
                                        disabled={!item.inStock}
                                        onClick={() => {
                                            addItem({
                                                productId: item.productId || (item.watchId ? String(item.watchId) : item.id),
                                                name: item.productName,
                                                image: item.image,
                                                price: item.price,
                                            });
                                        }}
                                    >
                                        {item.inStock ? 'ADD TO SHOPPING BAG' : 'UNAVAILABLE'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};