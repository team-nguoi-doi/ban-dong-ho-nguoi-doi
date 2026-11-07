
export interface Address {
    id?: string;
    fullName: string;
    phone: string;
    streetAddress: string;
    addressLine2?: string;
    city: string;
    region?: string;
    country: string;
    postalCode?: string;
    isDefault?: boolean;
    isDefaultShipping?: boolean;
    isDefaultBilling?: boolean;
}

export interface PersonalInfo {
    id: string;
    email: string;
    title: 'Mr.' | 'Ms.' | 'Other';
    fullName: string;
    phone: string;
    dateOfBirth: string;
    shippingAddress?: Address | null;
    billingAddress?: Address | null;
    addresses?: Address[];
}

export type AddressFormValues = Omit<Address, 'id' | 'isDefault'>;

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
    id: string;
    productId?: string;
    productName: string;
    image: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: string;
    createdAt: string;
    status: OrderStatus;
    items: OrderItem[];
    totalAmount: number;
    shippingAddress?: Address;
    paymentMethod?: string;
}

export interface WishlistItem {
    id: string;
    productId?: string;
    productName: string;
    image: string;
    price: number;
    inStock: boolean;
    referenceNumber?: string;
}