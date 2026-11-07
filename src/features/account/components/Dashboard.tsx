import React from 'react';
import { useAppSelector } from '../../../hooks/hooks.ts';
import { Link } from 'react-router-dom';
import type { PersonalInforType } from '../utils/types.ts';
import { MOCK_ORDERS } from '../utils/ordersMock';

export const Dashboard: React.FC = () => {
    const user = useAppSelector((state) => state.auth.user) as PersonalInforType | null;

    const latestOrder = MOCK_ORDERS.length > 0 ? MOCK_ORDERS[0] : null;

    const activeAddress = user?.shippingAddress || user?.billingAddress;
    const hasAddress = Boolean(activeAddress);

    return (
        <div className="account-dashboard">
            <div className="dashboard-header">
                <h1>Hello {user?.fullName }</h1>
                <p>
                    In your account you can track your order, change your information or delivery address, and view your saved items.
                </p>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card card-white">
                    <div className="card-body">
                        <h3>Latest order</h3>
                        {latestOrder ? (
                            <div className="order-summary">
                                <p className="order-summary__id">Order #{latestOrder.id}</p>
                                <p className="order-summary__date">Date: {latestOrder.createdAt}</p>
                                <span className={`status-badge status-${latestOrder.status.toLowerCase()}`}>
                                    {latestOrder.status}
                                </span>
                            </div>
                        ) : (
                            <p className="card-empty">No orders yet!</p>
                        )}
                    </div>
                    <Link to="/account/orders" className="card-link-bold">
                        View all orders
                    </Link>
                </div>

                <div className="dashboard-card card-white">
                    <div className="card-body">
                        <h3>My addresses</h3>
                        {hasAddress ? (
                            <div className="address-summary">
                                <p><strong>{activeAddress?.fullName}</strong></p>
                                <p>{activeAddress?.streetAddress}</p>
                                <p>{activeAddress?.city}, {activeAddress?.country}</p>
                            </div>
                        ) : (
                            <p className="card-empty">No addresses yet</p>
                        )}
                    </div>
                    <Link to="/account/personal-info" className="card-link-bold">
                        {hasAddress ? "Edit addresses" : "Manage my addresses"}
                    </Link>
                </div>

                <div className="dashboard-card card-banner banner-profile">
                    <div className="banner-content">
                        <h3>Personal information</h3>
                        <p>Edit your personal profile, email address and password.</p>
                        <Link to="/account/personal-info" className="btn-banner">
                            Edit information
                        </Link>
                    </div>
                </div>

                <div className="dashboard-card card-banner banner-wishlist">
                    <div className="banner-content">
                        <h3>My wishlist</h3>
                        <p>Access and review your saved wishlist collection.</p>
                        <Link to="/account/wishlist" className="btn-banner">
                            Go to wishlist
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};