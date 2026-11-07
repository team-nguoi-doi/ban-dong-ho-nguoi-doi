import {useAppSelector} from "../../../hooks/hooks.ts";
import {Navigate, Outlet, useLocation} from "react-router-dom";
// truy cập vào chức năng nhưng chưa đăng nhập thì chuyển tới login và lưu trang hiện tại

export default function AuthGuard() {
    const { isInitialized, isAuthenticated } = useAppSelector((state) => state.auth);
    const location = useLocation();
    if (!isInitialized) {
        return <p>Đang tải...</p>
    }

    if(!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet/>;
}