import React, { useState, useEffect } from 'react';
import './Login.css';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearErrors, current } from '../../JS/Actions/user';
import { fetchCart } from "../../JS/Actions/cart";   // 👈 import fetchCart
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuth, errors, currentUser } = useSelector((state) => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false); // + NEW state

  // Redirection après login si authentifié
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (isAuth && token) {
      dispatch(current())
        .finally(() => {
          // ⚡ Charger le panier utilisateur
          dispatch(fetchCart());

          // Redirection
          if (currentUser?.isAdmin) navigate('/admin');
          else navigate('/');
        });
    }
  }, [isAuth, dispatch, navigate, currentUser]);

  // Nettoyer les erreurs à la sortie du composant
  useEffect(() => {
    return () => dispatch(clearErrors());
  }, [dispatch]);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  const renderErrors = () => {
    if (!errors) return null;
    if (Array.isArray(errors)) {
      return errors.map((el, i) => (
        <p key={i} style={{ color: 'red', fontSize: '13px' }}>
          {typeof el === 'string' ? el : el.msg}
        </p>
      ));
    }
    return (
      <p style={{ color: 'red', fontSize: '13px' }}>
        {typeof errors === 'string' ? errors : errors.msg}
      </p>
    );
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>LOG IN</h2>
        <p>Type your email address and password to enter</p>

        {renderErrors()}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="pw-field">
    <input
      type={showPwd ? "text" : "password"}
      placeholder="Password"
      className="input-field pw-input"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
    <button
      type="button"
      className="pw-toggle"
      onClick={() => setShowPwd((s) => !s)}
      aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
    >
      {showPwd ? <FiEyeOff /> : <FiEye />}
    </button>
  </div>

  <p className="password-requirements">
    Your password must contain at least 8 characters, an uppercase and a lowercase letter and a number.
    Please do not repeat the same character more than three times.
  </p>

  <div className="options">
    <label><input type="checkbox" />Stay logged in</label>
    <a href="#">Have you forgotten your password?</a>
  </div>

  <button className="login-btn" type="submit">Log in</button>
</form>

        <div className="divider" />
        <p className="signup-text">Don't have an account?</p>
        <button className="create-btn" onClick={() => navigate('/register')}>
          Create accountttt
        </button>
      </div>
    </div>
  );
};

export default Login;
