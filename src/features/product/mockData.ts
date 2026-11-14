
// Dữ liệu mẫu để xem giao diện. Sau này thay bằng dữ liệu từ API (fake API / backend).

// Ảnh tạm: hình đồng hồ đơn giản vẽ bằng SVG, thay bằng ảnh sản phẩm thật sau
import type {Product} from "./util/types.ts";

const watchSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260" fill="none" stroke="#1a1a1a" stroke-width="3"><rect x="72" y="4" width="56" height="70" rx="8" fill="#e4e4e4"/><rect x="72" y="186" width="56" height="70" rx="8" fill="#e4e4e4"/><circle cx="100" cy="130" r="62" fill="#fff"/><circle cx="100" cy="130" r="52"/><path d="M100 130V94M100 130l24 14" stroke-linecap="round"/></svg>`
export const PLACEHOLDER_IMAGE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(watchSvg)}`

export const MOCK_PRODUCTS: Product[] = [
    { id: 1, name: 'Viren Classic Automatic', image: PLACEHOLDER_IMAGE, price: 8900000, badge: 'Mới', meta: 'Thép không gỉ / Dây kim loại' },
    { id: 2, name: 'Viren Slim Quartz', image: PLACEHOLDER_IMAGE, price: 3391000, meta: 'Thép không gỉ / Dây da' },
    { id: 3, name: 'Viren Moon Lady', image: PLACEHOLDER_IMAGE, price: 4200000, badge: 'Bán chạy', meta: 'Mạ vàng / Dây kim loại' },
    { id: 4, name: 'Viren Sport Chrono', image: PLACEHOLDER_IMAGE, price: 5600000, meta: 'Titanium / Dây cao su' },
    { id: 5, name: 'Viren Pearl Petite', image: PLACEHOLDER_IMAGE, price: 3750000, meta: 'Thép không gỉ / Mặt xà cừ' },
    { id: 6, name: 'Viren Heritage Skeleton', image: PLACEHOLDER_IMAGE, price: 12500000, badge: 'Phiên bản giới hạn', meta: 'Thép không gỉ / Dây da cá sấu' },
    { id: 7, name: 'Viren Day Date', image: PLACEHOLDER_IMAGE, price: 2890000, meta: 'Thép không gỉ / Dây kim loại' },
    { id: 8, name: 'Viren Rose Classic', image: PLACEHOLDER_IMAGE, price: 4650000, meta: 'Mạ vàng hồng / Dây da' },
    { id: 9, name: 'Viren Diver 200', image: PLACEHOLDER_IMAGE, price: 6900000, badge: 'Mới', meta: 'Thép không gỉ / Dây cao su' },
    { id: 10, name: 'Viren Minimal White', image: PLACEHOLDER_IMAGE, price: 2490000, meta: 'Thép không gỉ / Dây vải' },
    { id: 11, name: 'Viren Grand Complication', image: PLACEHOLDER_IMAGE, price: 15800000, badge: 'Bán chạy', meta: 'Thép không gỉ / Dây da' },
    { id: 12, name: 'Viren Everyday Black', image: PLACEHOLDER_IMAGE, price: 2190000, meta: 'Nhựa carbon / Dây cao su' },
]