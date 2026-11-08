import type {PaymentOption} from "./types.ts";

export const SHIPPING_FEE = 30000

export const PAYMENT_OPTIONS: PaymentOption[] = [
    {
        value: 'bank',
        label: 'Chuyển khoản online qua ngân hàng',
        desc: 'Thông tin tài khoản chuyển khoản sẽ hiển thị sau khi bạn bấm “Đặt hàng”. Chúng tôi sẽ liên hệ xác nhận đơn ngay sau đó.',
    },
    {
        value: 'cod',
        label: 'Thanh toán khi nhận hàng (COD)',
        desc: 'Bạn thanh toán bằng tiền mặt khi nhận được sản phẩm.',
    },
    {
        value: 'pickup',
        label: 'Nhận sản phẩm tại cửa hàng',
        desc: 'Nhận và thanh toán trực tiếp tại cửa hàng, không mất phí vận chuyển.',
    },
]