import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import '../style/Facture_Devis.css';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        fetchClients();
    }, []);

    // Fonction pour récupérer les clients depuis le backend
    const fetchClients = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/clients'); // Endpoint pour récupérer les clients
            setClients(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des clients:', error);
        }
    };

    // Filtrage des clients selon la recherche
    const filteredClients = clients.filter(client =>
        `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const offset = currentPage * itemsPerPage;
    const currentPageItems = filteredClients.slice(offset, offset + itemsPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleFactureClick = (clientId) => {
        navigate(`/factures_client/${clientId}`); // Passe l'ID du client dans l'URL
    };
    
    

    // Fonction pour gérer le clic sur le bouton "Devis"
    const handleDevisClick = (clientId) => {
        navigate('/devis_client'); // Redirection vers la page de devis pour le client
    };

    return (
        <div className="facture-devis-page">
            <div className="facture-devis-container">
                <h1 className="facture-devis-title">Liste des Clients</h1>
                <div className="facture-devis-search-container">
                    <input
                        type="text"
                        className="facture-devis-search-bar"
                        placeholder="Rechercher par nom ou prénom..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <table className="facture-devis-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Facture</th>
                            <th>Devis</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPageItems.map((client, index) => (
                            <tr key={client._id || index}>
                                <td>{offset + index + 1}</td>
                                <td>{client.lastName}</td>
                                <td>{client.firstName}</td>
                                <td>
                                    <button
                                        className="facture-button"
                                        onClick={() => handleFactureClick(client._id)}
                                    >
                                        Voir Factures
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="devis-button"
                                        onClick={() => handleDevisClick(client._id)}
                                    >
                                        Voir Devis
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <ReactPaginate
                    previousLabel={'Précédent'}
                    nextLabel={'Suivant'}
                    breakLabel={'...'}
                    pageCount={Math.ceil(filteredClients.length / itemsPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={'facture-devis-pagination'}
                    activeClassName={'active'}
                />
            </div>
        </div>
    );
};

export default ClientList;
