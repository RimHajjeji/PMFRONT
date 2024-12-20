import React, { useState, useEffect } from "react";  
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactPaginate from 'react-paginate'; // Import ReactPaginate
import "../style/FacturesClient.css";

const FactureClient = () => {
    const { clientId } = useParams(); // Récupère l'ID du client depuis les paramètres de l'URL
    const [factures, setFactures] = useState([]); // État pour les factures
    const [client, setClient] = useState(null); // État pour les détails du client
    const [loading, setLoading] = useState(true); // État de chargement
    const [error, setError] = useState(null); // État d'erreur
    const [currentPage, setCurrentPage] = useState(0); // Page actuelle pour la pagination
    const facturesPerPage = 5; // Nombre de factures à afficher par page
    const navigate = useNavigate(); // Pour la navigation

    // Fonction pour récupérer les factures et les détails du client
    useEffect(() => {
        const fetchFacturesEtClient = async () => {
            try {
                // Récupérer les factures du client
                const facturesResponse = await axios.get(`https://envoices.premiummotorscars.com/api/invoices/client/${clientId}`);
                // Tri des factures par date de création décroissante (les plus récentes en haut)
                const sortedFactures = facturesResponse.data.invoices.sort((a, b) => {
                    return new Date(b.createdAt) - new Date(a.createdAt); // Tri par date de création décroissante
                });
                setFactures(sortedFactures);

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

        fetchFacturesEtClient(); // Appel à la fonction de récupération
    }, [clientId]);

    // Pagination : calculer les factures pour la page actuelle
    const offset = currentPage * facturesPerPage;
    const currentPageFactures = factures.slice(offset, offset + facturesPerPage);

    // Fonction pour gérer le changement de page
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

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
                        {currentPageFactures.map((facture, index) => (
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
                                        className="Historique-fact-button"
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

            {/* Pagination */}
            <ReactPaginate
                previousLabel={'Précédent'}
                nextLabel={'Suivant'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={Math.ceil(factures.length / facturesPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination6'}
                activeClassName={'active'}
            />
        </div>
    );
};

export default FactureClient;
