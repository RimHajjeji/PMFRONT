// src/components/Sidebar.jsx
import React from 'react';
import { FaUser } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import '../style/Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();

    return (
        <aside className="sidebar">
            <div className="logo">
                <img src="/assets/logo.png" alt="Logo" />
            </div>
            <nav className="menu">
                <div className="menu-item" onClick={() => navigate('/dashboard')}>
                    <FaHouse className="icon" />
                    <span className="text">Accueil</span>
                </div>
                <div className="menu-item" onClick={() => navigate('/add-client')}>
                    <FaUser className="icon" />
                    <span className="text">Ajouter Client</span>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
