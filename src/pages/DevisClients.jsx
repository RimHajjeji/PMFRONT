import React, { useState, useEffect } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactPaginate from 'react-paginate'; // Import ReactPaginate
import "../style/DevisClients.css";

const DevisClients = () => {
    const { clientId } = useParams(); // Récupère l'ID du client depuis les paramètres de l'URL
    const [devis, setDevis] = useState([]); // État pour les devis
    const [client, setClient] = useState(null); // État pour les détails du client
    const [loading, setLoading] = useState(true); // État de chargement
    const [error, setError] = useState(null); // État d'erreur
    const [currentPage, setCurrentPage] = useState(0); // Page actuelle
    const devisPerPage = 5; // Nombre d'éléments à afficher par page
    const navigate = useNavigate(); // Pour la navigation

    // Fonction pour récupérer les devis et les détails du client
    useEffect(() => {
        const fetchDevisEtClient = async () => {
            try {
                // Récupérer les devis du client
                const devisResponse = await axios.get(`https://envoices.premiummotorscars.com/api/devis/client/${clientId}`);
                
                // Tri des devis par date de création décroissante (createdAt)
                const sortedDevis = devisResponse.data.devis.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setDevis(sortedDevis);

                // Récupérer les détails du client
                const clientResponse = await axios.get(`https://envoices.premiummotorscars.com/api/clients/${clientId}`);
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

    // Pagination : calculer les devis pour la page actuelle
    const offset = currentPage * devisPerPage;
    const currentPageDevis = devis.slice(offset, offset + devisPerPage);

    // Fonction pour gérer le changement de page
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    // Fonction pour naviguer vers l'affichage d'un devis
    const handleVoirDevis = (devisId) => {
        navigate(`/voirdevis/${devisId}`);
    };

    // Fonction pour naviguer vers la modification d'un devis
    const handleModifierDevis = (devisId) => {
        navigate(`/modif_devis/${devisId}`);
    };

    // Fonction pour naviguer vers l'historique des modifications d'un devis
    const handleHistoriqueModifications = (devisId) => {
        navigate(`/historiquemodifsdevis/${devisId}`);
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
                        {currentPageDevis.map((devisItem, index) => (
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
                                        onClick={() => handleHistoriqueModifications(devisItem._id)}
                                    >
                                        Modifications précédentes
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Pagination */}
            <ReactPaginate
                previousLabel={'Précédent'}
                nextLabel={'Suivant'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={Math.ceil(devis.length / devisPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination8'}
                activeClassName={'active'}
            />
        </div>
    );
};

export default DevisClients;
