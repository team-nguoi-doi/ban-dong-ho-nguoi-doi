import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import logo from '../../../assets/images/header-logo/viren-logo.png'
import './Header.css'
import {useAppDispatch, useAppSelector} from "../../../hooks/hooks.ts";
import {Link, useNavigate} from "react-router-dom";
import {logout} from "../../auth/authSlice.ts";
import {fetchWatches} from "../../products";
import {formatPrice} from "../../cart/utils/format.ts";

export type Page = 'home' | 'login' | 'register' | 'contact' | 'favorites' | 'cart'

type HeaderProps = {
    cartCount?: number
    transparent?: boolean
    onNavigate?: (page: Page) => void
}

function Header({ cartCount = 0, transparent = false }: HeaderProps) {
    const [searchOpen, setSearchOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [keyword, setKeyword] = useState('')
    const [scrolled, setScrolled] = useState(false)

    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const saved = localStorage.getItem('theme');
        if (saved === 'light' || saved === 'dark') return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const inputRef = useRef<HTMLInputElement>(null)
    const accountRef = useRef<HTMLDivElement>(null)
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isInitialized, isAuthenticated, user } = useAppSelector((state) => state.auth);
    const watches = useAppSelector((state) => state.products.items);
    const popularWatches = watches.slice(0, 4);
    useEffect(() => {
        if (searchOpen && watches.length === 0) dispatch(fetchWatches());
    }, [searchOpen, watches.length, dispatch]);
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10)
        handleScroll()
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    useEffect(() => {
        if (!searchOpen) return
        inputRef.current?.focus()
        document.body.style.overflow = 'hidden'
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSearchOpen(false)
        }
        window.addEventListener('keydown', handleKey)
        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', handleKey)
        }
    }, [searchOpen])
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
        navigate(`/products?search=${encodeURIComponent(text)}`)
        setSearchOpen(false)
        setKeyword('')
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        submitSearch(keyword)
    }
    const overlay = transparent && !scrolled && !searchOpen && !menuOpen
    const closeAll = () => {
        setSearchOpen(false);
        setMenuOpen(false);
    }
    function handleLogout() {
        closeAll();
        dispatch(logout());
    }

    return (
        <header className={`header ${transparent ? 'header--float' : ''} ${overlay ? 'header--overlay' : ''}`}>
            <div className="header__main">
                <div className="header__top">
                    <Link to="/" onClick={closeAll} className="header__logo" aria-label="Viren Watch - Trang chủ">
                        <img src={logo} alt="" className="header__logo-img" />
                        <span className="header__logo-text">VIREN WATCH</span>
                    </Link>
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

                        <button
                            type="button"
                            className="header__icon-btn"
                            onClick={toggleTheme}
                            aria-label={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
                            title={theme === 'dark' ? 'Giao diện sáng' : 'Giao diện tối'}
                        >
                            {theme === 'dark' ? (
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <circle cx="12" cy="12" r="4" />
                                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            )}
                        </button>

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
            {searchOpen && (
                <div className="search-panel" role="dialog" aria-modal="true" aria-label="Tìm kiếm">
                    <button type="button" className="search-panel__close" onClick={() => setSearchOpen(false)} aria-label="Đóng tìm kiếm">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                            <path d="M5 5l14 14M19 5L5 19" />
                        </svg>
                    </button>

                    <div className="search-panel__inner">
                        <h2 className="search-panel__title">Bạn đang tìm gì?</h2>

                        <form className="search-panel__form" onSubmit={handleSubmit} role="search">
                            <div className="search-panel__field">
                                <input
                                    ref={inputRef}
                                    type="search"
                                    className="search-panel__input"
                                    placeholder="Tìm kiếm"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                                    <circle cx="11" cy="11" r="7" />
                                    <path d="M20 20l-4-4" />
                                </svg>
                            </div>
                            <button type="submit" className="search-panel__submit" disabled={!keyword.trim()}>
                                Tìm kiếm
                            </button>
                        </form>

                        <div className="search-panel__heading">
                            <h3>Tìm kiếm phổ biến</h3>
                        </div>

                        <ul className="search-panel__grid">
                            {popularWatches.map((w) => (
                                <li key={w.id}>
                                    <Link to={`/products/${w.id}`} onClick={closeAll} className="search-card">
                                        {w.isNew && <span className="search-card__tag">Mới</span>}
                                        <img src={w.images[0]} alt={w.name} />
                                        <p className="search-card__name">{w.name}</p>
                                        <p className="search-card__price">{formatPrice(w.price)}</p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Header
