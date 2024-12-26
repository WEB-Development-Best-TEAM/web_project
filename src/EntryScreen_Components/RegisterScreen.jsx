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

        // Check if passwords match
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

            // Check if the email already exists
            const emailQuery = query(collection(db, "users"), where("email", "==", email));
            const emailSnapshot = await getDocs(emailQuery);
            if (!emailSnapshot.empty) {
                setError('Email já existe');
                setSuccess('');
                return;
            }

            // Encrypt the password before saving
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);

            // Add new user to the database
            await addDoc(collection(db, "users"), {
                username,
                email,
                password: hashedPassword,
                registrationDate: new Date().toISOString()
            });

            setSuccess('Utilizador registado com sucesso!');
            setError('');
        } catch (error) {
            setError('Erro ao registar utilizador');
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
                    placeholder="Nome de Utilizador"
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