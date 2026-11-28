import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../product/util/types.ts';
import HomeProductCard from './HomeProductCard';

export default function ProductShowcase() {
    const [products, setProducts] = useState<Product[]>([]);
    const [activeTab, setActiveTab] = useState<'new' | 'best-seller'>('new');
    const [scrollProgress, setScrollProgress] = useState<number>(0);
    const [visibleRatio, setVisibleRatio] = useState<number>(1);

    const sliderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch('http://localhost:3001/watches')
            .then((res) => res.json())
            .then((data: Product[]) => {
                setProducts(data);
                setTimeout(() => handleScroll(), 100);
            })
            .catch((err) => console.error('Lỗi tải sản phẩm:', err));
    }, []);

    const filteredProducts =
        activeTab === 'new'
            ? products.filter((p) => p.isNew)
            : products.filter((p) => !p.isNew);

    const handleScroll = () => {
        if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            const totalScroll = scrollWidth - clientWidth;

            if (scrollWidth > 0) {
                setVisibleRatio(clientWidth / scrollWidth);
            }
            setScrollProgress(totalScroll > 0 ? scrollLeft / totalScroll : 0);
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
            setTimeout(() => handleScroll(), 50);
        }
    };

    const progressWidth = Math.min(100, Math.max(10, visibleRatio * 100));
    const progressLeft = scrollProgress * (100 - progressWidth);

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
                    <HomeProductCard key={product.id} product={product} />
                ))}
            </div>

            <div className="product-showcase__controls">
                <div className="product-showcase__progress-bar">
                    <div
                        className="product-showcase__progress-fill"
                        style={{
                            width: `${progressWidth}%`,
                            left: `${progressLeft}%`,
                            transition: 'left 0.1s ease-out, width 0.3s ease',
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

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <Link
                    to="/products"
                    style={{
                        color: 'var(--color-text)\'',
                        textDecoration: 'none',
                        borderBottom: '1px solid var(--color-text)',
                        paddingBottom: '3px',
                        fontSize: '1.1rem',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                    }}
                >
                    View all watches
                </Link>
            </div>
        </section>
    );
}