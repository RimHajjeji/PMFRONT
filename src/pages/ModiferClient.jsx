// ModifierClient.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
                const response = await axios.get(`http://localhost:5000/api/clients/${clientId}`);
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
            await axios.put(`http://localhost:5000/api/clients/${clientId}`, clientData);
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
                <input
                    type="text"
                    name="firstName"
                    placeholder="Prénom"
                    value={clientData.firstName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Nom"
                    value={clientData.lastName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Numéro de Téléphone"
                    value={clientData.phone}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={clientData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="codeClient"
                    placeholder="Code Client"
                    value={clientData.codeClient}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="typeClient"
                    placeholder="Type Client"
                    value={clientData.typeClient}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Enregistrer les modifications</button>
            </form>
        </div>
    );
};

export default ModifierClient;
