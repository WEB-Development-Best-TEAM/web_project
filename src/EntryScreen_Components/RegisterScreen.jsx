import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './EntryScreen.css';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    try {
      await addDoc(collection(db, 'users'), {
        username,
        email,
        password,
        registrationDate: new Date().toISOString(),
      });
      navigate('/LoginScreen'); // Redirecionar para a tela de login
    } catch (error) {
      setError('Erro ao registrar usuário');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <div className="background-video">
        <video autoPlay muted loop>
          <source src="./backgroundClip.mp4" type="video/mp4" />
        </video>
      </div>
      <h1>Registrar</h1>

      <div className="inputBox">
        <input
          type="text"
          placeholder="Nome de Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <img className="icon" src="/user_icon.png" alt="User Icon" />
      </div>

      <div className="inputBox">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <img className="icon" src="/user_icon.png" alt="Email Icon" />
      </div>

      <div className="inputBox">
        <input
          type="password"
          placeholder="Palavra-Passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <img className="icon" src="/password_icon.png" alt="Password Icon" />
      </div>

      <div className="inputBox">
        <input
          type="password"
          placeholder="Confirmar Palavra-Passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <img className="icon" src="/password_icon.png" alt="Password Icon" />
      </div>

      {error && <p>{error}</p>}

      <p>Já tenho uma conta, <Link to="/LoginScreen">entrar</Link>.</p>

      <input type="submit" value="Registrar" />
    </form>
  );
};

export default RegisterScreen;