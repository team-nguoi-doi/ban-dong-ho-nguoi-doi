import { Link } from 'react-router-dom';
import logo from '../../../assets/images/header-logo/viren-logo.png';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__inner">
                <div className="footer__brand">
                    <img src={logo} alt="Viren Watch" className="footer__logo" />
                    <p className="footer__tagline">
                        Đồng hồ chính hãng, thiết kế tinh tế cho mọi khoảnh khắc.
                    </p>
                </div>

                <nav className="footer__col" aria-label="Sản phẩm">
                    <h4 className="footer__heading">Sản phẩm</h4>
                    <Link to="/products">Tất cả đồng hồ</Link>
                    <Link to="/products?gender=HIM">Đồng hồ nam</Link>
                    <Link to="/products?gender=HER">Đồng hồ nữ</Link>
                    <Link to="/products?isNew=true">Hàng mới về</Link>
                </nav>

                <nav className="footer__col" aria-label="Tài khoản">
                    <h4 className="footer__heading">Tài khoản</h4>
                    <Link to="/account">Tài khoản của tôi</Link>
                    <Link to="/account/orders">Đơn hàng</Link>
                    <Link to="/account/wishlist">Yêu thích</Link>
                    <Link to="/cart">Giỏ hàng</Link>
                </nav>

                <div className="footer__col">
                    <h4 className="footer__heading">Liên hệ</h4>
                    <span>Hotline: 0123 456 789</span>
                    <span>Email: support@virenwatch.vn</span>
                    <span>8:00 - 21:00, Thứ 2 - Chủ nhật</span>
                </div>
            </div>

            <div className="footer__bottom">
                © {new Date().getFullYear()} Viren Watch. All rights reserved.
            </div>
        </footer>
    );
}
