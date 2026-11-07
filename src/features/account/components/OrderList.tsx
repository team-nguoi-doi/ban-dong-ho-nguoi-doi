import React, { useState } from 'react';
import { MOCK_ORDERS } from '../utils/ordersMock';
import type { Order } from '../utils/types';

type OrderStatusFilter = 'ALL' | 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export const OrderList: React.FC = () => {
    const [orders] = useState<Order[]>(MOCK_ORDERS);
    const [activeTab, setActiveTab] = useState<OrderStatusFilter>('ALL');

    const filteredOrders = orders.filter((order) => {
        if (activeTab === 'ALL') return true;
        if (activeTab === 'PENDING') return order.status === 'Pending' || order.status === 'Processing';
        return order.status.toUpperCase() === activeTab;
    });

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
                                    {order.status === 'Processing' && 'Processing'}
                                    {order.status === 'Cancelled' && 'Cancelled'}
                                </span>
                            </div>

                            <div className="order-card__body">
                                {order.items.map((item) => (
                                    <div key={item.id} className="order-item">
                                        <div className="order-item__img">
                                            <img src={item.image} alt={item.productName} />
                                        </div>
                                        <div className="order-item__info">
                                            <h4 className="item-title">{item.productName}</h4>
                                            <p className="item-qty">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="item-price">${item.price.toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="order-card__footer">
                                <div className="order-total">
                                    Total Amount: <span className="total-amount">${order.totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="order-actions">
                                    {order.status === 'Delivered' && (
                                        <button type="button" className="btn-primary">
                                            Buy Again
                                        </button>
                                    )}
                                    <button type="button" className="btn-secondary">
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