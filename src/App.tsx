
import './App.css';
import { Routes, Route } from 'react-router-dom';
import MainLayout from "./layouts/MainLayout.tsx";
import { Login, Register } from "./features/auth";
import HomePage from "./pages/HomePage.tsx";

function App() {

  return (
    <>
      <Routes>
          <Route element={<MainLayout/>}>
              <Route path="/" element={<HomePage/>} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="*" element={<p>404 - Không tìm thấy trang</p>} />
      </Routes>
    </>
  )
}

export default App
