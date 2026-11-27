import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Watch } from '../../products';
import HomeProductCard from './HomeProductCard';

const COLLECTIONS = ['SERPENTI', 'OCTO FINISSIMO', 'BVLGARI ALUMINIUM'] as const;

export default function CollectionShowcase() {
    const [activeCol, setActiveCol] = useState<string>('SERPENTI');
    const [products, setProducts] = useState<Watch[]>([]);

    useEffect(() => {
        fetch('http://localhost:3001/watches')
            .then((res) => res.json())
            .then((data: Watch[]) => setProducts(data))
            .catch((err) => console.error('Lỗi tải bộ sưu tập:', err));
    }, []);

    const filtered = products.filter((item) => item.collection === activeCol);

    return (
        <section className="product-showcase" style={{ paddingTop: '4rem' }}>
            <div className="product-showcase__tabs">
                {COLLECTIONS.map((col) => (
                    <button
                        key={col}
                        className={`product-showcase__tab-btn ${
                            activeCol === col ? 'product-showcase__tab-btn--active' : ''
                        }`}
                        onClick={() => setActiveCol(col)}
                    >
                        {col}
                    </button>
                ))}
            </div>

            <div className="product-showcase__slider-track">
                {filtered.map((product) => (
                    <HomeProductCard key={product.id} product={product} />
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <Link
                    to={`/products?collection=${encodeURIComponent(activeCol)}`}
                    style={{
                        color: '#1a1a1a',
                        textDecoration: 'none',
                        borderBottom: '1px solid #1a1a1a',
                        paddingBottom: '3px',
                        fontSize: '1.1rem',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                    }}
                >
                    View all {activeCol}
                </Link>
            </div>
        </section>
    );
}