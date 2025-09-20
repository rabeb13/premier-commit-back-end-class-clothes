import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Utilisateur non authentifié");

        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/orders/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(data || []);
      } catch (err) {
        setError(err?.response?.data?.error || err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Chargement…</div>;
  if (error) return <div className="error">Erreur : {error}</div>;

  const fmt = (n) => Number(n || 0).toFixed(2);

  return (
    <div className="my-orders">
      <h2>Mes commandes</h2>
      {orders.length === 0 ? (
        <div>Aucune commande pour l’instant.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Numéro</th>
              <th>Date</th>
              <th>Total</th>
              <th>Statut</th>
              <th>Détails</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{o._id}</td>
                <td>{new Date(o.createdAt || o.placedAt).toLocaleString()}</td>
                <td>{fmt(o.total)} DT</td>
                <td>{o.status || "En attente"}</td>
                <td>
                  <Link to={`/order/${o._id}`}>Voir</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
