import type { Address } from '../../account/utils/types';

export interface User {
    id: string;
    fullName: string;
    email: string;

    title?: 'Mr.' | 'Ms.' | 'Other';
    phone?: string;
    dateOfBirth?: string;
    shippingAddress?: Address | null;
    billingAddress?: Address | null;
    addresses?: Address[];
}

export interface RegisterPayload {
    fullName: string;
    email: string;
    password: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface BackLinkProps {
    to: string;
    label: string;
    corner: boolean;
}