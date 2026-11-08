import { Outlet } from "react-router-dom";
import { Header } from "../features/header";
import { selectCartCount } from "../features/cart/CartSlice.ts";
import { useAppSelector } from "../hooks/hooks.ts";

export default function MainLayout() {
    const cartCount = useAppSelector(selectCartCount);

    return (
        <>
            <Header cartCount={cartCount} />
            <main>
                <Outlet/>
            </main>
        </>
    )
}
