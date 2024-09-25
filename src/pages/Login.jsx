import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { MdEmail, MdLock } from 'react-icons/md';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/Login.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Veuillez entrer un email valide.");
            return;
        }
    
        // Validation des champs
        if (!email || !password) {
            toast.error("Veuillez remplir tous les champs.");
            return;
        }
    
        try {
            const res = await axios.post("http://localhost:5000/api/admin/login", { email, password });
            localStorage.setItem("token", res.data.token);
            toast.success("Connexion réussie !");
            navigate("/dashboard"); 
        } catch (err) {
            let errorMessage = err.response?.data?.msg;
    
            // Vérification du message d'erreur pour personnalisation
            if (!errorMessage || errorMessage === "Invalid credentials") {
                errorMessage = "Identifiants incorrects. Veuillez vérifier votre email et votre mot de passe.";
            }
    
            toast.error(errorMessage); // Affichage du message d'erreur en français
        }
    };
    

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                            type={showPassword ? 'text' : 'password'} 
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
                            {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
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
            <ToastContainer position="bottom-right" autoClose={5000} />
        </div>
    );
};

export default Login;
