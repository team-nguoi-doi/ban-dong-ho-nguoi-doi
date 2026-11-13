import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import {
    ProductCard,
    ProductFilter,
    fetchWatches,
    setSortBy,
    setSearchQuery,
    syncFiltersFromUrl,
    resetFilters,
} from '../features/products';
import '../features/products/components/Products.css';

import allWatchesBanner from '../assets/banner/plp-banner/all-watches.avif';
import menWatchesBanner from '../assets/banner/plp-banner/men-watches-banner.avif';
import womenWatchesBanner from '../assets/banner/plp-banner/women-watches-banner.avif';

export default function ProductListPage() {
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();
    const { items, loading, error, filters } = useAppSelector((state) => state.products);

    useEffect(() => {
        if (items.length === 0) {
            dispatch(fetchWatches());
        }
    }, [dispatch, items.length]);

    useEffect(() => {
        dispatch(
            syncFiltersFromUrl({
                gender: searchParams.get('gender'),
                collection: searchParams.get('collection'),
                isNew: searchParams.get('isNew'),
            })
        );
    }, [dispatch, searchParams]);

    const filteredWatches = useMemo(() => {
        let result = [...items];

        if (filters.onlyNew) {
            result = result.filter((w) => w.isNew);
        }
        if (filters.gender.length > 0) {
            result = result.filter((w) =>
                filters.gender.includes(w.gender?.toUpperCase())
            );
        }
        if (filters.collection.length > 0) {
            result = result.filter((w) =>
                filters.collection.includes(w.collection?.toUpperCase())
            );
        }
        if (filters.caseMaterial.length > 0) {
            result = result.filter((w) =>
                filters.caseMaterial.includes(w.caseMaterial?.toUpperCase())
            );
        }
        if (filters.watchShape.length > 0) {
            result = result.filter((w) =>
                w.watchShape
                    ? filters.watchShape.includes(w.watchShape.toUpperCase())
                    : false
            );
        }
        if (filters.movement.length > 0) {
            result = result.filter((w) =>
                filters.movement.includes(w.movement?.toUpperCase())
            );
        }
        if (filters.strapMaterial.length > 0) {
            result = result.filter((w) =>
                w.strapMaterial
                    ? filters.strapMaterial.includes(w.strapMaterial.toUpperCase())
                    : false
            );
        }
        if (filters.dialColor.length > 0) {
            result = result.filter((w) =>
                w.dialColor
                    ? filters.dialColor.includes(w.dialColor.toUpperCase())
                    : false
            );
        }
        if (filters.searchQuery.trim() !== '') {
            const q = filters.searchQuery.toLowerCase();
            result = result.filter(
                (w) =>
                    w.name.toLowerCase().includes(q) ||
                    w.collection.toLowerCase().includes(q)
            );
        }

        if (filters.sortBy === 'price-asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (filters.sortBy === 'price-desc') {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [items, filters]);

    const pageTitle = useMemo(() => {
        if (filters.collection.length === 1) return filters.collection[0];
        if (filters.gender.length === 1) {
            return filters.gender[0] === 'HIM' ? "MEN'S WATCHES" : "WOMEN'S WATCHES";
        }
        if (filters.onlyNew) return 'NEW ARRIVALS';
        return 'ALL WATCHES';
    }, [filters]);

    const heroBannerImage = useMemo(() => {
        if (filters.gender.length === 1) {
            return filters.gender[0] === 'HIM' ? menWatchesBanner : womenWatchesBanner;
        }
        return allWatchesBanner;
    }, [filters.gender]);

    const isWideBanner = filters.gender.length === 1;

    return (
        <main className="plp-page">
            <header className={`plp-hero ${isWideBanner ? 'plp-hero--wide' : ''}`}>
                <img
                    src={heroBannerImage}
                    alt={pageTitle}
                    className="plp-hero__bg"
                />
                <div className="plp-hero__overlay" />
                <div className="plp-hero__content">
                    <p className="plp-hero__eyebrow">HAUTE HORLOGERIE</p>
                    <h1 className="plp-hero__title">{pageTitle}</h1>
                    <p className="plp-hero__subtitle">
                        Discover timeless craftsmanship and iconic Italian design.
                    </p>
                </div>
            </header>

            <div className="plp-toolbar">
                <span className="plp-toolbar__count">
                    {filteredWatches.length}{' '}
                    {filteredWatches.length === 1 ? 'creation' : 'creations'}
                </span>

                <div className="plp-toolbar__controls">
                    <input
                        type="text"
                        placeholder="Search model..."
                        value={filters.searchQuery}
                        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                        className="plp-toolbar__search"
                    />

                    <select
                        value={filters.sortBy}
                        onChange={(e) =>
                            dispatch(
                                setSortBy(
                                    e.target.value as 'default' | 'price-asc' | 'price-desc'
                                )
                            )
                        }
                        className="plp-toolbar__sort"
                    >
                        <option value="default">Sort by: Featured</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                    </select>
                </div>
            </div>

            <div className="plp-layout">
                <ProductFilter watches={items} />

                <section className="plp-content">
                    {loading && <div className="plp-state">Loading timepieces...</div>}
                    {error && <div className="plp-state plp-state--error">{error}</div>}

                    {!loading && !error && filteredWatches.length === 0 && (
                        <div className="plp-state">
                            <p>No timepieces match your selected criteria.</p>
                            <button
                                type="button"
                                className="plp-reset-btn"
                                onClick={() => dispatch(resetFilters())}
                            >
                                Reset All Filters
                            </button>
                        </div>
                    )}

                    {!loading && !error && filteredWatches.length > 0 && (
                        <div className="plp-grid">
                            {filteredWatches.map((watch) => (
                                <ProductCard key={watch.id} watch={watch} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}