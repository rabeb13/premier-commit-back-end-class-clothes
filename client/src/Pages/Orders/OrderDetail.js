import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Utilisateur non authentifié");

        const { data } = await axios.get(
          `/orders/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrder(data);
      } catch (err) {
        setError(err?.response?.data?.error || err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <div>Chargement…</div>;
  if (error) return <div className="error">Erreur : {error}</div>;
  if (!order) return <div>Aucune commande trouvée.</div>;

  const fmt = (n) => Number(n || 0).toFixed(2);

  return (
    <div className="order-detail">
      <h2>Commande {order._id}</h2>
      <p>Statut : {order.status || "En attente"}</p>

      <div className="order-items">
        {order.items.map((i) => (
          <div key={i._id} className="order-item">
            {i.name} x{i.quantity} — {fmt(i.price * i.quantity)} DT
          </div>
        ))}
      </div>

      <strong>Total : {fmt(order.total)} DT</strong>
    </div>
  );
}
