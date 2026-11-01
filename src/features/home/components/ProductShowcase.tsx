import { useState, useRef } from 'react';

import imageHomeNew1 from '../../../assets/images/home-new/home-new-1.avif';
import imageHomeNew2 from '../../../assets/images/home-new/home-new-2.avif';
import imageHomeNew3 from '../../../assets/images/home-new/home-new-3.avif';
import imageHomeNew4 from '../../../assets/images/home-new/home-new-4.avif';
import imageHomeNew5 from '../../../assets/images/home-new/home-new-5.avif';
import imageHomeNew6 from '../../../assets/images/home-new/home-new-6.avif';
import imageHomeNew7 from '../../../assets/images/home-new/home-new-7.avif';
import imageHomeNew8 from '../../../assets/images/home-new/home-new-8.avif';
import imageHomeNew9 from '../../../assets/images/home-new/home-new-9.avif';

export interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    image: string;
    isNew?: boolean;
    category: 'new' | 'best-seller';
}

const DUMMY_PRODUCTS: Product[] = [
    {
        id: 1,
        name: 'HYDROCONQUEST',
        description: '42 mm - Automatic watch - Stainless steel and ceramic bezel',
        price: 'CHF 1,950.00',
        image: imageHomeNew1,
        isNew: true,
        category: 'new',
    },
    {
        id: 2,
        name: 'HYDROCONQUEST',
        description: '42 mm - Automatic watch - Stainless steel and ceramic bezel',
        price: 'CHF 1,950.00',
        image: imageHomeNew2,
        isNew: true,
        category: 'new',
    },
    {
        id: 3,
        name: 'HYDROCONQUEST',
        description: '42 mm - Quartz watch - Stainless steel',
        price: 'CHF 1,300.00',
        image: imageHomeNew3,
        isNew: true,
        category: 'new',
    },
    {
        id: 4,
        name: 'LONGINES LEGEND DIVER',
        description: '42 mm - Automatic watch - Stainless steel',
        price: 'CHF 3,400.00',
        image: imageHomeNew4,
        isNew: true,
        category: 'new',
    },
    {
        id: 5,
        name: 'SERPENTI TUBOGAS',
        description: '35 mm - Quartz watch - Single-spiral steel curve',
        price: 'CHF 6,200.00',
        image: imageHomeNew5,
        isNew: false,
        category: 'best-seller',
    },
    {
        id: 6,
        name: 'HYDROCONQUEST',
        description: '42 mm - Automatic watch - Stainless steel and ceramic bezel',
        price: 'CHF 1,950.00',
        image: imageHomeNew6,
        isNew: true,
        category: 'best-seller',
    },
    {
        id: 7,
        name: 'HYDROCONQUEST',
        description: '42 mm - Quartz watch - Stainless steel',
        price: 'CHF 1,300.00',
        image: imageHomeNew7,
        isNew: true,
        category: 'best-seller',
    },
    {
        id: 8,
        name: 'LONGINES LEGEND DIVER',
        description: '42 mm - Automatic watch - Stainless steel',
        price: 'CHF 3,400.00',
        image: imageHomeNew8,
        isNew: true,
        category: 'best-seller',
    },
    {
        id: 9,
        name: 'SERPENTI TUBOGAS',
        description: '35 mm - Quartz watch - Single-spiral steel curve',
        price: 'CHF 6,200.00',
        image: imageHomeNew9,
        isNew: false,
        category: 'best-seller',
    },
];

export default function ProductShowcase() {
    const [activeTab, setActiveTab] = useState<'new' | 'best-seller'>('new');
    const [scrollProgress, setScrollProgress] = useState<number>(0);

    const sliderRef = useRef<HTMLDivElement>(null);

    const filteredProducts = DUMMY_PRODUCTS.filter(
        (product) => product.category === activeTab
    );

    const handleScroll = () => {
        if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            const totalScroll = scrollWidth - clientWidth;
            if (totalScroll > 0) {
                const progress = (scrollLeft / totalScroll) * 100;
                setScrollProgress(progress);
            } else {
                setScrollProgress(0);
            }
        }
    };

    const handleSlide = (direction: 'prev' | 'next') => {
        if (sliderRef.current) {
            const scrollAmount = sliderRef.current.clientWidth;
            sliderRef.current.scrollBy({
                left: direction === 'next' ? scrollAmount : -scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const handleTabChange = (tab: 'new' | 'best-seller') => {
        setActiveTab(tab);
        setScrollProgress(0);
        if (sliderRef.current) {
            sliderRef.current.scrollLeft = 0;
        }
    };

    return (
        <section className="product-showcase">
            <div className="product-showcase__tabs">
                <button
                    className={`product-showcase__tab-btn ${
                        activeTab === 'new' ? 'product-showcase__tab-btn--active' : ''
                    }`}
                    onClick={() => handleTabChange('new')}
                >
                    NEW
                </button>
                <button
                    className={`product-showcase__tab-btn ${
                        activeTab === 'best-seller' ? 'product-showcase__tab-btn--active' : ''
                    }`}
                    onClick={() => handleTabChange('best-seller')}
                >
                    BEST SELLERS
                </button>
            </div>

            <div
                ref={sliderRef}
                onScroll={handleScroll}
                className="product-showcase__slider-track"
            >
                {filteredProducts.map((product) => (
                    <div key={product.id} className="product-card">
                        <div className="product-card__image-box">
                            {product.isNew && (
                                <span className="product-card__badge">New</span>
                            )}
                            <img
                                src={product.image}
                                alt={product.name}
                                className="product-card__image"
                            />
                        </div>
                        <div className="product-card__info">
                            <h3 className="product-card__title">{product.name}</h3>
                            <p className="product-card__description">{product.description}</p>
                            <span className="product-card__price">{product.price}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="product-showcase__controls">
                <div className="product-showcase__progress-bar">
                    <div
                        className="product-showcase__progress-fill"
                        style={{
                            width: '25%',
                            left: `${scrollProgress * 0.75}%`,
                        }}
                    />
                </div>

                <div className="product-showcase__nav-btns">
                    <button
                        onClick={() => handleSlide('prev')}
                        className="product-showcase__nav-btn"
                        aria-label="Previous Products"
                    >
                        ❮
                    </button>
                    <button
                        onClick={() => handleSlide('next')}
                        className="product-showcase__nav-btn"
                        aria-label="Next Products"
                    >
                        ❯
                    </button>
                </div>
            </div>
        </section>
    );
}