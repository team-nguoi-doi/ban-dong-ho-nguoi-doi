import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Watch, ProductFilterState, FilterCategory } from './utils/types';
import { productApi } from './api/productApi';

interface ProductState {
    items: Watch[];
    loading: boolean;
    error: string | null;
    filters: ProductFilterState;
}

const initialFilters: ProductFilterState = {
    gender: [],
    collection: [],
    caseMaterial: [],
    watchShape: [],
    movement: [],
    strapMaterial: [],
    dialColor: [],
    onlyNew: false,
    sortBy: 'default',
    searchQuery: '',
};

const initialState: ProductState = {
    items: [],
    loading: false,
    error: null,
    filters: initialFilters,
};

export const fetchWatches = createAsyncThunk('products/fetchWatches', async () => {
    return await productApi.getAllWatches();
});

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        toggleFilterOption: (
            state,
            action: PayloadAction<{ category: FilterCategory; value: string }>
        ) => {
            const { category, value } = action.payload;
            const currentList = state.filters[category];
            if (currentList.includes(value)) {
                state.filters[category] = currentList.filter((item) => item !== value);
            } else {
                state.filters[category].push(value);
            }
        },
        setOnlyNew: (state, action: PayloadAction<boolean>) => {
            state.filters.onlyNew = action.payload;
        },
        setSortBy: (state, action: PayloadAction<'default' | 'price-asc' | 'price-desc'>) => {
            state.filters.sortBy = action.payload;
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.filters.searchQuery = action.payload;
        },
        syncFiltersFromUrl: (
            state,
            action: PayloadAction<{
                gender?: string | null;
                collection?: string | null;
                isNew?: string | null;
            }>
        ) => {
            const { gender, collection, isNew } = action.payload;
            state.filters = {
                ...initialFilters,
                gender: gender ? [gender.toUpperCase()] : [],
                collection: collection ? [collection.toUpperCase()] : [],
                onlyNew: isNew === 'true',
            };
        },
        resetFilters: (state) => {
            state.filters = initialFilters;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWatches.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWatches.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchWatches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Đã có lỗi xảy ra';
            });
    },
});

export const {
    toggleFilterOption,
    setOnlyNew,
    setSortBy,
    setSearchQuery,
    syncFiltersFromUrl,
    resetFilters,
} = productSlice.actions;

export default productSlice.reducer;