import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/hooks.ts";
import { logout } from "../features/auth/authSlice.ts";

export default function AccountLayout() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="account-layout">
            <aside className="account-sidebar">
                <nav className="account-sidebar-nav">
                    <NavLink
                        to="/account"
                        end
                        className={({isActive}) => isActive ? "nav-item active" : "nav-item"}
                    >
                        My dashboard
                    </NavLink>

                    <NavLink
                        to="/account/personal-info"
                        className={({isActive}) => isActive ? "nav-item active" : "nav-item"}
                    >
                        My personal information
                    </NavLink>

                    <NavLink
                        to="/account/address"
                        className={({isActive}) => isActive ? "nav-item active" : "nav-item"}
                    >
                        My addresses
                    </NavLink>

                    <NavLink
                        to="/account/orders"
                        className={({isActive}) => isActive ? "nav-item active" : "nav-item"}
                    >
                        My order list
                    </NavLink>

                    <NavLink
                        to="/account/wishlist"
                        className={({isActive}) => isActive ? "nav-item active" : "nav-item"}
                    >
                        My wishlist
                    </NavLink>

                    <button onClick={handleLogout} className="logout-btn">
                        Log out
                    </button>
                </nav>
            </aside>

            <main className="account-content">
                <Outlet/>
            </main>
        </div>
    );
}

