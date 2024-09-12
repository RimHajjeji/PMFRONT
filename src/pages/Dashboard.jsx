import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import "../style/Dashboard.css";

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

    const filteredInvoices = invoices.filter((invoice) =>
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

                        {/* Search bar */}
                        <div className="search-bar">
                            <input 
                                type="text" 
                                placeholder="Rechercher par nom..." 
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <FaSearch className="search-icon" />
                        </div>

                        {/* Invoices table */}
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
                                            <button onClick={() => handlePrint(invoice._id)}>
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
    );
};

export default Dashboard;
