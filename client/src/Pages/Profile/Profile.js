// src/Pages/Profile/Profile.jsx
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import './Profile.css';
import { UPDATE_USER, CURRENT_USER } from '../../JS/ActionsType/user';
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userRedux = useSelector((state) => state.user.user);
  const [user, setUser] = useState(userRedux || null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name:'', email:'', phone:'', address:'', city:'', zip:'' });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { if (mounted) setLoading(false); return; }

        const res = await axios.get('/api/user/current', { headers: { Authorization: `Bearer ${token}` } });
        const currentUser = res.data; // ✅ user direct
        if (mounted && currentUser) {
          setUser(currentUser);
          setFormData({
            name: currentUser.name || '',
            email: currentUser.email || '',
            phone: currentUser.phone || '',
            address: currentUser.address || '',
            city: currentUser.city || '',
            zip: currentUser.zip || '',
          });
          dispatch({ type: CURRENT_USER, payload: currentUser }); // ✅ garde le store aligné
        }
      } catch (err) {
        if (err?.response?.status === 401) localStorage.removeItem('token');
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [dispatch]);

  if (loading) return null;
  if (!localStorage.getItem('token')) return <Navigate to="/login" />;
  if (!user) return null;

      const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

      const handleSubmit = async () => {
      try {
      const token = localStorage.getItem('token');
      const res = await axios.put('/api/user/update', formData, { headers: { Authorization: `Bearer ${token}` } });
      const updatedUser = res.data?.user; // ✅ backend renvoie { user }
      alert(res.data?.msg || 'Profil mis à jour');
      setUser(updatedUser);
      dispatch({ type: UPDATE_USER, payload: updatedUser });
      setEditMode(false);
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la mise à jour');
    }
  };

       return (
      <div className="profile-page">
      <h1>Bienvenue {user.name}</h1>

      {editMode ? (
        <div className="profile-form">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Nom" />
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Téléphone" />
          <input name="address" value={formData.address} onChange={handleChange} placeholder="Adresse" />
          <input name="city" value={formData.city} onChange={handleChange} placeholder="Ville" />
          <input name="zip" value={formData.zip} onChange={handleChange} placeholder="Code postal" />
          <button onClick={handleSubmit}>Enregistrer</button>
          <button onClick={() => setEditMode(false)}>Annuler</button>
        </div>
      ) : (
        <div className="profile-details">
          <p><strong>Email :</strong> {user.email}</p>
          <p><strong>Téléphone :</strong> {user.phone || 'Non renseigné'}</p>
          <p><strong>Adresse :</strong> {user.address || 'Non renseignée'}</p>
          <p><strong>Ville :</strong> {user.city || 'Non renseignée'}</p>
          <p><strong>Code postal :</strong> {user.zip || 'Non renseigné'}</p>

          <button onClick={() => setEditMode(true)}>Modifier mes coordonnées</button>
          <div className="profile-actions" style={{ marginBottom: 12 }}>
          <button
          className="btn orders-btn"
          onClick={() => navigate("/my-orders")}
          >
        🧾 Mes commandes
        </button>
        </div>

        </div>
        
      )}
    </div>
  );
};

export default Profile;
