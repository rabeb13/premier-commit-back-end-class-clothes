import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProducts, deleteProduct } from "../../JS/Actions/product";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const AdminPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user); // ✅ user depuis redux
  const { listProducts } = useSelector((state) => state.product);

  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    if (user === null) return;

    // 🚨 sécurité : si pas admin -> retour à l’accueil
    if (!user?.isAdmin) {
      navigate("/");
      return;
    }

    // 🔄 récupérer produits
    dispatch(getProducts()).finally(() => setLoading(false));
  }, [dispatch, user, navigate]);

  const handleDelete = (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    dispatch(deleteProduct(id))
      .then(() => dispatch(getProducts()))
      .catch((err) => console.error(err));
  };

  if (user === null || loading) {
    return <p>Chargement utilisateur et produits...</p>;
  }

  // ✅ filtrage par catégorie
  const filteredProducts = categoryFilter
    ? listProducts?.filter(
        (p) => p.category?.toLowerCase() === categoryFilter.toLowerCase()
      )
    : listProducts;

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Admin</h2>
        <nav>
          <ul>
            <li onClick={() => setCategoryFilter("")}>📦 Tous les produits</li>
            <li onClick={() => setCategoryFilter("tshirts")}>👕 Tshirts</li>
            <li onClick={() => setCategoryFilter("jeans")}>👖 Jeans</li>
            <li onClick={() => setCategoryFilter("dresses")}>👗 Dresses</li>
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <div className="main">
        {/* Header */}
        <header className="header">
          <h1>Tableau de bord</h1>
          <div>
            <button
              onClick={() => navigate("/add-product")}
              className="add-btn"
            >
              + Ajouter un produit
            </button>
          </div>
        </header>

        {/* Table */}
        <div className="content">
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
              {filteredProducts?.map((p) => (
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
                      onClick={() => handleDelete(p._id)}
                      className="delete-btn"
                    >
                      🗑 Supprimer
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts?.length === 0 && (
                <tr>
                  <td colSpan="4">Aucun produit trouvé</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
