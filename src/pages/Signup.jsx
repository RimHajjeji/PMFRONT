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
            const res = await axios.post("http://localhost:5000/api/admin/signup", { email, password });
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
            <div className="login-right">
                <h2>Créer un compte</h2>
                <p>Pour rester connecté avec nous, Veuillez vous inscrire</p>
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
                    <button type="submit" className="login-button">S'inscrire</button>
                </form>
            </div>
            <div className="login-left">
                <img src="/assets/logo.png" alt="Logo" className="Logo" />
                <img src="/assets/signup2.svg" alt="Login Illustration" className="login-image" />
            </div>
        </div>
    );
};

export default Login;
