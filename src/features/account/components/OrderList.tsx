import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks.ts';
import { fetchUserOrders } from '../orderSlice.ts';
import { formatPrice } from '../../cart/utils/format.ts';

type OrderStatusFilter = 'ALL' | 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export const OrderList: React.FC = () => {
    const dispatch = useAppDispatch();

    const { orders, loading, error } = useAppSelector((state) => state.orders);
    const [activeTab, setActiveTab] = useState<OrderStatusFilter>('ALL');

    useEffect(() => {
        dispatch(fetchUserOrders());
    }, [dispatch]);

    const filteredOrders = orders.filter((order) => {
        if (activeTab === 'ALL') return true;
        if (activeTab === 'PENDING') return order.status === 'Pending' || order.status === 'Processing';
        return order.status.toUpperCase() === activeTab;
    });

    if (loading) return <div className="order-list-page"><p>Loading your orders...</p></div>;
    if (error) return <div className="order-list-page"><p className="account__error">{error}</p></div>;

    return (
        <div className="order-list-page">
            <div className="order-list__header">
                <h2>My order list</h2>
                <p>Track and view details of your previous and ongoing orders.</p>
            </div>

            <div className="order-tabs">
                <button
                    type="button"
                    className={`order-tab ${activeTab === 'ALL' ? 'active' : ''}`}
                    onClick={() => setActiveTab('ALL')}
                >
                    All ({orders.length})
                </button>
                <button
                    type="button"
                    className={`order-tab ${activeTab === 'PENDING' ? 'active' : ''}`}
                    onClick={() => setActiveTab('PENDING')}
                >
                    Processing
                </button>
                <button
                    type="button"
                    className={`order-tab ${activeTab === 'SHIPPED' ? 'active' : ''}`}
                    onClick={() => setActiveTab('SHIPPED')}
                >
                    On the way
                </button>
                <button
                    type="button"
                    className={`order-tab ${activeTab === 'DELIVERED' ? 'active' : ''}`}
                    onClick={() => setActiveTab('DELIVERED')}
                >
                    Completed
                </button>
                <button
                    type="button"
                    className={`order-tab ${activeTab === 'CANCELLED' ? 'active' : ''}`}
                    onClick={() => setActiveTab('CANCELLED')}
                >
                    Cancelled
                </button>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="order-list__empty">
                    <p>No orders found for this status.</p>
                </div>
            ) : (
                <div className="order-list__items">
                    {filteredOrders.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-card__header">
                                <span className="order-id">ORDER ID: #{order.id}</span>
                                <span className={`order-status status-${order.status.toLowerCase()}`}>
                                    {order.status === 'Delivered' && 'Completed'}
                                    {order.status === 'Shipped' && 'On the way'}
                                    {(order.status === 'Processing' || order.status === 'Pending') && 'Processing'}
                                    {order.status === 'Cancelled' && 'Cancelled'}
                                </span>
                            </div>

                            <div className="order-card__body">
                                {order.items.map((item, index) => (
                                    <div key={item.id || index} className="order-item">
                                        <div className="order-item__img">
                                            <img
                                                src={item.image}
                                                alt={item.productName}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src =
                                                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200';
                                                }}
                                            />
                                        </div>
                                        <div className="order-item__info">
                                            <h4 className="item-title">{item.productName}</h4>
                                            <p className="item-qty">x{item.quantity}</p>
                                        </div>
                                        <div className="item-price">{formatPrice(item.price)}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="order-card__footer">
                                <div className="order-total">
                                    Order Total: <span className="total-amount">{formatPrice(order.totalAmount)}</span>
                                </div>
                                <div className="order-actions">
                                    {order.status === 'Delivered' && (
                                        <button type="button" className="btn-luxury-secondary">
                                            Buy Again
                                        </button>
                                    )}
                                    <button type="button" className="btn-luxury-primary">
                                        View Details
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