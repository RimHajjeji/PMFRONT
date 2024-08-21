import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../style/Login.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/admin/login", { email, password });
            localStorage.setItem("token", res.data.token);
            navigate("/dashboard"); // Redirect to a protected route
        } catch (err) {
            console.error(err.response.data.msg);
        }
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <img src="/assets/logo.png" alt="Logo" className="logo" />
                <img src="/assets/login.svg" alt="Login Illustration" className="login-image" />
            </div>
            <div className="login-right">
                <h2>Bienvenue administrateur</h2>
                <p>Connectez-vous à votre compte</p>
                <form onSubmit={handleSubmit} className="login-form">
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Email"
                        required 
                    />
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Mot de passe"
                        required 
                    />
                    <button type="submit" className="login-button">Se connecter</button>
                </form>
                <p className="signup-prompt">
                    Vous n'avez pas de compte? <Link to="/signup" className="signup-link">S'inscrire</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
