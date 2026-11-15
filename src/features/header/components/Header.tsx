import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import logo from '../../../assets/images/header-logo/viren-logo.png'
import './Header.css'
import {useAppDispatch, useAppSelector} from "../../../hooks/hooks.ts";
import {Link} from "react-router-dom";
import {logout} from "../../auth/authSlice.ts";

export type Page = 'home' | 'login' | 'register' | 'contact' | 'favorites' | 'cart'

type HeaderProps = {
    cartCount?: number
    transparent?: boolean // true: trong suốt đè lên ảnh hero (dùng cho trang chủ)
    onNavigate?: (page: Page) => void
    onSearch?: (keyword: string) => void
}

const POPULAR_SEARCHES = ['Đồng hồ nam', 'Đồng hồ nữ', 'Đồng hồ cơ', 'Dây da', 'Dây kim loại']

function Header({ cartCount = 0, transparent = false, onSearch }: HeaderProps) {
    const [searchOpen, setSearchOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false) // menu tài khoản (icon hình người)
    const [keyword, setKeyword] = useState('')
    const [scrolled, setScrolled] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const accountRef = useRef<HTMLDivElement>(null)

    // dùng dispatch và lấy state
    const dispatch = useAppDispatch();
    const { isInitialized, isAuthenticated, user } = useAppSelector((state) => state.auth);

    // Cuộn xuống một chút thì header chuyển sang nền trắng
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10)
        handleScroll()
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Mở ô tìm kiếm thì tự focus; nhấn Esc thì đóng
    useEffect(() => {
        if (!searchOpen) return
        inputRef.current?.focus()
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSearchOpen(false)
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [searchOpen])

    // Mở menu tài khoản: bấm ra ngoài hoặc nhấn Esc thì đóng
    useEffect(() => {
        if (!menuOpen) return
        const handleClick = (e: MouseEvent) => {
            if (!accountRef.current?.contains(e.target as Node)) setMenuOpen(false)
        }
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMenuOpen(false)
        }
        document.addEventListener('mousedown', handleClick)
        window.addEventListener('keydown', handleKey)
        return () => {
            document.removeEventListener('mousedown', handleClick)
            window.removeEventListener('keydown', handleKey)
        }
    }, [menuOpen])

    const submitSearch = (value: string) => {
        const text = value.trim()
        if (!text) return
        onSearch?.(text)
        setSearchOpen(false)
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        submitSearch(keyword)
    }

    // Trong suốt chỉ khi: bật transparent, chưa cuộn, chưa mở ô tìm kiếm / menu tài khoản
    const overlay = transparent && !scrolled && !searchOpen && !menuOpen

    // Đóng ô tìm kiếm và menu tài khoản (dùng khi chuyển trang)
    const closeAll = () => {
        setSearchOpen(false);
        setMenuOpen(false);
    }

    // xử lý logout
    function handleLogout() {
        closeAll();
        dispatch(logout());
    }

    return (
        <header className={`header ${transparent ? 'header--float' : ''} ${overlay ? 'header--overlay' : ''}`}>
            <div className="header__main">
                <div className="header__top">
                    {/* Logo ở góc trái */}
                    <Link to="/" onClick={closeAll} className="header__logo" aria-label="Viren Watch - Trang chủ">
                        <img src={logo} alt="" className="header__logo-img" />
                        <span className="header__logo-text">VIREN WATCH</span>
                    </Link>

                    {/* Các nút bên phải */}
                    <nav className="header__side--right" aria-label="Tài khoản">
                        <button
                            type="button"
                            className="header__icon-btn"
                            aria-label="Tìm kiếm"
                            aria-expanded={searchOpen}
                            onClick={() => {
                                setMenuOpen(false)
                                setSearchOpen((open) => !open)
                            }}
                        >
                            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                                <circle cx="11" cy="11" r="7" />
                                <path d="M20 20l-4-4" />
                            </svg>
                        </button>

                        <Link to="/contact" onClick={closeAll} className="header__icon-btn" aria-label="Liên hệ" title="Liên hệ">
                            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor"
                                 strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <rect x="3" y="5" width="18" height="14" rx="2" />
                                <path d="M3 7l9 6 9-6" />
                            </svg>
                        </Link>

                        {isInitialized && isAuthenticated && (
                            <>
                                <Link to="/account/wishlist" onClick={closeAll} className="header__icon-btn" aria-label="Yêu thích" title="Yêu thích">
                                    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                                        <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
                                    </svg>
                                </Link>
                                <Link to="/cart" onClick={closeAll} className="header__icon-btn header__icon-btn--cart" aria-label={`Giỏ hàng, ${cartCount} sản phẩm`} title="Giỏ hàng">
                                    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
                                        <path d="M5 8h14l-1 12H6L5 8z" />
                                        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                                    </svg>
                                    {cartCount > 0 && <span className="header__badge">{cartCount}</span>}
                                </Link>
                            </>
                        )}

                        {/* Icon hình người: chứa Đăng nhập / Đăng ký (hoặc tài khoản khi đã đăng nhập) */}
                        {isInitialized && (
                            <div className="header__account" ref={accountRef}>
                                <button
                                    type="button"
                                    className={`header__icon-btn ${isAuthenticated ? 'header__icon-btn--user' : ''}`}
                                    aria-label="Tài khoản"
                                    aria-haspopup="menu"
                                    aria-expanded={menuOpen}
                                    title="Tài khoản"
                                    onClick={() => {
                                        setSearchOpen(false)
                                        setMenuOpen((open) => !open)
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                                    </svg>
                                </button>

                                {menuOpen && (
                                    <div className="header__menu" role="menu">
                                        {isAuthenticated ? (
                                            <>
                                                <p className="header__menu-hello">Xin chào,</p>
                                                <p className="header__menu-name">{user?.fullName}</p>
                                                <Link to="/account" onClick={closeAll} className="header__menu-item" role="menuitem">Tài khoản của tôi</Link>
                                                <Link to="/account/orders" onClick={closeAll} className="header__menu-item" role="menuitem">Đơn hàng</Link>
                                                <Link to="/account/wishlist" onClick={closeAll} className="header__menu-item" role="menuitem">Yêu thích</Link>
                                                <button type="button" className="header__menu-btn header__menu-btn--outline" onClick={handleLogout} role="menuitem">
                                                    Đăng xuất
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <p className="header__menu-title">Chào mừng đến VIREN WATCH</p>
                                                <p className="header__menu-desc">Đăng nhập để theo dõi đơn hàng, yêu thích và giỏ hàng của bạn.</p>
                                                <Link to="/login" onClick={closeAll} className="header__menu-btn header__menu-btn--primary" role="menuitem">
                                                    Đăng nhập
                                                </Link>
                                                <Link to="/register" onClick={closeAll} className="header__menu-btn header__menu-btn--outline" role="menuitem">
                                                    Đăng ký
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </nav>
                </div>
            </div>

            {/* Ô tìm kiếm xổ xuống toàn chiều ngang */}
            <div className={`header__search ${searchOpen ? 'header__search--open' : ''}`} aria-hidden={!searchOpen}>
                <form className="header__search-form" onSubmit={handleSubmit} role="search">
                    <input
                        ref={inputRef}
                        type="search"
                        className="header__search-input"
                        placeholder="Bạn đang tìm mẫu đồng hồ nào?"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        tabIndex={searchOpen ? 0 : -1}
                    />
                    <button type="button" className="header__search-close" onClick={() => setSearchOpen(false)} tabIndex={searchOpen ? 0 : -1}>
                        Đóng
                    </button>
                </form>

                <div className="header__suggest">
                    <p className="header__suggest-title">Tìm kiếm phổ biến</p>
                    <ul className="header__suggest-list">
                        {POPULAR_SEARCHES.map((item) => (
                            <li key={item}>
                                <button type="button" className="header__suggest-item" onClick={() => submitSearch(item)} tabIndex={searchOpen ? 0 : -1}>
                                    {item}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {searchOpen && <div className="header__overlay" onClick={() => setSearchOpen(false)} />}
        </header>
    )
}

export default Header
