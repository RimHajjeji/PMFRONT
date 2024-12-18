import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../style/ModifClient.css";

const ModifierClient = () => {
    const { clientId } = useParams();
    const navigate = useNavigate();
    const [clientData, setClientData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        codeClient: '',
        typeClient: ''
    });

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await axios.get(`https://envoices.premiummotorscars.com/api/clients/${clientId}`);
                setClientData(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des données du client:", error);
                toast.error("Erreur lors du chargement des données du client.");
            }
        };

        fetchClient();
    }, [clientId]);

    const handleChange = (e) => {
        setClientData({ ...clientData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://envoices.premiummotorscars.com/api/clients/${clientId}`, clientData);
            toast.success("Client modifié avec succès !");
            setTimeout(() => navigate('/add-client'), 2000); // Redirection vers add-client après 2 secondes
        } catch (error) {
            console.error("Erreur lors de la modification du client:", error);
            toast.error("Erreur lors de la modification du client.");
        }
    };

    return (
        <div className="modifier-client-page">
            <ToastContainer position="bottom-right" autoClose={5000} />
            <h1>Modifier le client</h1>
            <form className="modifier-client-form" onSubmit={handleSubmit}>
    <div className="form-group">
        <label className="form-label" htmlFor="firstName">Prénom :</label>
        <input
            id="firstName"
            type="text"
            name="firstName"
            className="input-field"
            placeholder="Prénom"
            value={clientData.firstName}
            onChange={handleChange}
            required
        />
    </div>
    <div className="form-group">
        <label className="form-label" htmlFor="lastName">Nom :</label>
        <input
            id="lastName"
            type="text"
            name="lastName"
            className="input-field"
            placeholder="Nom"
            value={clientData.lastName}
            onChange={handleChange}
            required
        />
    </div>
    <div className="form-group">
        <label className="form-label" htmlFor="phone">Numéro de Téléphone :</label>
        <input
            id="phone"
            type="text"
            name="phone"
            className="input-field"
            placeholder="Numéro de Téléphone"
            value={clientData.phone}
            onChange={handleChange}
            required
        />
    </div>
    <div className="form-group">
        <label className="form-label" htmlFor="email">Email :</label>
        <input
            id="email"
            type="email"
            name="email"
            className="input-field"
            placeholder="Email"
            value={clientData.email}
            onChange={handleChange}
            required
        />
    </div>
    <div className="form-group">
        <label className="form-label" htmlFor="codeClient">Code Client :</label>
        <input
            id="codeClient"
            type="text"
            name="codeClient"
            className="input-field"
            placeholder="Code Client"
            value={clientData.codeClient}
            onChange={handleChange}
            required
        />
    </div>
    <div className="form-group">
        <label className="form-label" htmlFor="typeClient">Type Client :</label>
        <input
            id="typeClient"
            type="text"
            name="typeClient"
            className="input-field"
            placeholder="Type Client"
            value={clientData.typeClient}
            onChange={handleChange}
            required
        />
    </div>
    <button type="submit" className="btn-submit">Enregistrer les modifications</button>
</form>

        </div>
    );
};

export default ModifierClient;
