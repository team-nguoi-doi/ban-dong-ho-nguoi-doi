export interface CartItem {
    productId: string;
    name: string;
    description?: string;
    image: string;
    price: number;
    quantity: number;
}

export type AddToCartPayload = Omit<CartItem, 'quantity'> & { quantity?: number };
