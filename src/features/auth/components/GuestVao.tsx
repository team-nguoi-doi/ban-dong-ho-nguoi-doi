import {useAppSelector} from "../../../hooks/hooks.ts";
import {Navigate, Outlet, useLocation} from "react-router-dom";
// trang này là đăng nhập xong đi vào trang nào đó hoặc home (đổi trạng thái)

export default function GuestVao() {
    const { isInitialized, isAuthenticated } = useAppSelector((state) => state.auth);
    const location = useLocation();
    if (!isInitialized) {
        return <p>Đang tải...</p>
    }

    if(isAuthenticated) {
        const from = location.state?.from?.pathname ?? '/';
        return <Navigate to={from} replace={true} />;
    }

    return <Outlet/>;
}