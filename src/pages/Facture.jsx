import React, { useState, useEffect } from "react";
import axios from "axios";
import '../style/Facture.css';

const Facture = () => {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [issuedBy, setIssuedBy] = useState("");
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [date, setDate] = useState(new Date().toISOString().substring(0, 10));

    useEffect(() => {
        const fetchClients = async () => {
            const response = await axios.get("http://localhost:5000/api/clients");
            setClients(response.data);
        };

        const fetchInvoiceNumber = async () => {
            const response = await axios.get("http://localhost:5000/api/invoices");
            const nextInvoiceNumber = response.data.length + 1;
            setInvoiceNumber(nextInvoiceNumber.toString().padStart(7, '0'));
        };

        fetchClients();
        fetchInvoiceNumber();
    }, []);

    const handleClientSelect = (clientId) => {
        const client = clients.find(c => c._id === clientId);
        setSelectedClient(client);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newInvoice = {
            clientId: selectedClient._id,
            issuedBy,
        };

        await axios.post("http://localhost:5000/api/invoices/add", newInvoice);
        alert("Invoice created successfully");
    };

    return (
        <div className="wrapperF">
            <div className="facture-containerF">
                <div className="headerF">
                    <div className="logoF">
                        <img src="/assets/logo.png" alt="Logo" />
                    </div>
                    <div className="company-infoF">
                        <strong>SIEGE SOCIAL</strong><br />
                        Libreville-Gabon-B.P.8357<br />
                        Blvd Triomphale(Immeuble Centre Guido)<br />
                        Tél: 011 70 75 15 / 060 47 34 10
                    </div>
                </div>

                <div className="separatorF"></div> {/* Ligne bleue */}

                <form onSubmit={handleSubmit}>
                    <div className="client-infoF">
                        <div className="left-sectionF">
                            <strong>Facturé à</strong><br /><br />
                            <strong className="highlighted-textF">Le Locataire:</strong>
                            <select onChange={(e) => handleClientSelect(e.target.value)} required>
                                <option value="">Select Client</option>
                                {clients.map(client => (
                                    <option key={client._id} value={client._id}>
                                        {client.firstName} {client.lastName}
                                    </option>
                                ))}
                            </select>
                            <br />
                            <strong>N° de Téléphone:</strong> {selectedClient?.phone}<br />
                            <strong>Email:</strong> {selectedClient?.email}<br />
                        </div>

                        <div className="right-sectionF">
                            <strong className="highlighted-text-largeF">FACTURE</strong><br />
                            <strong>Facture N°:</strong> {invoiceNumber}<br />
                            <strong>Etablie Par:</strong>
                            <input 
                                type="text" 
                                value={issuedBy} 
                                onChange={(e) => setIssuedBy(e.target.value)} 
                                required 
                            /><br />
                            <strong>Date:</strong> {date}<br />
                        </div>
                    </div>
                    <button type="submit" className="submit-buttonF">Enregistrer la Facture</button>
                </form>
            </div>
        </div>
    );
};

export default Facture;
