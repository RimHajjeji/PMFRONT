import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'
import { FaSearch } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import "../style/Dashboard.css";

const Dashboard = () => {
    const [invoices, setInvoices] = useState([]);
    const [userInfo, setUserInfo] = useState({ nom: '', prenom: '' });
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const invoicesPerPage = 6;

    const navigate = useNavigate();

    // Fonction pour vérifier l'expiration du token
    const isTokenExpired = (token) => {
        try {
            const decoded = jwtDecode(token);
            if (decoded && decoded.exp < Date.now() / 1000) {
                return true;
            }
            return false;
        } catch (error) {
            return true;
        }
    };

    // Rafraîchissement du token
    const refreshToken = async () => {
        const token = localStorage.getItem("token");

        if (!token) return null;

        try {
            const response = await axios.post("http://localhost:5000/api/refresh-token", {}, {
                headers: {
                    'x-auth-token': token,
                },
            });
            const newToken = response.data.token;
            localStorage.setItem("token", newToken);
            return newToken;
        } catch (error) {
            console.error("Error refreshing token:", error);
            localStorage.removeItem("token");
            navigate('/login');
            return null;
        }
    };

    // Récupérer les données de l'utilisateur connecté
    useEffect(() => {
        const fetchUserInfo = async () => {
            let token = localStorage.getItem("token");

            if (!token || isTokenExpired(token)) {
                console.log('Token expired or not found, refreshing token...');
                token = await refreshToken(); // Tente de rafraîchir le token

                if (!token) {
                    navigate('/login'); // Rediriger vers la page de login si le token est invalide
                    return;
                }
            }

            try {
                const decoded = jwtDecode(token);
                setUserInfo({
                    nom: decoded.nom,
                    prenom: decoded.prenom,
                });
            } catch (error) {
                console.error("Error decoding token:", error);
                navigate('/login');
            }
        };

        fetchUserInfo();
    }, [navigate]);

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
        setCurrentPage(0);
    };

    const handlePrint = (invoiceId) => {
        navigate(`/imprimefact/${invoiceId}`);
    };

    const sortedInvoices = [...invoices].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const filteredInvoices = sortedInvoices.filter((invoice) =>
        `${invoice.client.firstName} ${invoice.client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const offset = currentPage * invoicesPerPage;
    const currentPageInvoices = filteredInvoices.slice(offset, offset + invoicesPerPage);

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

                        <div className="search-bar">
                            <input 
                                type="text" 
                                placeholder="Rechercher par nom..." 
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <FaSearch className="search-icon" />
                        </div>

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
