
import './App.css'
import Login from "./features/auth/components/Login.tsx";
import HomeBanner from "./features/home/components/HomeBanner.tsx";
import ProductShowcase from "./features/home/components/ProductShowcase.tsx";
import CategoryBanner from "./features/home/components/CategoryBanner.tsx";

function App() {

  return (
    <>
      <div className="app-container">
        <Login />
        <HomeBanner/>
        <ProductShowcase />
        <CategoryBanner/>
      </div>
    </>
  )
}

export default App
