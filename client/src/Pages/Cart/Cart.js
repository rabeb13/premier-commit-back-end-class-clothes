import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, updateCartQty, removeCartItem } from "../../JS/Actions/cart";

export default function Cart() {
  const dispatch = useDispatch();
  const { items = [], load, error } = useSelector((s) => s.cart || {});

  React.useEffect(() => {
    dispatch(fetchCart()); // GET /api/cart
  }, [dispatch]);

  const handleQty = (itemId, value) => {
    const qty = Math.max(1, Number(value) || 1);
    dispatch(updateCartQty(itemId, qty)); // PATCH /api/cart/update/:itemId
  };

  const handleRemove = (itemId) => {
    dispatch(removeCartItem(itemId)); // DELETE /api/cart/remove/:itemId
  };

  const total = items.reduce(
    (sum, it) => sum + ((it?.productId?.price || 0) * (it?.quantity || 0)),
    0
  );

  if (load) return <div style={{ padding: 20 }}>Chargement…</div>;
  if (error) return <div style={{ padding: 20, color: "crimson" }}>{String(error)}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 16 }}>Mon Panier</h2>

      {items.length === 0 ? (
        <div>Votre panier est vide.</div>
      ) : (
        <>
          {items.map((it) => (
            <div
              key={it._id}
              style={{
                display: "grid",
                gridTemplateColumns: "90px 1fr 140px 140px",
                gap: 12,
                alignItems: "center",
                borderBottom: "1px solid #eee",
                padding: "12px 0",
              }}
            >
              <div>
                {it.productId?.image && (
                  <img
                    src={it.productId.image}
                    alt={it.productId?.name || ""}
                    style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 8 }}
                  />
                )}
              </div>

              <div>
                <div style={{ fontWeight: 600 }}>{it.productId?.name}</div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  Couleur: {it.color || "-"} • Taille: {it.size || "-"}
                </div>
                <div style={{ marginTop: 4 }}>
                  Prix: <strong>{it.productId?.price ?? 0} DT</strong>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, color: "#666" }}>Quantité</label>
                <input
                  type="number"
                  min={1}
                  value={it.quantity}
                  onChange={(e) => handleQty(it._id, e.target.value)}
                  style={{ width: 80, padding: 6, marginTop: 4 }}
                />
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-end" }}>
                <div style={{ fontWeight: 600 }}>
                  {(it.productId?.price || 0) * (it.quantity || 0)} DT
                </div>
                <button
                  onClick={() => handleRemove(it._id)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid #ddd",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}

          <div style={{ textAlign: "right", marginTop: 18, fontSize: 18, fontWeight: 700 }}>
            Total: {total} DT
          </div>
        </>
      )}
    </div>
  );
}
