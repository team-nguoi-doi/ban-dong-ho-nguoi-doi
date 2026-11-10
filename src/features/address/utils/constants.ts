import type { AddressValue } from './types'

// Địa chỉ hành chính Việt Nam từ 01/07/2025 chỉ còn 2 cấp: Tỉnh/Thành phố và Xã/Phường.
export const ADDRESS_API_URL =
    import.meta.env.VITE_ADDRESS_API_URL ?? 'https://provinces.open-api.vn/api/v2'

export const EMPTY_ADDRESS: AddressValue = {
    provinceCode: '',
    provinceName: '',
    wardCode: '',
    wardName: '',
    detail: '',
}