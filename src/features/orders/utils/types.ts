import type {PaymentMethod} from "../../checkout/utils/types.ts";
import type {AddressValue} from "../../address/utils/types.ts";

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

interface OrderRecipient {
    name: string
    phone: string
    address: AddressValue
}

// order-item
export interface OrderLine {
    productId: number | string
    productName: string
    productImage: string
    quantity: number
    productPrice: number
}

export interface NewOrder {
    userId: string | number
    items: OrderLine[]
    subtotal: number
    shippingFee: number
    total: number
    payment: PaymentMethod
    recipient: OrderRecipient // người nhận (trùng thông tin thanh toán nếu không chọn giao địa chỉ khác)
    note: string
}

// Đơn hàng đã lưu: server thêm id, trạng thái, thời gian tạo
export interface Order extends NewOrder {
    id: string | number
    status: OrderStatus
    createdAt: string // ISO, ví dụ 2026-11-14T09:30:00.000Z
}
