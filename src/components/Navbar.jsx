import React, { useState, useEffect } from 'react';
import { IoMdLogOut } from 'react-icons/io';
import { MdOutlineSettings } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import '../style/Navbar.css';

const Navbar = () => {
    const [showLogout, setShowLogout] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleSettingsSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('https://envoices.premiummotorscars.com/api/admin/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Profil mis à jour avec succès!');
                setShowSettings(false);
            } else {
                alert(result.msg || 'Échec de la mise à jour');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
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
                    <h2>Modifier Profil</h2>
                    <form onSubmit={handleSettingsSubmit}>
                        <label>Ancien mot de passe :</label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                        <label>Nouveau mot de passe :</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <label>Confirmer le nouveau mot de passe :</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <div className="settings-buttons">
                            <button type="submit">Modifier Profil</button>
                            <button type="button" onClick={() => setShowSettings(false)}>Annuler</button>
                        </div>
                    </form>
                </div>
            )}
        </header>
    );
};

export default Navbar;
