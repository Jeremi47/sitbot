import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import BuyerDashboardPage from './pages/BuyerDashboardPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import CreateProductPage from './pages/CreateProductPage';
import CheckoutPage from './pages/CheckoutPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="*"
              element={
                <>
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/catalog" element={<CatalogPage />} />
                      <Route path="/discord" element={<CatalogPage />} />
                      <Route path="/chrome" element={<CatalogPage />} />
                      <Route path="/twitch" element={<CatalogPage />} />
                      <Route path="/product/:id" element={<ProductDetailPage />} />
                      <Route path="/checkout/:id" element={<CheckoutPage />} />
                      <Route path="/dashboard/buyer" element={<BuyerDashboardPage />} />
                      <Route path="/dashboard/seller" element={<SellerDashboardPage />} />
                      <Route path="/dashboard/seller/create" element={<CreateProductPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
