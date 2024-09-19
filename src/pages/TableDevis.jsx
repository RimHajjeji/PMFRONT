import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../style/TableDevis.css"; // Updated CSS file reference

const TableDevis = () => {
    const [devis, setDevis] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDevis = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/devis");
                setDevis(response.data);
            } catch (error) {
                console.error("Error fetching devis:", error);
            }
        };

        fetchDevis();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handlePrint = (devisId) => {
        navigate(`/imprimedevis/${devisId}`);
    };

    // Sort devis by createdAt in descending order
    const sortedDevis = [...devis].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const filteredDevis = sortedDevis.filter((devi) =>
        `${devi.client.firstName} ${devi.client.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="devis-container">
            <div className="devis-header">
                <h3>Liste des Devis</h3>
                <div className="devis-search">
                    <input 
                        type="text" 
                        placeholder="Rechercher par nom..." 
                        value={searchTerm}
                        onChange={handleSearch}
                    />
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
                        {filteredDevis.map((devi) => (
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
        </div>
    );
};

export default TableDevis;
