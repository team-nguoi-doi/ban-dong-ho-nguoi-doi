import { Link } from 'react-router-dom';
import menWatchImage from '../../../assets/images/home-category/men-watches.avif';
import womenWatchImage1 from '../../../assets/images/home-category/women-watches-1.avif';

interface CategoryItem {
    id: number;
    title: string;
    linkText: string;
    image: string;
    linkUrl: string;
}

const CATEGORY_LIST: CategoryItem[] = [
    {
        id: 1,
        title: "Men's Watches",
        linkText: 'Shop now',
        image: menWatchImage,
        linkUrl: '/products?gender=HIM',
    },
    {
        id: 2,
        title: "Women's Watches",
        linkText: 'Shop now',
        image: womenWatchImage1,
        linkUrl: '/products?gender=HER',
    },
];

export default function CategoryBanner() {
    return (
        <section className="category-banner">
            {CATEGORY_LIST.map((item) => (
                <Link
                    key={item.id}
                    to={item.linkUrl}
                    className="category-banner__item"
                >
                    <img
                        src={item.image}
                        alt={item.title}
                        className="category-banner__image"
                    />

                    <div className="category-banner__overlay" />

                    <div className="category-banner__content">
                        <h2 className="category-banner__title">{item.title}</h2>
                        <span className="category-banner__link">
                            {item.linkText}
                        </span>
                    </div>
                </Link>
            ))}
        </section>
    );
}