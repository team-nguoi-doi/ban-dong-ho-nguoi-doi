export { default as ProductCard } from './components/ProductCard';
export { default as ProductFilter } from './components/ProductFilter';
export { productApi } from './api/productApi';
export {
    default as productReducer,
    fetchWatches,
    toggleFilterOption,
    setOnlyNew,
    setSortBy,
    setSearchQuery,
    syncFiltersFromUrl,
    resetFilters,
} from './productSlice';
export type { Watch, FilterCategory, ProductFilterState } from './utils/types';