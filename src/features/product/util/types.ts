
export interface Product {
    id: number | string
    name: string
    image: string
    price: number
    badge?: string // nhãn nhỏ góc trên: "Mới", "Bán chạy"...
    meta?: string  // dòng phụ: chất liệu, loại dây...
}