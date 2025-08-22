import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./OrderConfirmation.css";

export default function OrderConfirmation() {
  const location = useLocation();
  const { order } = location.state || {}; // récupérer les infos envoyées depuis Checkout

  if (!order) {
    return (
      <div className="order-confirm-wrap">
        <h2>Aucune commande trouvée</h2>
        <Link to="/" className="back-home-btn">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  const fmt = (n) => Number(n || 0).toFixed(2);

  return (
    <div className="order-confirm-wrap">
      <h2>Commande confirmée ✔</h2>
      <p>
        Merci pour votre commande,{" "}
        <strong>{order.userInfo?.name || "client"}</strong> !
      </p>

      <div className="order-summary">
        <p>
          Numéro de commande : <strong>{order._id || "N/A"}</strong>
        </p>
        <p>
          Total : <strong>{fmt(order.total)}</strong> DT
        </p>
        <p>
          Livraison : <strong>{order.delivery || "N/A"}</strong>
        </p>
        <p>
          Paiement :{" "}
          <strong>
            {order.paymentMethod === "cash"
              ? "En espèces"
              : order.paymentMethod || "N/A"}
          </strong>
        </p>
      </div>

      <h3>Résumé de votre panier :</h3>
      <div className="order-items">
        {order.items?.length > 0 ? (
          order.items.map((it, i) => (
            <div key={i} className="order-item">
              <img
                src={it.image || it.productId?.images?.[0]?.url || ""}
                alt={it.productId?.name || "Produit"}
                className="order-item-img"
              />
              <div className="order-item-info">
                <p>{it.productId?.name || "Produit supprimé"}</p>
                <p>
                  {it.color || "N/A"} • {it.size || "N/A"}
                </p>
                <p>
                  {it.quantity || 0} × {fmt(it.productId?.price)} DT ={" "}
                  {fmt((it.productId?.price || 0) * (it.quantity || 0))} DT
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>Votre panier était vide ou les produits ont été supprimés.</p>
        )}
      </div>

      <Link to="/" className="back-home-btn">
        Retour à l'accueil
      </Link>
    </div>
  );
}
