import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./features/auth/AuthContext";
import { CartProvider } from "./features/cart/CartContext";
import Layout from "./components/Layout";
import Home from "./features/shop/Home";
import ProductList from "./features/shop/ProductList";
import ProductDetail from "./features/shop/ProductDetail";
import CartPage from "./features/cart/CartPage";
import CheckoutPage from "./features/shop/CheckoutPage";
import Login from "./features/auth/Login";
import Profile from "./features/auth/Profile";
import AdminDashboard from "./features/admin/AdminDashboard";
import Chatbot from "./features/chat/Chatbot";
import OrderTracking from "./features/orders/OrderTracking";
import PrescriptionUpload from "./features/orders/PrescriptionUpload";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/" />;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<ProductList />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="cart" element={<CartPage />} />
              
              <Route path="checkout" element={
                <PrivateRoute>
                  <CheckoutPage />
                </PrivateRoute>
              } />
              
              <Route path="profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />

              <Route path="prescription" element={
                <PrivateRoute>
                  <PrescriptionUpload />
                </PrivateRoute>
              } />

              <Route path="tracking/:id" element={
                <PrivateRoute>
                  <OrderTracking />
                </PrivateRoute>
              } />
            </Route>

            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
          </Routes>
          <Chatbot />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
