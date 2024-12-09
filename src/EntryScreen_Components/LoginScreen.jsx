import { useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import userIcon from './assets/user_icon.png';
import passwordIcon from './assets/passWord_icon.png';

function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const q = query(collection(db, "users"), where("username", "==", username));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                setError('Nome de usuário não encontrado');
                setSuccess('');
                return;
            }
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            if (userData.password !== password) {
                setError('Senha incorreta');
                setSuccess('');
                return;
            }
            setSuccess('Login realizado com sucesso!');
            setError('');
        } catch (error) {
            setError('Erro ao fazer login');
            setSuccess('');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <div className="background-blur"></div>
            <h1>Entrar</h1>

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
                    type="password"
                    placeholder="Palavra-Passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <img className="icon" src={passwordIcon} alt="Password Icon" />
            </div>

            {error && <p>{error}</p>}
            {success && <p>{success}</p>}

            <a href="">Esqueci-me da Palavra-Passe</a>
            <input type="submit" value="Entrar" />

            <div>
                <p>Não tens uma conta, <Link to="/RegisterScreen">clica aqui</Link>.</p>
            </div>
        </form>
    );
}

export default LoginScreen;