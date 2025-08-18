import React, { useState, useEffect } from 'react';
import './Login.css';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearErrors, current } from '../../JS/Actions/user';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuth, errors, currentUser } = useSelector((state) => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirection après login si authentifié
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (isAuth && token) {
      dispatch(current())
        .finally(() => {
          // redirige vers home ou admin si admin
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

          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <p className="password-requirements">
            Your password must contain at least 8 characters, an uppercase and a lowercase letter and a number.
            Please do not repeat the same character more than three times.
          </p>

          <div className="options">
            <label>
              <input type="checkbox" />
              Stay logged in
            </label>
            <a href="#">Have you forgotten your password?</a>
          </div>

          <button className="login-btn" type="submit">Log in</button>
        </form>

        <div className="divider" />
        <p className="signup-text">Don't have an account?</p>
        <button className="create-btn" onClick={() => navigate('/register')}>
          Create account
        </button>
      </div>
    </div>
  );
};

export default Login;
