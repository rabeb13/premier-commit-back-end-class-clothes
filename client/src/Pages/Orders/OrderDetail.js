import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(data);
    })();
  }, [id]);

  if (!order) return <div>Chargement…</div>;
  const fmt = (n) => Number(n||0).toFixed(2);

  return (
    <div>
      <h2>Commande {order._id}</h2>
      <p>Statut : {order.status}</p>
      <div>
        {order.items.map(i => (
          <div key={i._id}>
            {i.name} x{i.quantity} — {fmt(i.price*i.quantity)} DT
          </div>
        ))}
      </div>
      <strong>Total : {fmt(order.total)} DT</strong>
    </div>
  );
}
