import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { MdEmail, MdLock } from 'react-icons/md';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; // Import des icônes
import '../style/Login.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // État pour gérer la visibilité du mot de passe
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/admin/login", { email, password });
            localStorage.setItem("token", res.data.token);
            navigate("/dashboard"); 
        } catch (err) {
            console.error(err.response.data.msg);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // Inverse l'état de la visibilité du mot de passe
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <img src="/assets/logo.png" alt="Logo" className="Logo" />
                <img src="/assets/login.svg" alt="Login Illustration" className="login-image" />
            </div>
            <div className="login-right">
                <h2>Bienvenue administrateur</h2>
                <p>Connectez-vous à votre compte</p>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-container">
                        <MdEmail className="input-icon" />
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Email"
                            required 
                        />
                    </div>
                    <div className="input-container">
                        <MdLock className="input-icon" />
                        <input 
                            type={showPassword ? 'text' : 'password'} // Modifie le type selon l'état de visibilité
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Mot de passe"
                            required 
                        />
                        
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="toggle-password-visibility"
                        >
                            {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />} {/* Affiche l'icône correcte */}
                        </button>
                    </div>
                    <button type="submit" className="login-button">Se Connecter</button>
                </form>
                <div className="signup-prompt">
                    <p>
                        Vous n'avez pas de compte? <Link to="/signup" className="signup-link">S'inscrire</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
