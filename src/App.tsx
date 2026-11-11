
import './App.css';
import { Routes, Route } from 'react-router-dom';
import MainLayout from "./layouts/MainLayout.tsx";
import { Login, Register, GuestVao, AuthGuard } from "./features/auth";
import HomePage from "./pages/HomePage.tsx";
import { AccountLayout, PersonalInfor, OrderList } from "./features/account";
import {Dashboard} from "./features/account/components/Dashboard.tsx";
import {Wishlist} from "./features/account/components/Wishlist.tsx";
import CartPage from "./features/cart/components/CartPage.tsx";
import {useAppDispatch} from "./hooks/hooks.ts";
import {useEffect} from "react";
import {initAuth} from "./features/auth/authSlice.ts";
import {Checkout} from "./features/checkout";
import ProductDetail from "./features/product/components/ProductDetail.tsx";

function App() {

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(initAuth());
    }, [dispatch]);

  return (
    <>
      <Routes>
          <Route element={<MainLayout/>}>
              <Route path="/" element={<HomePage/>} />

              <Route path="/products/:id" element={<ProductDetail />} />

              <Route element={<AuthGuard />}>
                  <Route path="/cart" element={<CartPage/>} />
                  <Route path="/account" element={<AccountLayout/>}>
                    <Route index element={<Dashboard/>}></Route>
                    <Route path="personal-info" element={<PersonalInfor/>}></Route>
                    <Route path="orders" element={<OrderList />} />
                    <Route path="wishlist" element={<Wishlist />} />
                  </Route>

                  <Route path="/checkout" element={<Checkout />} />
              </Route>
          </Route>

          <Route element={<GuestVao />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
          </Route>

          <Route path="*" element={<p>404 - Không tìm thấy trang</p>} />
      </Routes>
    </>
  )
}

export default App
