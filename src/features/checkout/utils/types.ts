
export type PaymentMethod = 'bank' | 'cod' | 'pickup'

export interface PaymentOption {
    value: PaymentMethod,
    label: string,
    desc: string
}