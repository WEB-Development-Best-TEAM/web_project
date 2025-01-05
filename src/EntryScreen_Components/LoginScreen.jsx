import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from './firebaseConfig';
import userIcon from './assets/user_icon.png';
import passwordIcon from './assets/passWord_icon.png';

function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Query the database for the username
            const q = query(collection(db, "users"), where("username", "==", username));
            const querySnapshot = await getDocs(q);

            // Check if the username exists
            if (querySnapshot.empty) {
                setError('Nome de utilizador não encontrado');
                setSuccess('');
                return;
            }
            
            // Retrieve the user's email from Firestore
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            const email = userData.email;
            
            // Authenticate using Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Check if the user has verified their email            
            if (!user.emailVerified) {
                console.log('User Information:', userData);
                setError('Por favor, verifique o seu email antes de fazer login.');
                setSuccess('');
                return;
            }
            
            // Log user information
            console.log('User Information:', userData);
            
            // Successful login
            setSuccess('Login realizado com sucesso!');
            setError('');

            // Redirect to the game page
            navigate('/MainMenu');

            // Store the user ID in local storage
            const userId = user.uid;
            localStorage.setItem('userId', userId);

            } catch (error) {
                setError('Erro ao fazer login: ' + error.message);
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
                    placeholder="Nome de Utilizador"
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