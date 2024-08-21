import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

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
        <div>
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
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
                    placeholder="Password"
                    required 
                />
                <button type="submit">Login</button>
            </form>
            <p>
                Vous n'avez pas de compte? <Link to="/signup">Signup</Link>
            </p>
        </div>
    );
};

export default Login;
