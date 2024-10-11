import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa'; // Importation de l'icône de recherche
import ReactPaginate from 'react-paginate'; // Importation de ReactPaginate
import "../style/TableDevis.css";

const TableDevis = () => {
    const [devis, setDevis] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0); // État pour la page actuelle
    const devisPerPage = 6; // Nombre de devis par page

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDevis = async () => {
            try {
                const response = await axios.get("https://envoices.premiummotorscars.com/api/devis");
                setDevis(response.data);
            } catch (error) {
                console.error("Error fetching devis:", error);
            }
        };

        fetchDevis();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(0); // Réinitialiser à la première page lors de la recherche
    };

    const handlePrint = (devisId) => {
        navigate(`/imprimedevis/${devisId}`);
    };

    // Tri des devis par date de création en ordre décroissant
    const sortedDevis = [...devis].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Filtrage des devis par nom du client
    const filteredDevis = sortedDevis.filter((devi) =>
        `${devi.client.firstName} ${devi.client.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    // Pagination : calculer les devis pour la page actuelle
    const offset = currentPage * devisPerPage;
    const currentPageDevis = filteredDevis.slice(offset, offset + devisPerPage);

    // Gestion du changement de page
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <div className="devis-container">
            <div className="devis-section">
                <h3>Liste des Devis</h3>
                <div className="devis-search-bar">
                    <input 
                        type="text" 
                        placeholder="Rechercher par nom..." 
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <FaSearch className="devis-search-icon" />
                </div>
            </div>
            <div className="devis-table-container">
                <table className="devis-table">
                    <thead>
                        <tr>
                            <th>Numéro de devis</th>
                            <th>Nom du Client</th>
                            <th>Numéro de Téléphone</th>
                            <th>Email</th>
                            <th>Date</th>
                            <th>Imprimer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPageDevis.map((devi) => (
                            <tr key={devi._id}>
                                <td>{devi.devisNumber}</td>
                                <td>{devi.client.firstName} {devi.client.lastName}</td>
                                <td>{devi.client.phone}</td>
                                <td>{devi.client.email}</td>
                                <td>{new Date(devi.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button className="devis-print-button" onClick={() => handlePrint(devi._id)}>
                                        Imprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <ReactPaginate
                previousLabel={'Précédent'}
                nextLabel={'Suivant'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={Math.ceil(filteredDevis.length / devisPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination4'}
                activeClassName={'active'}
            />
        </div>
    );
};

export default TableDevis;
