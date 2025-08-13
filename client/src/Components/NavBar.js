// src/Components/NavBar.jsx
import React, { useState } from 'react';
import { FaBars, FaSearch, FaUser, FaShoppingBag } from 'react-icons/fa';
import SideMenu from './SideMenu';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../JS/Actions/user';
import LoginPanel from './LoginPanel';
import './NavBar.css';

const NavBar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuth } = useSelector((state) => state.user);

  // ✅ compteur panier
  const cartCount = useSelector(
    (state) => state.cart?.items?.reduce((sum, it) => sum + (it?.quantity || 0), 0) || 0
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <>
      <header className="lefties-navbar">
        {/* Left */}
        <div className="left-section">
          <FaBars className="menu-icon" onClick={() => setShowMenu(true)} />
          <nav className="main-menu">
            <Link to="/" className="menu-link">WOMAN</Link>
          </nav>
        </div>

        {/* Center logo */}
        <div className="logo">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Class Clothing
          </Link>
        </div>

        {/* Right icons */}
        <div className="right-section">
          <FaSearch className="nav-icon" />

          {/* ✅ Icône Panier + badge + lien */}
          <Link to="/cart" className="cart-link" style={{ position: 'relative' }}>
            <FaShoppingBag className="nav-icon" />
            {cartCount > 0 && (
              <span
                className="cart-badge"
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -8,
                  background: '#e11d48',
                  color: '#fff',
                  borderRadius: '9999px',
                  fontSize: 12,
                  lineHeight: '16px',
                  minWidth: 18,
                  height: 18,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 5px',
                  fontWeight: 700,
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* Compte utilisateur */}
          {!isAuth ? (
            <FaUser
              className="nav-icon"
              onClick={() => setShowLogin(true)}
              style={{ cursor: 'pointer' }}
              title="Mon compte"
            />
          ) : (
            <FaUser
              className="nav-icon"
              onClick={() => navigate('/profile')}
              style={{ cursor: 'pointer' }}
              title="Mon profil"
            />
          )}

          {/* Logout si connecté */}
          {isAuth && (
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          )}
        </div>
      </header>

      {/* Menu latéral */}
      <SideMenu show={showMenu} onClose={() => setShowMenu(false)} />

      {/* Login Panel */}
      <LoginPanel show={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
};

export default NavBar;
