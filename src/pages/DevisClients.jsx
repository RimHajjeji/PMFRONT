import React, { useState, useEffect } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/DevisClients.css";

const DevisClients = () => {
    const { clientId } = useParams(); // Récupère l'ID du client depuis les paramètres de l'URL
    const [devis, setDevis] = useState([]); // État pour les devis
    const [client, setClient] = useState(null); // État pour les détails du client
    const [loading, setLoading] = useState(true); // État de chargement
    const [error, setError] = useState(null); // État d'erreur
    const navigate = useNavigate(); // Pour la navigation

    // Fonction pour récupérer les devis et les détails du client
    useEffect(() => {
        const fetchDevisEtClient = async () => {
            try {
                // Récupérer les devis du client
                const devisResponse = await axios.get(`http://localhost:5000/api/devis/client/${clientId}`);
                setDevis(devisResponse.data.devis);

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

        fetchDevisEtClient(); // Appel à la fonction de récupération
    }, [clientId]);

    // Fonction pour naviguer vers l'affichage d'un devis
    const handleVoirDevis = (devisId) => {
        navigate(`/voirdevis/${devisId}`);
    };

    // Fonction pour naviguer vers la modification d'un devis
    const handleModifierDevis = (devisId) => {
        navigate(`/modif_devis/${devisId}`);
    };

    // Affichage du contenu en fonction de l'état de chargement ou d'erreur
    if (loading) {
        return <div>Chargement des données...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="devis-clients-page">
            {/* Affiche le nom et le prénom du client si disponible */}
            <h1 className="devis-clients-title">
                Devis du client : {client ? `${client.firstName || "Nom inconnu"} ${client.lastName || ""}` : "Nom inconnu"}
            </h1>

            {/* Affiche un message si aucun devis n'est trouvé */}
            {Array.isArray(devis) && devis.length === 0 ? (
                <p>Aucun devis trouvé pour ce client.</p>
            ) : (
                // Affiche la liste des devis sous forme de tableau
                <table className="devis-clients-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Numéro de Devis</th>
                            <th>Devis</th>
                            <th>Action</th>
                            <th>Historique</th>
                        </tr>
                    </thead>
                    <tbody>
                        {devis.map((devisItem, index) => (
                            <tr key={devisItem._id}>
                                <td>{index + 1}</td>
                                <td>{devisItem.devisNumber}</td>
                                <td>
                                    <button
                                        className="voir-devis-button"
                                        onClick={() => handleVoirDevis(devisItem._id)}
                                    >
                                        Voir devis
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="modifier-devis-button"
                                        onClick={() => handleModifierDevis(devisItem._id)}
                                    >
                                        Modifier devis
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="historique-modif-button"
                                        onClick={() => navigate(`/historique_modifs_devis/${devisItem._id}`)}
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

export default DevisClients;
