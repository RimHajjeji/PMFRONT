import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        <div>
            <h2>Admin Signup</h2>
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
                <button type="submit">Signup</button>
            </form>
        </div>
    );
};

export default Signup;
