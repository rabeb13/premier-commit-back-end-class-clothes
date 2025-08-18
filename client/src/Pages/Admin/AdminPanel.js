import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProducts, deleteProduct } from "../../JS/Actions/product";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const AdminPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { listProducts } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/"); // pas admin → redirect
      return;
    }
    dispatch(getProducts()).finally(() => setLoading(false));
  }, [dispatch, user, navigate]);

  const handleDelete = (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    dispatch(deleteProduct(id)).then(() => dispatch(getProducts()));
  };

  return (
    <div className="admin-page">
      <h2>Admin Panel</h2>
      <button onClick={() => navigate("/add-product")} className="add-btn">
        + Ajouter un produit
      </button>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listProducts?.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.price} DT</td>
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
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPanel;
