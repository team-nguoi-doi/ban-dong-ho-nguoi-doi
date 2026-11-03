
import { Outlet } from "react-router-dom";
import { Header } from "../features/header";

export default function MainLayout() {
    return (
        <>
            <Header isLoggedIn={false} />
            <main>
                <Outlet/>
            </main>
        </>
    )
}