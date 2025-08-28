import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [load, setLoad] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/api/orders/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data || []);
      } catch (e) { setErr(e?.response?.data || e.message); }
      finally { setLoad(false); }
    })();
  }, []);

  if (load) return <div>Chargement…</div>;
  if (err) return <div>Erreur : {String(err?.error || err)}</div>;

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
              <th>Numéro</th><th>Date</th><th>Total</th><th>Statut</th><th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id}>
                <td>{o._id}</td>
                <td>{new Date(o.createdAt || o.placedAt).toLocaleString()}</td>
                <td>{fmt(o.total)} DT</td>
                <td>{o.status}</td>
                <td><Link to={`/order/${o._id}`}>Voir</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
