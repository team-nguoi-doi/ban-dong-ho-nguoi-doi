
// export interface Product {
//     id: number | string
//     name: string
//     image: string
//     price: number
//     badge?: string // nhãn nhỏ góc trên: "Mới", "Bán chạy"...
//     meta?: string  // dòng phụ: chất liệu, loại dây...
//
// }
export interface Product {
    id: string;
    name: string;
    price: number;
    isNew?: boolean;
    availableOnline?: boolean;
    gender?: string;
    collection?: string;
    caseMaterial?: string;
    watchShape?: string;
    movement?: string;
    strapMaterial?: string;
    caseSize?: string;
    dialColor?: string;
    images?: string[];
    image?: string;
    badge?: string;
    meta?: string;
}