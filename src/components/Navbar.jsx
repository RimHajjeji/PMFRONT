import React, { useState, useEffect } from 'react';
import { IoMdLogOut } from 'react-icons/io';
import { MdOutlineSettings } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import '../style/Navbar.css';

const Navbar = () => {
    const [showLogout, setShowLogout] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Fetch admin email when settings are shown
    useEffect(() => {
        if (showSettings) {
            fetch('http://localhost:5000/api/admin/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                setEmail(data.email);
            })
            .catch(error => console.error('Error fetching admin details:', error));
        }
    }, [showSettings]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleSettingsSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/admin/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                alert('Email and password updated successfully!');
                setShowSettings(false);
            } else {
                alert('Failed to update email and password.');
            }
        } catch (error) {
            console.error('Error updating settings:', error);
        }
    };

    return (
        <header className="navbar">
            <div className="navbar-left">
                <MdOutlineSettings 
                    className="settings-icon" 
                    onClick={() => setShowSettings(!showSettings)} 
                />
            </div>
            <div className="navbar-right">
                <IoMdLogOut 
                    className="logout-icon" 
                    onClick={() => setShowLogout(!showLogout)}
                />
                {showLogout && (
                    <button 
                        className="logout-button" 
                        onClick={handleLogout}
                    >
                        Déconnexion
                    </button>
                )}
            </div>
            {showSettings && (
                <div className="settings-popup">
                    <h2>Modifier Profile</h2>
                    <form onSubmit={handleSettingsSubmit}>
                        <label>Email :</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                        <label>Mot de passe :</label>
                        <input 
                        
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                        <div className="settings-buttons">
                            <button type="submit">Modifier Profile</button>
                            <button type="button" onClick={() => setShowSettings(false)}>Annuler</button>

                        </div>
                    </form>
                </div>
            )}
        </header>
    );
};

export default Navbar;
