import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./ui/Home";
import Menu from "./menu/Menu";
import DishDetail from "./menu/DishDetail";
import Cart from "./cart/Cart";
import { CartProvider } from "./cart/CartProvider";
import { AuthProvider } from "./auth/AuthProvider";
import RequireAuth from "./auth/RequireAuth";
import SignIn from "./auth/SignIn";
import NotFound from "./ui/NotFound";
import ErrorBoundary from "./ui/ErrorBoundary";
import "./css/style.css";

const Checkout = lazy(() => import("./checkout/Checkout"));

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={<p>Loading page...</p>}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="menu" element={<Menu />} />
                  <Route path="menu/:id" element={<DishDetail />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="signin" element={<SignIn />} />
                  <Route element={<RequireAuth />}>
                    <Route path="checkout" element={<Checkout />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </CartProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
