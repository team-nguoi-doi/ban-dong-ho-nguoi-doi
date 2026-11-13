export interface Watch {
    id: string;
    name: string;
    price: number;
    isNew?: boolean;
    gender: string;
    collection: string;
    caseMaterial: string;
    watchShape?: string;
    movement: string;
    strapMaterial?: string;
    dialColor?: string;
    description?: string;
    images: string[];
}

export type FilterCategory =
    | 'gender'
    | 'collection'
    | 'caseMaterial'
    | 'watchShape'
    | 'movement'
    | 'strapMaterial'
    | 'dialColor';

export interface ProductFilterState {
    gender: string[];
    collection: string[];
    caseMaterial: string[];
    watchShape: string[];
    movement: string[];
    strapMaterial: string[];
    dialColor: string[];
    onlyNew: boolean;
    sortBy: 'default' | 'price-asc' | 'price-desc';
    searchQuery: string;
}