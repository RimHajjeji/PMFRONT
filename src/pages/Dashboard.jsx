import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import "../style/Dashboard.css"; // Assurez-vous que ce fichier CSS existe et correspond à vos besoins.

const Dashboard = () => {
    const [invoices, setInvoices] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

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

    return (
        <div className="dashboard-container-wrapper">
            <div className="dashboard-main-content">
                <div className="dashboard-content-wrapper">
                    <div className="welcome-card">
                        <div className="welcome-text">
                            <h5>Bienvenue Admin! 🎉</h5>
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
                                    {filteredInvoices.map((invoice) => (
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
