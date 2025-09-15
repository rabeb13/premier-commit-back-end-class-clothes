import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProducts, deleteProduct } from "../../JS/Actions/product";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import axios from "axios";

const AdminPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { listProducts } = useSelector((state) => state.product);

  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");

  // Commandes
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);

  // Modale détails
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filtres date
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const auth = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };
  const ALLOWED_STATUS = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

  useEffect(() => {
    if (user === null) return;

    if (!user?.isAdmin) {
      navigate("/");
      return;
    }

    Promise.all([
      dispatch(getProducts()),
      axios
        .get("/api/orders", auth)
        .then(({ data }) => setOrders(data || []))
        .catch((e) => setOrdersError(e?.response?.data || e.message))
        .finally(() => setOrdersLoading(false)),
    ]).finally(() => setLoading(false));
  }, [dispatch, user, navigate]);

  const handleDeleteProduct = (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    dispatch(deleteProduct(id))
      .then(() => dispatch(getProducts()))
      .catch((err) => console.error(err));
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.patch(`/api/orders/${orderId}/status`, { status }, auth);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));
    } catch (e) {
      alert(e?.response?.data?.error || "Impossible de changer le statut");
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Supprimer définitivement cette commande ?")) return;
    try {
      await axios.delete(`/api/orders/${orderId}`, auth);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (e) {
      alert(e?.response?.data?.error || "Suppression impossible");
    }
  };

  const fmt = (n) => Number(n || 0).toFixed(2);

  // ✅ Helpers avec fallback: shippingAddress (nouveau) → userInfo (ancien) → userId
  const addrOf = (o) => o?.shippingAddress || o?.userInfo || {};
  const clientName = (o) => addrOf(o).name || o?.userId?.name || "—";
  const clientPhone = (o) => addrOf(o).phone || o?.userId?.phone || "—";
  const clientEmail = (o) => o?.userId?.email || "—";
  const clientAddress = (o) => {
    const a = addrOf(o);
    const parts = [a.address, a.city, a.zip || a.postalCode].filter(Boolean);
    return parts.length ? parts.join(", ") : "—";
  };

  const lineImage = (i) =>
    i?.image || i?.productId?.images?.[0]?.url || i?.productId?.images?.[0] || "";

  const openOrderModal = (o) => { setSelectedOrder(o); setShowOrderModal(true); };
  const closeOrderModal = () => { setSelectedOrder(null); setShowOrderModal(false); };

  const filteredProducts = categoryFilter
    ? (listProducts || []).filter(
        (p) => p.category?.toLowerCase() === categoryFilter.toLowerCase()
      )
    : listProducts;

  const filteredOrders = useMemo(() => {
    if (!orders?.length) return [];
    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo) : null;
    if (to) to.setHours(23, 59, 59, 999);
    return orders.filter((o) => {
      const d = new Date(o.createdAt || o.placedAt);
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }, [orders, dateFrom, dateTo]);

  const isLoadingAll = user === null || loading;

  return (
    <div className="admin-dashboard">
      {isLoadingAll ? (
        <p>Chargement utilisateur et produits...</p>
      ) : (
        <>
          {/* Sidebar */}
          <aside className="sidebar">
            <h2 className="logo">Admin</h2>
            <nav>
              <ul>
                <li onClick={() => setCategoryFilter("")}>📦 Tous les produits</li>
                <li onClick={() => setCategoryFilter("tshirts")}>👕 Tshirts</li>
                <li onClick={() => setCategoryFilter("jeans")}>👖 Jeans</li>
                <li onClick={() => setCategoryFilter("dresses")}>👗 Dresses</li>
                <li onClick={() => setCategoryFilter("shoes")}>👟 Shoes</li>
                <li onClick={() => setCategoryFilter("accessories")}>👜 Accessories</li>
              </ul>
            </nav>
          </aside>

          {/* Main */}
          <div className="main">
            {/* Header */}
<header className="header">
  <h1>Tableau de bord</h1>
  <div>
    <button onClick={() => navigate("/add-product")} className="add-btn">
      + Ajouter un produit
    </button>
    {/* 👇 Nouveau bouton minimal */}
    <button
      onClick={() => navigate("/admin/bulk-products")}
      className="add-btn"
      style={{ marginLeft: 8 }}
    >
      ⚡ Ajout / Modif en masse
    </button>
  </div>
</header>


            {/* Produits */}
            <div className="content">
              <h2>Produits</h2>
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Catégorie</th>
                    <th>Prix</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(filteredProducts || []).map((p) => (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td>{Number(p.price).toFixed(1)} DT</td>
                      <td>
                        <button
                          onClick={() => navigate(`/edit-product/${p._id}`)}
                          className="edit-btn"
                        >
                          ✏ Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id)}
                          className="delete-btn"
                        >
                          🗑 Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!filteredProducts || filteredProducts.length === 0) && (
                    <tr>
                      <td colSpan="4">Aucun produit trouvé</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Commandes */}
            <div className="content" style={{ marginTop: 32 }}>
              <h2>Commandes</h2>

              {/* Filtres par date */}
              <div
                className="filters-row"
                style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}
              >
                <div>
                  <label>Du</label>
                  <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                </div>
                <div>
                  <label>Au</label>
                  <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                </div>
                <button className="edit-btn" onClick={() => { setDateFrom(""); setDateTo(""); }}>
                  Réinitialiser
                </button>
              </div>

              {ordersLoading ? (
                <p>Chargement des commandes…</p>
              ) : ordersError ? (
                <p style={{ color: "red" }}>Erreur : {String(ordersError?.error || ordersError)}</p>
              ) : filteredOrders.length === 0 ? (
                <p>Aucune commande pour ce filtre.</p>
              ) : (
                <table className="product-table">
                  <thead>
                    <tr>
                      <th>Numéro</th>
                      <th>Date</th>
                      <th>Client</th>
                      <th>Téléphone</th>
                      <th>Adresse</th>
                      <th>Produits</th>
                      <th>Total</th>
                      <th>Statut</th>
                      <th>Changer statut</th>
                      <th>Détails</th>
                      <th>Supprimer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((o) => (
                      <tr key={o._id}>
                        <td>{o._id}</td>
                        <td>{new Date(o.createdAt || o.placedAt).toLocaleString()}</td>
                        <td>{clientName(o)}</td>
                        <td>{clientPhone(o)}</td>
                        <td style={{ maxWidth: 260, whiteSpace: "normal" }}>{clientAddress(o)}</td>
                        <td style={{ maxWidth: 360, whiteSpace: "normal" }}>
                          {(o?.items || [])
                            .map((i) => `${i?.name || i?.productId?.name || "Produit"} x${i?.quantity || 0}`)
                            .join(", ")}
                        </td>
                        <td>{fmt(o.total)} DT</td>
                        <td>{o.status}</td>
                        <td>
                          <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}>
                            {ALLOWED_STATUS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <button className="edit-btn" onClick={() => openOrderModal(o)}>
                            👁️ Détails
                          </button>
                        </td>
                        <td>
                          <button className="delete-btn" onClick={() => deleteOrder(o._id)}>
                            🗑
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Modale détails commande */}
          {showOrderModal && selectedOrder && (
            <div className="modal-backdrop" onClick={closeOrderModal}>
              <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Détails commande #{selectedOrder._id}</h3>
                  <button className="delete-btn" onClick={closeOrderModal}>✕</button>
                </div>

                <div className="modal-section">
                  <h4>Client</h4>
                  <p><strong>Nom :</strong> {clientName(selectedOrder)}</p>
                  <p><strong>Email :</strong> {clientEmail(selectedOrder)}</p>
                  <p><strong>Téléphone :</strong> {clientPhone(selectedOrder)}</p>
                  <p><strong>Adresse :</strong> {clientAddress(selectedOrder)}</p>
                </div>

                <div className="modal-section">
                  <h4>Produits</h4>
                  <table className="product-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Produit</th>
                        <th>Couleur</th>
                        <th>Taille</th>
                        <th>Qté</th>
                        <th>Prix</th>
                        <th>Sous-total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedOrder.items || []).map((i, idx) => (
                        <tr key={i._id || idx}>
                          <td>
                            {lineImage(i) ? (
                              <img
                                src={lineImage(i)}
                                alt={i?.name || i?.productId?.name || "Produit"}
                                style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }}
                              />
                            ) : "—"}
                          </td>
                          <td>{i?.name || i?.productId?.name || "—"}</td>
                          <td>{i?.color || "—"}</td>
                          <td>{i?.size || "—"}</td>
                          <td>{i?.quantity || 0}</td>
                          <td>{fmt(i?.price)} DT</td>
                          <td>{fmt((i?.price || 0) * (i?.quantity || 0))} DT</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="modal-footer">
                  <strong>Total : {fmt(selectedOrder.total)} DT</strong>
                  <button className="add-btn" onClick={closeOrderModal}>Fermer</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPanel;
