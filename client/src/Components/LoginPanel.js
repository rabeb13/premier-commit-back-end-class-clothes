import axios from "axios";
import React, { useState } from 'react';
import './LoginPanel.css';
import { useDispatch } from 'react-redux';
import { login, register as registerUser } from '../JS/Actions/user';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // ⬅️ NEW


const LoginPanel = ({ show, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login');
  const [resetEmail, setResetEmail] = useState(""); // <- NEW

  const [form, setForm] = useState({
    email: '',
    password: '',
    repeatPassword: '',
    name: '',
    phone: '',
  });

  // ⬇️ NEW: états pour afficher/masquer les mots de passe
  const [showPwdLogin, setShowPwdLogin] = useState(false);
  const [showPwdReg, setShowPwdReg] = useState(false);
  const [showPwdReg2, setShowPwdReg2] = useState(false);

  if (!show) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const switchTo = (next) => {
    setMode(next);
    setForm({ email: '', password: '', repeatPassword: '', name: '', phone: '' });
    setShowPwdLogin(false);
    setShowPwdReg(false);
    setShowPwdReg2(false);
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

      {/* ------- LOGIN ------- */}
      {mode === "login" && (
        <>
          <h2>LOG IN</h2>
          <p>Type your email address and password to enter</p>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input-field"
              value={form.email}
              onChange={handleChange}
              required
            />

            {/* Password avec œil */}
            <div className="pw-field">
              <input
                type={showPwdLogin ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="input-field pw-input"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowPwdLogin((s) => !s)}
                aria-label={showPwdLogin ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPwdLogin ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className="options">
              <label><input type="checkbox" /> Stay logged in</label>
              <button
                type="button"
                className="forgot-btn"
                onClick={() => { setMode("forgot-email"); setResetEmail(""); }}
              >
                Have you forgotten your password?
              </button>
            </div>

            <button type="submit" className="login-btn">Log in</button>
          </form>

          <div className="divider" />
          <p className="signup-text">Don't have an account?</p>
          <button className="create-btn" onClick={() => switchTo("register")}>
            Create account
          </button>
        </>
      )}

      {/* ------- REGISTER ------- */}
      {mode === "register" && (
        <>
          <h2>CREATE ACCOUNT</h2>
          <p>Enter your details to register</p>

          <form onSubmit={handleRegister}>
            <input
              type="text"
              name="name"
              placeholder="Full name"
              className="input-field"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input-field"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone number"
              className="input-field"
              value={form.phone}
              onChange={handleChange}
              pattern="^[0-9 +()-]{6,}$"
              title="Entrez un numéro valide"
              required
            />

            {/* Password avec œil */}
            <div className="pw-field">
              <input
                type={showPwdReg ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="input-field pw-input"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowPwdReg((s) => !s)}
                aria-label={showPwdReg ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPwdReg ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Repeat password avec œil */}
            <div className="pw-field">
              <input
                type={showPwdReg2 ? "text" : "password"}
                name="repeatPassword"
                placeholder="Repeat password"
                className="input-field pw-input"
                value={form.repeatPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowPwdReg2((s) => !s)}
                aria-label={showPwdReg2 ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPwdReg2 ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className="options">
              <label><input type="checkbox" /> Stay logged in</label>
            </div>

            <button type="submit" className="login-btn">Register</button>
          </form>

          <div className="divider" />
          <p className="signup-text">Already have an account?</p>
          <button className="create-btn" onClick={() => switchTo("login")}>
            Log in
          </button>
        </>
      )}

      {/* ------- FORGOT (EMAIL) ------- */}
      {mode === "forgot-email" && (
        <>
          <h2>RESET PASSWORD</h2>
          <p>Enter your email to receive a reset link.</p>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await axios.post("/api/auth/forgot-password", { email: resetEmail });
                alert("A reset link has been sent to your email.");
                setMode("login");
              } catch (err) {
                alert(err?.response?.data?.message || "Failed to send reset email.");
              }
            }}
          >
            <input
              type="email"
              className="input-field"
              placeholder="Your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
            <button type="submit" className="login-btn">Send reset link</button>
          </form>

          <div className="divider" />
          <button className="create-btn" onClick={() => setMode("login")}>
            Back to login
          </button>
        </>
      )}
    </div>
  </div>
);
};

export default LoginPanel;
