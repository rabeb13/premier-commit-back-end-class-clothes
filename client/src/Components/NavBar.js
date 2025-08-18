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

  const { isAuth, user } = useSelector((state) => state.user);

  // compteur panier
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

          {/* Panier */}
          <Link to="/cart" className="cart-link">
            <FaShoppingBag className="nav-icon" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {/* Admin Panel (visible seulement si admin) */}
          {isAuth && user?.isAdmin && (
            <button onClick={() => navigate('/admin')} className="admin-btn">
              Admin Panel
            </button>
          )}

          {/* Login / Profil */}
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

          {/* Logout */}
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
