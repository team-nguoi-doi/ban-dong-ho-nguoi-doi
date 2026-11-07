
import './App.css';
import { Routes, Route } from 'react-router-dom';
import MainLayout from "./layouts/MainLayout.tsx";
import { Login, Register } from "./features/auth";
import HomePage from "./pages/HomePage.tsx";
import { AccountLayout, PersonalInfor, OrderList } from "./features/account";
import {Dashboard} from "./features/account/components/Dashboard.tsx";
import {Wishlist} from "./features/account/components/Wishlist.tsx";

function App() {

  return (
    <>
      <Routes>
          <Route element={<MainLayout/>}>
              <Route path="/" element={<HomePage/>} />

              <Route path="/account" element={<AccountLayout/>}>
                <Route index element={<Dashboard/>}></Route>
                <Route path="personal-info" element={<PersonalInfor/>}></Route>
                <Route path="orders" element={<OrderList />} />
                <Route path="wishlist" element={<Wishlist />} />
              </Route>
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="*" element={<p>404 - Không tìm thấy trang</p>} />
      </Routes>
    </>
  )
}

export default App
