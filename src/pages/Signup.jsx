import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/Signup.css'; // Import the updated CSS file

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/admin/signup", { email, password });
            localStorage.setItem("token", res.data.token);
            navigate("/dashboard"); // Redirect to a protected route
        } catch (err) {
            console.error(err.response.data.msg);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-left">
                <h2>Créer un compte</h2>
                <p>Pour rester connecté avec nous, veuillez vous inscrire</p>
                <form onSubmit={handleSubmit} className="signup-form">
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
                    <button type="submit" className="signup-button">S'inscrire</button>
                </form>
            </div>
            <div className="signup-right">
                <img src="/assets/logo.png" alt="Logo" className="logo" />
                <img src="/assets/signup.svg" alt="Signup Illustration" className="signup-image" />
            </div>
        </div>
    );
};

export default Signup;
