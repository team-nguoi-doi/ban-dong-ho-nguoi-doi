import { HomeBanner, ProductShowcase, CategoryBanner, CollectionShowcase, CampaignVideoBanner} from "../features/home";

export default function HomePage() {
    return (
        <>
            <HomeBanner />
            <ProductShowcase />
            <CategoryBanner />
            <CampaignVideoBanner />
            <CollectionShowcase />
        </>
    )
}