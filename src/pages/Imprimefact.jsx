import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "../style/Imprimefact.css";

const Imprimefact = () => {
    const { invoiceId } = useParams();
    const [invoice, setInvoice] = useState(null);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/invoices/${invoiceId}`);
                setInvoice(response.data);
            } catch (error) {
                console.error("Error fetching invoice:", error);
            }
        };

        fetchInvoice();
    }, [invoiceId]);

    if (!invoice) {
        return <div>Loading...</div>;
    }

    // Helper function to safely format numbers
    const formatNumber = (number) => number ? number.toLocaleString() : 'N/A';

    // Format the vehicle details into the table
    const vehicleRows = invoice.vehicles.map((vehicle, index) => (
        <tr key={index}>
            <td>{index + 1}</td>
            <td>{`${vehicle.marque} ${vehicle.modele}`}</td>
            <td>{formatNumber(vehicle.dailyRate)} CFA</td>
            <td>{vehicle.daysRented}</td>
            <td>{formatNumber(vehicle.montant)} CFA</td>
        </tr>
    ));

    // Print the invoice
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="print-area">
            <header className="print-header">
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
                <div className="separatorF"></div>
                <h1>FACTURE</h1>
                <div>
                    <strong>Facture N°:</strong> {invoice.invoiceNumber}<br />
                    <strong>Établie par:</strong> {invoice.issuedBy}<br />
                    <strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}
                </div>
            </header>

            <section className="print-client-info">
                <h2>Le Locataire:</h2>
                <div>
                    <strong>Nom:</strong> {`${invoice.client?.firstName || 'N/A'} ${invoice.client?.lastName || 'N/A'}`}<br />
                    <strong>Numéro de Téléphone:</strong> {invoice.client?.phone || 'N/A'}<br />
                    <strong>Email:</strong> {invoice.client?.email || 'N/A'}
                </div>
            </section>

            <section className="billing-period">
                <h3>Période de facturation:</h3>
                <div>
                    {invoice.billingPeriod ? (
                        `${new Date(invoice.billingPeriod.startDate).toLocaleDateString()} - ${new Date(invoice.billingPeriod.endDate).toLocaleDateString()}`
                    ) : 'N/A'}
                </div>
            </section>

            <table className="print-table">
                <thead>
                    <tr>
                        <th>N°</th>
                        <th>Description</th>
                        <th>Tarif Journalier</th>
                        <th>Nombre de Jours Facturés</th>
                        <th>Montant</th>
                    </tr>
                </thead>
                <tbody>
                    {vehicleRows}
                </tbody>
            </table>

            <section className="print-totals">
                <div><strong>Total HT:</strong> {formatNumber(invoice.totalHT)} CFA</div>
                <div><strong>TVA 18%:</strong> {formatNumber(invoice.tva)} CFA</div>
                <div><strong>CSS 1%:</strong> {formatNumber(invoice.css)} CFA</div>
                <div><strong>Total TTC:</strong> {formatNumber(invoice.totalTTC)} CFA</div>
                {invoice.remise > 0 && (
                    <div><strong>Remise :</strong> {formatNumber(invoice.remise)} CFA</div>
                )}
                <div><strong>Total Net:</strong> {formatNumber(invoice.totalNet)} CFA</div>
            </section>

            <footer className="print-footer">
                <p>Mode de paiement: {invoice.paymentMode || 'Virement bancaire'}</p>
                <p>N° de compte: 41093410011 | PREMIUM MOTORS | BGFI BANK GABON</p>
                <p>Conditions et modalités de paiement:</p>
                <ul>
                    <li>Le paiement est dû dans 15 jours</li>
                    <li>Tout retard de paiement entraînera des pénalités.</li>
                </ul>
            </footer>

            {/* Print button */}
            <div className="print-button-container">
                <button onClick={handlePrint} className="print-button">
                    Imprimer
                </button>
            </div>
        </div>
    );
};

export default Imprimefact;
