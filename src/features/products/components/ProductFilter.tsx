import { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { toggleFilterOption, setOnlyNew, resetFilters } from '../productSlice';
import type { Watch, FilterCategory } from '../utils/types';

interface ProductFilterProps {
    watches: Watch[];
}

interface FilterGroupConfig {
    key: FilterCategory;
    label: string;
    formatLabel?: (val: string) => string;
}

const FILTER_GROUPS: FilterGroupConfig[] = [
    {
        key: 'gender',
        label: 'GENDER',
        formatLabel: (val) =>
            val.toUpperCase() === 'HIM'
                ? "Men's Watches (Him)"
                : val.toUpperCase() === 'HER'
                    ? "Women's Watches (Her)"
                    : val,
    },
    { key: 'collection', label: 'COLLECTION' },
    { key: 'caseMaterial', label: 'CASE MATERIAL' },
    { key: 'watchShape', label: 'WATCH SHAPE' },
    { key: 'movement', label: 'MOVEMENT' },
    { key: 'strapMaterial', label: 'STRAP MATERIAL' },
    { key: 'dialColor', label: 'DIAL COLOR' },
];

export default function ProductFilter({ watches }: ProductFilterProps) {
    const dispatch = useAppDispatch();
    const filters = useAppSelector((state) => state.products.filters);

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        gender: true,
        collection: true,
        caseMaterial: true,
        watchShape: false,
        movement: false,
        strapMaterial: false,
        dialColor: false,
    });

    const toggleSection = (key: string) => {
        setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const dynamicFacets = useMemo(() => {
        const result: Record<FilterCategory, { value: string; count: number }[]> = {
            gender: [],
            collection: [],
            caseMaterial: [],
            watchShape: [],
            movement: [],
            strapMaterial: [],
            dialColor: [],
        };

        FILTER_GROUPS.forEach(({ key }) => {
            const counts = new Map<string, number>();
            watches.forEach((watch) => {
                const rawVal = watch[key];
                if (rawVal && rawVal.trim() !== '') {
                    const normalized = rawVal.toUpperCase();
                    counts.set(normalized, (counts.get(normalized) || 0) + 1);
                }
            });
            result[key] = Array.from(counts.entries()).map(([value, count]) => ({
                value,
                count,
            }));
        });

        return result;
    }, [watches]);

    const hasActiveFilters =
        filters.onlyNew ||
        FILTER_GROUPS.some(({ key }) => filters[key].length > 0);

    return (
        <aside className="product-filter">
            <div className="product-filter__header">
                <span className="product-filter__heading">FILTER BY</span>
                {hasActiveFilters && (
                    <button
                        type="button"
                        className="product-filter__clear"
                        onClick={() => dispatch(resetFilters())}
                    >
                        Clear all
                    </button>
                )}
            </div>

            <div className="product-filter__group">
                <label className="product-filter__checkbox">
                    <input
                        type="checkbox"
                        checked={filters.onlyNew}
                        onChange={(e) => dispatch(setOnlyNew(e.target.checked))}
                    />
                    <span>
                        New Arrivals ({watches.filter((w) => w.isNew).length})
                    </span>
                </label>
            </div>

            {FILTER_GROUPS.map(({ key, label, formatLabel }) => {
                const options = dynamicFacets[key];
                if (options.length === 0) return null;

                return (
                    <div key={key} className="product-filter__group">
                        <button
                            type="button"
                            className="product-filter__accordion-btn"
                            onClick={() => toggleSection(key)}
                        >
                            <span>{label}</span>
                            <span className="product-filter__icon">
                                {openSections[key] ? '−' : '+'}
                            </span>
                        </button>

                        {openSections[key] && (
                            <div className="product-filter__options">
                                {options.map((opt) => (
                                    <label
                                        key={opt.value}
                                        className="product-filter__checkbox"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={filters[key].includes(opt.value)}
                                            onChange={() =>
                                                dispatch(
                                                    toggleFilterOption({
                                                        category: key,
                                                        value: opt.value,
                                                    })
                                                )
                                            }
                                        />
                                        <span>
                                            {formatLabel
                                                ? formatLabel(opt.value)
                                                : opt.value}{' '}
                                            <small className="product-filter__count">
                                                ({opt.count})
                                            </small>
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </aside>
    );
}