import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import './Profile.css';
import { UPDATE_USER } from '../../JS/ActionsType/user';

const Profile = () => {
  const dispatch = useDispatch();
  const userRedux = useSelector((state) => state.user.user);

  const [user, setUser] = useState(userRedux || null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
  });

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          if (mounted) setLoading(false);
          return;
        }

        const res = await axios.get('/api/user/current', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const currentUser = res.data?.user || res.data;

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
          dispatch({ type: UPDATE_USER, payload: currentUser });
        }
      } catch (err) {
        // Si 401 ou autre: nettoyer éventuellement le token
        if (err?.response?.status === 401) {
          localStorage.removeItem('token');
        }
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUser();
    return () => { mounted = false; };
  }, [dispatch]);

  // Attendre le fetch avant de décider
  if (loading) return null;

  // Si pas de token, forcer la connexion
  if (!localStorage.getItem('token')) {
    return <Navigate to="/login" />;
  }

  // Encore en cours d’hydratation ? on peut afficher un skeleton si besoin
  if (!user) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('/api/user/update', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = res.data?.user || res.data;
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
        </div>
      )}
    </div>
  );
};

export default Profile;
