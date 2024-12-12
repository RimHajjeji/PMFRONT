import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import ReactPaginate from 'react-paginate'; // Import ReactPaginate
import "../style/Dashboard.css"; // Assurez-vous que ce fichier CSS existe et correspond à vos besoins.

const Dashboard = () => {
    const [invoices, setInvoices] = useState([]);
    const [userInfo, setUserInfo] = useState({ nom: '', prenom: '' }); // État pour les informations de l'utilisateur
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0); // État pour la page actuelle
    const invoicesPerPage = 6; // Nombre de factures par page

    const navigate = useNavigate();

    // Récupérer les données de l'utilisateur connecté
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem("token"); // Assurez-vous que le token est stocké dans le localStorage
                const response = await axios.get("http://localhost:5000/api/admin/profile", {
                    headers: { "x-auth-token": token },
                });
                setUserInfo(response.data);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUserInfo();
    }, []);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/invoices");
                setInvoices(response.data);
            } catch (error) {
                console.error("Error fetching invoices:", error);
            }
        };

        fetchInvoices();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(0); // Réinitialiser à la première page lors de la recherche
    };

    const handlePrint = (invoiceId) => {
        navigate(`/imprimefact/${invoiceId}`);
    };

    // Tri des factures par date de création en ordre décroissant
    const sortedInvoices = [...invoices].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Filtrage des factures par nom du client
    const filteredInvoices = sortedInvoices.filter((invoice) =>
        `${invoice.client.firstName} ${invoice.client.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    // Pagination : calculer les factures pour la page actuelle
    const offset = currentPage * invoicesPerPage;
    const currentPageInvoices = filteredInvoices.slice(offset, offset + invoicesPerPage);

    // Gestion du changement de page
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <div className="dashboard-container-wrapper">
            <div className="dashboard-main-content">
                <div className="dashboard-content-wrapper">
                    <div className="welcome-card">
                        <div className="welcome-text">
                            <h5>Bienvenue {userInfo.nom} {userInfo.prenom}! 🎉</h5>
                        </div>
                        <div className="welcome-image">
                            <img src="/assets/admindash.png" alt="Man working on laptop" />
                        </div>
                    </div>

                    <div className="invoices-section">
                        <h3>Liste des factures</h3>

                        {/* Barre de recherche */}
                        <div className="search-bar">
                            <input 
                                type="text" 
                                placeholder="Rechercher par nom..." 
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <FaSearch className="search-icon" />
                        </div>

                        {/* Tableau des factures */}
                        <div className="invoices-table-container">
                            <table className="invoices-table">
                                <thead>
                                    <tr>
                                        <th>Numéro de Facture</th>
                                        <th>Nom du Client</th>
                                        <th>Numéro de Téléphone</th>
                                        <th>Email</th>
                                        <th>Date</th>
                                        <th>Imprimer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentPageInvoices.map((invoice) => (
                                        <tr key={invoice._id}>
                                            <td>{invoice.invoiceNumber}</td>
                                            <td>{invoice.client.firstName} {invoice.client.lastName}</td>
                                            <td>{invoice.client.phone}</td>
                                            <td>{invoice.client.email}</td>
                                            <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <button className="invoice-print-button" onClick={() => handlePrint(invoice._id)}>
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
                            pageCount={Math.ceil(filteredInvoices.length / invoicesPerPage)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick}
                            containerClassName={'pagination1'}
                            activeClassName={'active'}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
