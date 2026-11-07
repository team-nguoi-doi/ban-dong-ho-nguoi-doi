import type { Order } from './types';

export const MOCK_ORDERS: Order[] = [
    {
        id: 'ORD-2026-8891',
        createdAt: '12/03/2026',
        status: 'Delivered',
        totalAmount: 3450,
        paymentMethod: 'Credit Card (Visa)',
        items: [
            {
                id: 'p1',
                productName: 'Master Collection 40mm',
                image: 'https://via.placeholder.com/80',
                price: 2450,
                quantity: 1,
            },
            {
                id: 'p2',
                productName: 'Leather Strap Brown 20mm',
                image: 'https://via.placeholder.com/80',
                price: 1000,
                quantity: 1,
            },
        ],
    },
    {
        id: 'ORD-2026-7712',
        createdAt: '28/02/2026',
        status: 'Processing',
        totalAmount: 2150,
        paymentMethod: 'PayPal',
        items: [
            {
                id: 'p3',
                productName: 'HydroConquest Automatic',
                image: 'https://via.placeholder.com/80',
                price: 2150,
                quantity: 1,
            },
        ],
    },
];