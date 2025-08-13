import React, { useState } from 'react';
import './LoginPanel.css';
import { useDispatch } from 'react-redux';
import { login, register as registerUser } from '../JS/Actions/user'; // ajuste le chemin si besoin
import { useNavigate } from 'react-router-dom';

const LoginPanel = ({ show, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login');

  const [form, setForm] = useState({
    email: '',
    password: '',
    repeatPassword: '',
    name: '',
    phone: '',
  });

  if (!show) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const switchTo = (next) => {
    setMode(next);
    setForm({ email: '', password: '', repeatPassword: '', name: '', phone: '' });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    await dispatch(login({ email: form.email, password: form.password }));
    onClose();
    navigate('/profile');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.repeatPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }
    await dispatch(
      registerUser({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      })
    );
    onClose();
    navigate('/profile');
  };

  return (
    <div className="login-panel-overlay">
      <div className="login-panel">
        <button onClick={onClose} className="close-btn">×</button>

        {mode === 'login' ? (
          <>
            <h2>LOG IN</h2>
            <p>Type your email address and password to enter</p>

            <form onSubmit={handleLogin}>
              <input
                type="email" name="email" placeholder="Email"
                className="input-field" value={form.email} onChange={handleChange} required
              />
              <input
                type="password" name="password" placeholder="Password"
                className="input-field" value={form.password} onChange={handleChange} required
              />

              <div className="options">
                <label><input type="checkbox" /> Stay logged in</label>
                <a href="#">Have you forgotten your password?</a>
              </div>

              <button type="submit" className="login-btn">Log in</button>
            </form>

            <div className="divider" />
            <p className="signup-text">Don't have an account?</p>
            <button className="create-btn" onClick={() => switchTo('register')}>
              Create account
            </button>
          </>
        ) : (
          <>
            <h2>CREATE ACCOUNT</h2>
            <p>Enter your details to register</p>

            <form onSubmit={handleRegister}>
              <input
                type="text" name="name" placeholder="Full name"
                className="input-field" value={form.name} onChange={handleChange} required
              />
              <input
                type="email" name="email" placeholder="Email"
                className="input-field" value={form.email} onChange={handleChange} required
              />
              <input
                type="tel" name="phone" placeholder="Phone number"
                className="input-field" value={form.phone} onChange={handleChange}
                pattern="^[0-9 +()-]{6,}$" title="Entrez un numéro valide"
                required
              />
              <input
                type="password" name="password" placeholder="Password"
                className="input-field" value={form.password} onChange={handleChange} required
              />
              <input
                type="password" name="repeatPassword" placeholder="Repeat password"
                className="input-field" value={form.repeatPassword} onChange={handleChange} required
              />

              <div className="options">
                <label><input type="checkbox" /> Stay logged in</label>
              </div>

              <button type="submit" className="login-btn">Register</button>
            </form>

            <div className="divider" />
            <p className="signup-text">Already have an account?</p>
            <button className="create-btn" onClick={() => switchTo('login')}>
              Log in
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPanel;
