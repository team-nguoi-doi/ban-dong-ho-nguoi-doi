import { useState} from 'react';

import bannerImage2 from '../../../assets/banner/hero-banner-2.avif';
import bannerImage4 from '../../../assets/banner/hero-banner-4.avif';
import bannerImage5 from '../../../assets/banner/hero-banner-5.avif';
import bannerImage6 from '../../../assets/banner/hero-banner-6.png';
import bannerImage7 from '../../../assets/banner/hero-banner-7.avif';
import bannerVideo3 from '../../../assets/banner/hero-banner-video-3.mp4';
import bannerVideo4 from '../../../assets/banner/hero-banner-video-4.mp4';

interface BannerItem {
    id: number;
    type: 'video' | 'image';
    src: string;
    title: string;
    subtitle: string;
    fitMode?: 'cover' | 'contain';
}

const BANNER_LIST: BannerItem[] = [
    {
        id: 1,
        type: 'video',
        src: bannerVideo3,
        title: 'SERPENTI TUBOGAS',
        subtitle: 'Biểu tượng của sự quyến rũ và xa xỉ',
    },
    {
        id: 2,
        type: 'video',
        src: bannerVideo4,
        title: 'SERPENTI TUBOGAS',
        subtitle: 'Biểu tượng của sự quyến rũ và xa xỉ',
    },
    {
        id: 3,
        type: 'image',
        src: bannerImage2,
        title: 'SERPENTI TUBOGAS',
        subtitle: 'Biểu tượng của sự quyến rũ và xa xỉ',
    },
    {
        id: 5,
        type: 'image',
        src: bannerImage4,
        title: 'SERPENTI TUBOGAS',
        subtitle: 'Biểu tượng của sự quyến rũ và xa xỉ',
    },
    {
        id: 6,
        type: 'image',
        src: bannerImage5,
        title: 'SERPENTI TUBOGAS',
        subtitle: 'Biểu tượng của sự quyến rũ và xa xỉ',
    },
    {
        id: 7,
        type: 'image',
        src: bannerImage6,
        title: 'SERPENTI TUBOGAS',
        subtitle: 'Biểu tượng của sự quyến rũ và xa xỉ',
        fitMode: 'contain',
    },
    {
        id: 8,
        type: 'image',
        src: bannerImage7,
        title: 'SERPENTI TUBOGAS',
        subtitle: 'Biểu tượng của sự quyến rũ và xa xỉ',
        fitMode: 'contain',
    },

];

export default function HomeBanner() {
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === BANNER_LIST.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? BANNER_LIST.length - 1 : prevIndex - 1
        );
    };



    const currentBanner = BANNER_LIST[currentIndex];

    const mediaClassName = `hero-banner__media ${
        currentBanner.fitMode === 'contain' ? 'hero-banner__media--contain' : ''
    }`;

    return (
        <div className="hero-banner-wrapper">
            <div className="hero-banner">
                {currentBanner.type === 'video' ? (
                    <video
                        key={currentBanner.id}
                        src={currentBanner.src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className={mediaClassName}
                    />
                ) : (
                    <img
                        key={currentBanner.id}
                        src={currentBanner.src}
                        alt={currentBanner.title}
                        className={mediaClassName}
                    />
                )}

                <div className="hero-banner__overlay" />

                <button
                    onClick={handlePrev}
                    className="hero-banner__btn hero-banner__btn--prev"
                    aria-label="Previous Slide"
                >
                    ❮
                </button>

                <button
                    onClick={handleNext}
                    className="hero-banner__btn hero-banner__btn--next"
                    aria-label="Next Slide"
                >
                    ❯
                </button>

                <div className="hero-banner__dots">
                    {BANNER_LIST.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`hero-banner__dot ${
                                currentIndex === index ? 'hero-banner__dot--active' : ''
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}