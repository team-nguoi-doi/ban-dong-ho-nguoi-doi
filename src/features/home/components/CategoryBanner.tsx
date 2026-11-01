import menWatchImage from '../../../assets/images/home-category/men-watches.avif';
//import womenWatchImage from '../../../assets/images/home-category/women-watches.avif';
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
        linkUrl: '/collections/men',
    },
    {
        id: 2,
        title: "Women's Watches",
        linkText: 'Shop now',
        image: womenWatchImage1,
        linkUrl: '/collections/women',
    },
];

export default function CategoryBanner() {
    return (
        <section className="category-banner">
            {CATEGORY_LIST.map((item) => (
                <div key={item.id} className="category-banner__item">
                    <img
                        src={item.image}
                        alt={item.title}
                        className="category-banner__image"
                    />

                    <div className="category-banner__overlay" />

                    <div className="category-banner__content">
                        <h2 className="category-banner__title">{item.title}</h2>
                        <a href={item.linkUrl} className="category-banner__link">
                            {item.linkText}
                        </a>
                    </div>
                </div>
            ))}
        </section>
    );
}