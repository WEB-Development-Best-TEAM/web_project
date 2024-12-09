import { useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import userIcon from './assets/user_icon.png';
import passwordIcon from './assets/passWord_icon.png';

function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('As senhas não coincidem');
            setSuccess('');
            return;
        }

        try {
            // Verificar se o nome de usuário já existe
            const usernameQuery = query(collection(db, "users"), where("username", "==", username));
            const usernameSnapshot = await getDocs(usernameQuery);
            if (!usernameSnapshot.empty) {
                setError('Nome de usuário já existe');
                setSuccess('');
                return;
            }

            // Verificar se o email já existe
            const emailQuery = query(collection(db, "users"), where("email", "==", email));
            const emailSnapshot = await getDocs(emailQuery);
            if (!emailSnapshot.empty) {
                setError('Email já existe');
                setSuccess('');
                return;
            }

            // Adicionar novo usuário
            await addDoc(collection(db, "users"), {
                username,
                email,
                password,
                registrationDate: new Date().toISOString()
            });
            setSuccess('Usuário registrado com sucesso!');
            setError('');
        } catch (error) {
            setError('Erro ao registrar usuário');
            setSuccess('');
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <div className="background-blur"></div>
            <h1>Registrar</h1>

            <div className="inputBox">
                <input
                    type="text"
                    placeholder="Nome de Usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <img className="icon" src={userIcon} alt="User Icon" />
            </div>

            <div className="inputBox">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <img className="icon" src={userIcon} alt="Email Icon" />
            </div>

            <div className="inputBox">
                <input
                    type="password"
                    placeholder="Palavra-Passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <img className="icon" src={passwordIcon} alt="Password Icon" />
            </div>

            <div className="inputBox">
                <input
                    type="password"
                    placeholder="Confirmar Palavra-Passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <img className="icon" src={passwordIcon} alt="Password Icon" />
            </div>

            {error && <p>{error}</p>}
            {success && <p>{success}</p>}

            <p>Já tenho uma conta, <Link to="/LoginScreen">entrar</Link>.</p>

            <input type="submit" value="Registrar" />
        </form>
    );
}

export default RegisterScreen;