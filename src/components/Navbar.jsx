// src/components/Navbar.jsx
import React, { useState } from 'react';
import { IoMdLogOut } from 'react-icons/io';
import { MdOutlineSettings } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import '../style/Navbar.css';

const Navbar = () => {
    const [showLogout, setShowLogout] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header className="navbar">
            <div className="navbar-left">
                <MdOutlineSettings className="settings-icon" />
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
        </header>
    );
};

export default Navbar;
