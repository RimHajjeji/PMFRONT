import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { MdEmail, MdLock } from 'react-icons/md';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; // Import des icônes
import { ToastContainer, toast } from 'react-toastify'; // Import de react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import des styles de toast
import '../style/Login.css';

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // État pour gérer la visibilité du mot de passe
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Vérification des champs
        if (!email || !password) {
            toast.error("Veuillez remplir tous les champs.");
            return;
        }

        // Validation du format de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Veuillez entrer un email valide.");
            return;
        }

        // Validation du mot de passe
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            toast.error("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");
            return;
        }

        try {
            const res = await axios.post("https://envoices.premiummotorscars.com/api/admin/signup", { email, password });
            localStorage.setItem("token", res.data.token);
            toast.success("Admin créé avec succès !"); // Toast de succès spécifique
            navigate("/dashboard");
        } catch (err) {
            const errorMessage = err.response?.data?.msg || "Échec de l'inscription. Veuillez réessayer."; // Message en français
            toast.error(errorMessage); // Toast d'erreur avec message en français
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // Inverse l'état de la visibilité du mot de passe
    };

    return (
        <div className="login-container">
            <div className="login-right">
                <h2>Créer un compte</h2>
                <p>Pour rester connecté avec nous, veuillez vous inscrire</p>
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
            <ToastContainer position="bottom-right" autoClose={5000} /> {/* Toasts en bas à droite */}
        </div>
    );
};

export default SignUp;
