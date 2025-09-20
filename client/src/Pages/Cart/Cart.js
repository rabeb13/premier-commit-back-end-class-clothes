import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, updateCartQty, removeCartItem } from "../../JS/Actions/cart";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Cart.css";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items = [], load = false, error = null } = useSelector((s) => s.cart || {});
  const isAuth = useSelector((s) => s.user?.isAuth);

  // Charger le panier
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Debug → voir la structure des items
  useEffect(() => {
    if (items.length) console.log("CART ITEMS >>>", items);
  }, [items]);

  // Fonctions de mise à jour quantité
  const inc = (item) => {
    dispatch(updateCartQty(item._id, item.quantity + 1));
    toast.success("Quantité mise à jour ✔");
  };

  const dec = (item) => {
    const nextQty = Math.max(1, item.quantity - 1);
    dispatch(updateCartQty(item._id, nextQty));
    toast.info("Quantité diminuée");
  };

  const onChangeQty = (item, value) => {
    const qty = Math.max(1, Number(value) || 1);
    dispatch(updateCartQty(item._id, qty));
    toast.success("Quantité mise à jour ✔");
  };

  const remove = (item) => {
    dispatch(removeCartItem(item._id));
    toast.warn("Article supprimé du panier");
  };

  // Calculs
  const fmt = (n) => Number(n || 0).toFixed(2);
  const unitPrice = (it) => Number(it.price || it.productId?.price || 0);
  const itemTotal = (it) => unitPrice(it) * (it.quantity || 0);
  const grandTotal = items.reduce((sum, it) => sum + itemTotal(it), 0);

  // Affichage état
  if (load) return <div className="cart-wrap"><div className="cart-status">Chargement…</div></div>;
  if (error) return <div className="cart-wrap"><div className="cart-status error">{String(error)}</div></div>;

  return (
    <div className="cart-wrap">
      <ToastContainer position="top-right" autoClose={1500} hideProgressBar />
      <h2 className="cart-title">Mon Panier</h2>

      {items.length === 0 ? (
        <div className="cart-empty">Votre panier est vide.</div>
      ) : (
        <>
          <div className="cart-list">
            {items.map((it, idx) => (
              <div
                key={`${it._id}-${it.color}-${it.size}-${idx}`}
                className="cart-row"
              >
                <div className="cart-col img">
                  <img
                    src={it.image || it.productId?.images?.[0] || ""}
                    alt={it.name || it.productId?.name || "Produit"}
                    className="cart-img"
                  />
                </div>

                <div className="cart-col info">
                  <div className="cart-name">{it.name || it.productId?.name || "Produit"}</div>
                  <div className="cart-meta">
                    Couleur: {it.color || "-"} • Taille: {it.size || "-"}
                  </div>
                  <div className="cart-price">
                    Prix unitaire : <strong>{fmt(unitPrice(it))} DT</strong>
                  </div>
                </div>

                <div className="cart-col qty">
                  <div className="qty-ctrl">
                    <button className="qty-btn" onClick={() => dec(it)} aria-label="Diminuer">−</button>
                    <input
                      className="qty-input"
                      type="number"
                      min={1}
                      value={it.quantity || 1}
                      onChange={(e) => onChangeQty(it, e.target.value)}
                    />
                    <button className="qty-btn" onClick={() => inc(it)} aria-label="Augmenter">+</button>
                  </div>
                </div>

                <div className="cart-col total">
                  <div className="line-total">{fmt(itemTotal(it))} DT</div>
                  <button className="remove-btn" onClick={() => remove(it)}>Supprimer</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="sum-label">Total</div>
            <div className="sum-value">{fmt(grandTotal)} DT</div>
            <button
              className="checkout-btn"
              onClick={() =>
                !isAuth ? navigate("/login?redirect=/checkout") : navigate("/checkout")
              }
            >
              Passer à la commande
            </button>
          </div>
        </>
      )}
    </div>
  );
}
