import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Checkout.css";
import { clearCart } from "../../JS/Actions/cart";

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items = [] } = useSelector((state) => state.cart || {});
  const user = useSelector((state) => state.user.user);      // objet utilisateur
  const token = useSelector((state) => state.user.token);    // token JWT

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    delivery: "standard",
    payment: "cash",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const fmt = (n) => Number(n || 0).toFixed(2);
  const itemTotal = (it) => (it.price || it.productId?.price || 0) * (it.quantity || 0);
  const grandTotal = items.reduce((sum, it) => sum + itemTotal(it), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.city || !form.phone) {
      toast.error("Veuillez remplir tous les champs obligatoires !");
      return;
    }
const order = {
  userId: user?._id || "guest",
  items,
  total: grandTotal,
  delivery: form.delivery,
  paymentMethod: form.payment,
  status: "pending",
  shippingAddress: {
    name: form.name,
    phone: form.phone,
    address: form.address,
    city: form.city,
    zip: form.postalCode,
  },
};

try {
  const res = await axios.post("orders/my", order, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });

  // ✅ pas de toast ici, juste vider le panier et rediriger
  dispatch(clearCart());

  setTimeout(() =>
  navigate("/order-confirmation", {
    state: { order: { ...res.data, shippingAddress: order.shippingAddress, items }, justConfirmed: true },
  }),
2000);





    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la création de la commande");
    }
  };

  return (
    <div className="checkout-wrap">
      <ToastContainer position="top-right" autoClose={2000} />
      <h2>Checkout / Validation de commande</h2>

      <div className="checkout-grid">
        {/* Résumé panier */}
        <div className="checkout-cart">
          <h3>Résumé du panier</h3>
          {items.length === 0 ? (
            <p>Votre panier est vide.</p>
          ) : (
            <>
              {items.map((it) => (
                <div
                  key={`${it._id}-${it.color}-${it.size}`}
                  className="checkout-item"
                >
                  <img
                    src={it.image || it.productId?.images?.[0]?.url || ""}
                    alt={it.name || it.productId?.name || "Produit"}
                    className="checkout-img"
                  />
                  <div>
                    <p>{it.name || it.productId?.name || "Produit"}</p>
                    <p>
                      {it.color || "-"} • {it.size || "-"}
                    </p>
                    <p>
                      {it.quantity} × {fmt(it.price || it.productId?.price)} DT ={" "}
                      {fmt(itemTotal(it))} DT
                    </p>
                  </div>
                </div>
              ))}
              <div className="checkout-total">
                Total général : <strong>{fmt(grandTotal)} DT</strong>
              </div>
            </>
          )}
        </div>

        {/* Formulaire infos client */}
        <div className="checkout-form">
          <h3>Vos informations</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Nom et prénom"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Adresse"
              value={form.address}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="city"
              placeholder="Ville"
              value={form.city}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Code postal"
              value={form.postalCode}
              onChange={handleChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Téléphone"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <select
              name="delivery"
              value={form.delivery}
              onChange={handleChange}
            >
              <option value="standard">Livraison standard</option>
              <option value="express">Livraison express</option>
              <option value="pickup">Retrait en magasin</option>
            </select>

            <select name="payment" value={form.payment} onChange={handleChange}>
              <option value="cash">Paiement à la livraison En Espèces</option>
            </select>

            <button type="submit" className="confirm-btn">
              Confirmer la commande
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
