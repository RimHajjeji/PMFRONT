import React, { useState, useEffect } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/FacturesClient.css";

const FactureClient = () => {
    const { clientId } = useParams(); // Récupère l'ID du client depuis les paramètres de l'URL
    const [factures, setFactures] = useState([]); // État pour les factures
    const [client, setClient] = useState(null); // État pour les détails du client
    const [loading, setLoading] = useState(true); // État de chargement
    const [error, setError] = useState(null); // État d'erreur
    const navigate = useNavigate(); // Pour la navigation

    // Fonction pour récupérer les factures et les détails du client
    useEffect(() => {
        const fetchFacturesEtClient = async () => {
            try {
                // Récupérer les factures du client
                const facturesResponse = await axios.get(`http://localhost:5000/api/invoices/client/${clientId}`);
                setFactures(facturesResponse.data.invoices);

                // Récupérer les détails du client
                const clientResponse = await axios.get(`http://localhost:5000/api/clients/${clientId}`);
                setClient(clientResponse.data); // Stocker les données du client dans l'état

                setLoading(false);
            } catch (err) {
                console.error("Erreur lors du chargement des données :", err);
                setError("Impossible de charger les données du client.");
                setLoading(false);
            }
        };

        fetchFacturesEtClient(); // Appel à la fonction de récupération
    }, [clientId]);

    // Fonction pour naviguer vers l'affichage d'une facture
    const handleVoirFacture = (invoiceId) => {
        navigate(`/voirfacture/${invoiceId}`);
    };

    // Fonction pour naviguer vers la modification d'une facture
    const handleModifierFacture = (invoiceId) => {
        navigate(`/modif_facture/${invoiceId}`);
    };

    // Fonction pour naviguer vers l'historique des modifications d'une facture
    const handleHistoriqueModifications = (invoiceId) => {
        navigate(`/historiquemodifsfact/${invoiceId}`);
    };

    // Affichage du contenu en fonction de l'état de chargement ou d'erreur
    if (loading) {
        return <div>Chargement des données...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="factures-client-page">
            {/* Affiche le nom et le prénom du client si disponible */}
            <h1 className="factures-client-title">
                Factures du client : {client ? `${client.firstName || "Nom inconnu"} ${client.lastName || ""}` : "Nom inconnu"}
            </h1>

            {/* Affiche un message si aucune facture n'est trouvée */}
            {Array.isArray(factures) && factures.length === 0 ? (
                <p>Aucune facture trouvée pour ce client.</p>
            ) : (
                // Affiche la liste des factures sous forme de tableau
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
                                        className="historique-modif-button"
                                        onClick={() => handleHistoriqueModifications(facture._id)}
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
