import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../../JS/Actions/user';
import { Button, Form, Container, Card } from 'react-bootstrap';
import './Register.css';

const Register = () => {
  const [newUser, setNewUser] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Récupération du user et isAuth depuis le store
  const { user, isAuth, errors } = useSelector((state) => state.user);

  // ✅ Redirection automatique si inscription réussie
  useEffect(() => {
    if (isAuth && user) {
      navigate('/profile');
    }
  }, [isAuth, user, navigate]);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleUser = (e) => {
    e.preventDefault();
    dispatch(register(newUser));
  };

  return (
    <Container className="register-page d-flex align-items-center justify-content-center">
      <Card className="register-card p-4">
        <h2 className="text-center mb-3">
          Bienvenue chez <span>CLASS CLOTHES</span>
        </h2>
        <p className="text-center text-muted mb-4">
          Créez votre compte pour accéder à notre univers mode
        </p>
        <Form onSubmit={handleUser}>
          <Form.Group controlId="formName" className="mb-3">
            <Form.Control
              type="text"
              name="name"
              placeholder="Nom complet"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Control
              type="email"
              name="email"
              placeholder="Adresse Email"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Control
              type="password"
              name="password"
              placeholder="Mot de passe"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formPhone" className="mb-4">
            <Form.Control
              type="text"
              name="phone"
              placeholder="Numéro de téléphone"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="danger" type="submit" className="w-100">
            S'inscrire
          </Button>
        </Form>

        {/* ✅ Affichage des erreurs éventuelles */}
        {errors && errors.length > 0 && (
          <div className="alert alert-danger mt-3">
            {errors.map((err, i) => (
              <p key={i}>{err.msg}</p>
            ))}
          </div>
        )}
      </Card>
    </Container>
  );
};

export default Register;
