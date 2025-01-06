import { useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { db, auth } from '../firebase';
import './EntryScreen.css';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
        setError('As palavras-passe não coincidem');
        setSuccess('');
        return;
    }

    try {
        // Check if the username already exists
        const usernameQuery = query(collection(db, "users"), where("username", "==", username));
        const usernameSnapshot = await getDocs(usernameQuery);
        if (!usernameSnapshot.empty) {
            setError('Nome de utilizador já existe');
            setSuccess('');
            return;
        }

        // Register user with Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Send verification email
        await sendEmailVerification(user);

        // Save additional user details in Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            username,
            email,
            registrationDate: new Date().toISOString(),
        });

        setSuccess('Registo bem-sucedido! Por favor, verifique o seu email.');
        setError('');
    } catch (error) {
        setError('Erro ao registar utilizador: ' + error.message);
        setSuccess('');
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
                placeholder="Nome de Utilizador"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <img className="icon" src={"/user_icon.png"} alt="User Icon" />
        </div>

        <div className="inputBox">
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <img className="icon" src={"/user_icon.png"} alt="Email Icon" />
        </div>

        <div className="inputBox">
            <input
                type="password"
                placeholder="Palavra-Passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <img className="icon" src={"/password_icon.png"} alt="Password Icon" />
        </div>

        <div className="inputBox">
            <input
                type="password"
                placeholder="Confirmar Palavra-Passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
            <img className="icon" src={"/password_icon.png"} alt="Password Icon" />
        </div>

        {error && <p>{error}</p>}
        {success && <p>{success}</p>}

        <p>Já tenho uma conta, <Link to="/LoginScreen">entrar</Link>.</p>

        <input type="submit" value="Registrar" />
    </form>
);
}

export default RegisterScreen;