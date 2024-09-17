import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import '../style/ResetPassword.css';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const { token } = useParams();
    const navigate = useNavigate();

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        if (newPassword.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/admin/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Votre mot de passe a été réinitialisé avec succès.');
                setTimeout(() => navigate('/admin-login'), 2000); // Redirection après 2 secondes
            } else {
                setError(data.message || 'Une erreur est survenue.');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Erreur de serveur. Veuillez réessayer plus tard.');
        }
    };

    return (
        <div className="reset-pwd-container">
            <div className="reset-pwd-form">
                <h2>Nouveau mot de passe</h2>
                <form onSubmit={handleSubmit}>
                    <div className="password-input-container1">
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="Entrez votre nouveau mot de passe"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={toggleNewPasswordVisibility}
                            className="toggle-password-visibility1"
                        >
                            {showNewPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                        </button>
                    </div>
                    <div className="password-input-container1">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirmez votre nouveau mot de passe"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="toggle-password-visibility1"
                        >
                            {showConfirmPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                        </button>
                    </div>
                    {error && <p className="reset-pwd-error-msg">{error}</p>}
                    {message && <p className="reset-pwd-success-msg">{message}</p>}
                    <button type="submit" className="reset-pwd-btn">
                        Réinitialiser le mot de passe
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
