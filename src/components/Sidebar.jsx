// src/components/Sidebar.jsx
import React from 'react';
import { FaUser } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { FaCar } from "react-icons/fa6";
import { FaFileInvoice } from "react-icons/fa";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { IoIosPaper } from "react-icons/io";
import { MdLocalPrintshop } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import '../style/Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();

    return (
        <aside className="sidebar">
            <div className="logoS">
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
                <div className="menu-item" onClick={() => navigate('/add-material')}>
                <FaCar
                className="icon" />
                    <span className="text">Nos Véhicules</span>
                </div>
                <div className="menu-item" onClick={() => navigate('/facture')}>
                <FaFileInvoiceDollar 
                className="icon" />
                    <span className="text">Créer Facture</span>
                </div>

                <div className="menu-item" onClick={() => navigate('/devis')}>
                <IoIosPaper
                className="icon" />
                    <span className="text">Créer Devis</span>
                </div>

                <div className="menu-item" onClick={() => navigate('/facture_devis')}>
                    <FaFileInvoice className="icon" />
                    <span className="text">Modifications</span>
                </div>
                <div className="menu-item" onClick={() => navigate('/table-devis')}>
                <MdLocalPrintshop 
                className="icon" />
                    <span className="text">Imprimer Devis</span>
                </div>
            </nav>
            

        </aside>
    );
};

export default Sidebar;
