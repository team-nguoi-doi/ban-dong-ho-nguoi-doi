
import BackLink from "../../auth/components/BackLink.tsx";
import {formatPrice} from "../../cart";
import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../../hooks/hooks.ts";
import {fetchUserOrders} from "../orderSlice.ts";
import {useNavigate, useParams} from "react-router-dom";
import type {OrderStatus} from "../utils/types.ts";
import './OrderDetail.css';
import {formatAddressValue} from "../../address/utils/convert.ts";

const STATUS_LABEL: Record<OrderStatus, string> = {
    Pending: 'Processing',
    Processing: 'Processing',
    Shipped: 'On the way',
    Delivered: 'Completed',
    Cancelled: 'Cancelled',
};

export default function OrderDetail() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {items, loading, error} = useAppSelector((state) => state.orders);

    useEffect(() => {
        if(items.length === 0) dispatch(fetchUserOrders());
    }, [dispatch, items.length]);

    const { id } = useParams<{ id: string }>();
    const order = items.find((item) => item.id === id);

    if (loading) return <div className="order-detail-page"><p>Loading order...</p></div>;
    if (error) return <div className="order-detail-page"><p className="account__error">{error}</p></div>;

    if (!order) {
        return (
            <div className="order-detail-page">
                <p>Order not found.</p>
                <button type="button" className="btn-luxury-secondary" onClick={() => navigate('/orders')}>
                    Back to orders
                </button>
            </div>
        );
    }

    const { recipient } = order;

    return (
        <div className="order-detail-page">
            <BackLink to="/account/orders" label="Quay về trang đơn hàng" corner />

            <div className="order-detail__header">
                <h2>Order #{order.id}</h2>
                <span className={`order-status status-${order.status.toLowerCase()}`}>
                    {STATUS_LABEL[order.status]}
                </span>
            </div>
            <p className="order-detail__date">
                Placed on {new Date(order.createdAt).toLocaleString('vi-VN')}
            </p>

            <section className="order-detail__section">
                <h3>Recipient</h3>
                <p>{recipient.name}</p>
                <p>{recipient.phone}</p>
                <p>{formatAddressValue(recipient.address)}</p>
            </section>

            <section className="order-detail__section">
                <h3>Payment method</h3>
                <p>{String(order.payment)}</p>
            </section>

            <section className="order-detail__section">
                <h3>Items</h3>
                {order.items.map((item, index) => (
                    <div key={item.productId || index} className="order-item">
                        <div className="order-item__img">
                            <img src={item.productImage} alt={item.productName} />
                        </div>
                        <div className="order-item__info">
                            <h4 className="item-title">{item.productName}</h4>
                            <p className="item-qty">x{item.quantity}</p>
                        </div>
                        <div className="item-price">
                            {formatPrice(item.productPrice * item.quantity)}
                        </div>
                    </div>
                ))}
            </section>

            {order.note && (
                <section className="order-detail__section">
                    <h3>Note</h3>
                    <p>{order.note}</p>
                </section>
            )}

            <section className="order-detail__summary">
                <div>
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div>
                    <span>Shipping</span>
                    <span>{formatPrice(order.shippingFee)}</span>
                </div>
                <div className="order-detail__total">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                </div>
            </section>
        </div>
    );
}