import React, { useState } from 'react';
import '../style/ResetPasswordRequest.css';

const ResetPasswordRequest = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Veuillez entrer une adresse email valide.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/admin/reset-password-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Un lien de réinitialisation de mot de passe a été envoyé à votre adresse email.');
            } else {
                setError(data.message || 'Une erreur est survenue.');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Erreur de serveur. Veuillez réessayer plus tard.');
        }
    };

    return (
        <div className="page-container-pass">
            <div className="request-pwd-container">
                <h2>Réinitialiser le mot de passe</h2>
                <form className="request-pwd-form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Entrez Votre Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {error && <p className="request-pwd-error-msg">{error}</p>}
                    {message && <p className="request-pwd-success-msg">{message}</p>}
                    <button type="submit" className="request-pwd-btn">
                        Envoyer le lien de réinitialisation
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordRequest;
