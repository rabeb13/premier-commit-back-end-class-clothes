// src/Components/NavBar.jsx
import React, { useState } from 'react';
import { FaBars, FaSearch, FaUser, FaShoppingBag } from 'react-icons/fa';
import { HiOutlineSearch } from "react-icons/hi";     // Heroicons
import { FiSearch } from "react-icons/fi";           // Feather icons
import { User, ShoppingBag } from "lucide-react";

import SideMenu from './SideMenu';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../JS/Actions/user';
import LoginPanel from './LoginPanel';
import './NavBar.css';
const NavBar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth, user } = useSelector((state) => state.user);
  const cartCount = useSelector(
    (state) => state.cart?.items?.reduce((sum, it) => sum + (it?.quantity || 0), 0) || 0
  );

  // Liste des pages/catégories
  const pages = ['Tshirts', 'Jeans', 'Dresses', 'Accessories', 'Veste', 'bags'];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const filteredResults = pages.filter(p =>
    p.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ⚡ Gestion Search (Entrée ou bouton)
const handleSearch = (e) => {
  e.preventDefault();
  if (!searchTerm) return;

  const match = pages.find((p) =>
    p.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (match) {
    navigate(`/${match.toLowerCase()}`);
    setSearchTerm("");      // vide l'input
    setShowResults(false);  // ferme le dropdown
  } else {
    alert("Page non trouvée");
  }
};


  return (
    <>
      <header className="lefties-navbar">
        <div className="left-section">
          <FaBars className="menu-icon" onClick={() => setShowMenu(true)} />
          <nav className="main-menu">
            <Link to="/" className="menu-link">WOMAN</Link>
          </nav>
        </div>

        <div className="logo">
  <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '6px' }}>
    <span>Trendoria</span>
  </Link>
</div>


        <div className="right-section">
          {/* SearchBar */}
          <form onSubmit={handleSearch} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              className="search-input"
              placeholder="Que Recherchez Vous?"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowResults(true);
              }}
              onBlur={() => setTimeout(() => setShowResults(false), 150)}
            />
            <button type="submit" className="search-button">
    <FiSearch className="nav-icon" />   
    {/* 👈 plus classe */}
            </button>

            {showResults && searchTerm && (
              <div className="search-results">
                {filteredResults.length ? (
                  filteredResults.map((p, i) => (
                    <div
                      key={i}
                      className="search-item"
                      onClick={() => {
                        navigate(`/${p.toLowerCase()}`);
                        setSearchTerm('');
                        setShowResults(false);
                      }}
                    >
                      {p}
                    </div>
                  ))
                ) : (
                  <div className="search-item">Aucun résultat</div>
                )}
              </div>
            )}
          </form>

          {/* Panier */}
          <Link to="/cart" className="cart-link">
<ShoppingBag className="nav-icon" size={22} strokeWidth={1.5} color="#000" />
  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
</Link>


          {/* Admin Panel */}
          {isAuth && user?.isAdmin && (
            <button onClick={() => navigate('/admin')} className="admin-btn">
              Admin Panel
            </button>
          )}

          {/* Login / Profil */}
          {!isAuth ? (
  <User className="nav-icon" strokeWidth={1.5} onClick={() => setShowLogin(true)} title="Mon compte" />
) : (
  <User className="nav-icon" strokeWidth={1.5} onClick={() => navigate('/profile')} title="Mon profil" />
)}


          {/* Logout */}
          {/* {isAuth && <button onClick={handleLogout} className="logout-btn">Logout</button>} */}
        </div>
      </header>

      <SideMenu show={showMenu} onClose={() => setShowMenu(false)} />
      <LoginPanel show={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
};

export default NavBar;
