import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/FacturesClient.css";

const FactureClient = () => {
    const { clientId } = useParams();
    const [factures, setFactures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Pour la navigation

    useEffect(() => {
        fetchFactures();
    }, []);

    const fetchFactures = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/invoices/client/${clientId}`);
            setFactures(response.data.invoices);
            setLoading(false);
        } catch (err) {
            console.error("Erreur lors du chargement des factures :", err);
            setError("Impossible de charger les factures.");
            setLoading(false);
        }
    };

    const handleVoirFacture = (invoiceId) => {
        navigate(`/imprimefact/${invoiceId}`);
    };

    const handleModifierFacture = (invoiceId) => {
        navigate(`/modif_facture/${invoiceId}`); // Redirection vers la page de modification
    };

    if (loading) {
        return <div>Chargement des factures...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="factures-client-page">
            <h1 className="factures-client-title">Factures du Client</h1>
            {Array.isArray(factures) && factures.length === 0 ? (
                <p>Aucune facture trouvée pour ce client.</p>
            ) : (
                <table className="factures-client-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Numéro de Facture</th>
                            <th>Factures</th>
                            <th>Action</th>
                            <th>Historique</th>
                        </tr>
                    </thead>
                    <tbody>
                        {factures.map((facture, index) => (
                            <tr key={facture._id}>
                                <td>{index + 1}</td>
                                <td>{facture.invoiceNumber}</td>
                                <td>
                                    <button
                                        className="voir-facture-button"
                                        onClick={() => handleVoirFacture(facture._id)}
                                    >
                                        Voir facture
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="modifier-facture-button"
                                        onClick={() => handleModifierFacture(facture._id)}
                                    >
                                        Modifier facture
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="Historique-modif-button"
                                        onClick={() => alert("Voir modifications")}
                                    >
                                        Modifications précédentes 
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default FactureClient;
