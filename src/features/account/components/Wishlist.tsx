import React, { useState } from 'react';
import { MOCK_WISHLIST } from '../utils/wishlistMock';
import type { WishlistItem } from '../utils/types';

export const Wishlist: React.FC = () => {
    const [wishlist, setWishlist] = useState<WishlistItem[]>(MOCK_WISHLIST);

    const handleRemoveItem = (id: string) => {
        setWishlist((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <div className="wishlist-page">
            <div className="wishlist__header">
                <h2>My wishlist ({wishlist.length})</h2>
                <p>Save your favorite timepieces and access them anytime.</p>
            </div>

            {wishlist.length === 0 ? (
                <div className="wishlist__empty">
                    <p>Your wishlist is currently empty.</p>
                </div>
            ) : (
                <div className="wishlist-list-luxury">
                    {wishlist.map((item) => (
                        <div key={item.id} className="wishlist-item-row">
                            <div className="wishlist-item__img-box">
                                <img src={item.image} alt={item.productName} />
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
                                    <div className="product-price">${item.price.toLocaleString()}</div>
                                    <button
                                        type="button"
                                        className="btn-add-to-bag"
                                        disabled={!item.inStock}
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