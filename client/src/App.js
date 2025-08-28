import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Home from "./Pages/Home/Home";
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
import Profile from "./Pages/Profile/Profile";
import Error from "./Pages/Error";
import Tshirts from "./Pages/Tshirts/Tshirts";
import Jeans from "./Pages/Jeans/Jeans";
import Dresses from "./Pages/Dresses/Dresses";
import Blouses from "./Pages/Blouses/Blouses";
import Shoes from "./Pages/Shoes/Shoes";
import Bags from "./Pages/Bags/Bags";
import Accessories from "./Pages/Accessories/Accessories";
import Promotions from "./Pages/Promotions/Promotions";
import TotalLook from "./Pages/TotalLook/TotalLook";
import Info from "./Pages/Info/Info";
import Cart from "./Pages/Cart/Cart";
import AdminPanel from "./Pages/Admin/AdminPanel";
import AddProduct from "./Pages/Admin/AddProduct";
import EditProduct from "./Pages/Admin/EditProduct";
import Checkout from "./Pages/Checkout/Checkout";
import OrderConfirmation from "./Components/OrderConfirmation/OrderConfirmation";
import MyOrders from "./Pages/Orders/MyOrders";
import OrderDetail from "./Pages/Orders/OrderDetail";


import { current } from "./JS/Actions/user";

import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import LoginPanel from "./Components/LoginPanel";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();
  const [showLogin, setShowLogin] = useState(false);

  // compteur panier (somme des quantités)
  const cartCount = useSelector(
    (state) =>
      state.cart?.items?.reduce((sum, it) => sum + (it?.quantity || 0), 0) || 0
  );

  const user = useSelector((state) => state.user?.user);
  const isAuth = useSelector((state) => state.user?.isAuth); // ✅ ajout pour protéger les routes

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) dispatch(current());
  }, [dispatch]);

  return (
    <div className="App">
      <NavBar cartCount={cartCount} onLoginClick={() => setShowLogin(true)} />
      {showLogin && (
        <LoginPanel show={showLogin} onClose={() => setShowLogin(false)} />
      )}
<ToastContainer
  position="top-right"
  autoClose={2000}
  hideProgressBar={false}
  newestOnTop
  closeOnClick
  pauseOnHover
  draggable
  theme="colored"
  containerStyle={{ top: 70, right: 16, zIndex: 2147483647 }} // 👈 important
/>


      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tshirts" element={<Tshirts />} />
          <Route path="/jeans" element={<Jeans />} />
          <Route path="/dresses" element={<Dresses />} />
          <Route path="/blouses" element={<Blouses />} />
          <Route path="/shoes" element={<Shoes />} />
          <Route path="/bags" element={<Bags />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/total-look" element={<TotalLook />} />
          <Route path="/info" element={<Info />} />
          <Route path="/cart" element={<Cart />} />

          {/* ✅ routes protégées */}
          <Route
            path="/checkout"
            element={isAuth ? <Checkout /> : <Login />}
          />
          <Route
            path="/order-confirmation"
            element={isAuth ? <OrderConfirmation /> : <Login />}
          />
         <Route path="/my-orders" element={<MyOrders />} />
         <Route path="/order/:id" element={<OrderDetail />} />

          {/* Route admin protégée */}
          <Route
            path="/admin"
            element={user?.isAdmin ? <AdminPanel user={user} /> : <Login />}
          />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/*" element={<Error />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
