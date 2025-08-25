import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

import "./App.css";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import CheckOut from "./pages/Checkout";
import Products from "./pages/Products";
import ProtectedRoute from "./ProtectedRoute";
function App() {
  return (
    <Router>
      <Routes>
        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/sign_up" element={<SignUp />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:productID" element={<ProductDetail />} />
        <Route path="/products" element={<Products />} />

        {/* member routes */}
        <Route element={<ProtectedRoute role="member" />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/check_out/:productID?" element={<CheckOut />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
