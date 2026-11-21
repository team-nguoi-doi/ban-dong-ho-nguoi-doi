import { Outlet } from "react-router-dom";
import { Header } from "../features/header";
import {selectedCartQuantity} from "../features/cart/CartSlice.ts";
import { useAppSelector } from "../hooks/hooks.ts";
import ToastContainer from "../features/toast/components/ToastContainer.tsx";

export default function MainLayout() {
    const cartCount = useAppSelector(selectedCartQuantity);

    return (
        <>
            <Header cartCount={cartCount} />
            <main>
                <Outlet/>
            </main>
            <ToastContainer />
        </>
    )
}
