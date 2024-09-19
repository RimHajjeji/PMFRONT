import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "../style/Imprimefact.css";

const Imprimedevis = () => {
    const { devisId } = useParams();
    const [devis, setDevis] = useState(null);

    useEffect(() => {
        const fetchDevis = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/devis/${devisId}`);
                setDevis(response.data);
            } catch (error) {
                console.error("Error fetching quote:", error);
            }
        };

        fetchDevis();
    }, [devisId]);

    if (!devis) {
        return <div>Loading...</div>;
    }

    // Helper function to safely format numbers
    const formatNumber = (number) => number ? number.toLocaleString() : 'N/A';

    // Calculate discount percentage if a discount is applied
    const discountPercentage = devis.remise && devis.totalTTC ? ((devis.remise / devis.totalTTC) * 100).toFixed(2) : null;

    // Format the vehicle details into the table
    const vehicleRows = devis.vehicles.map((vehicle, index) => (
        <tr key={index}>
            <td>{index + 1}</td>
            <td>{`${vehicle.marque} ${vehicle.modele}`}</td>
            <td>{formatNumber(vehicle.dailyRate)} CFA</td>
            <td>{vehicle.daysRented}</td>
            <td>{formatNumber(vehicle.montant)} CFA</td>
        </tr>
    ));

    // Print the quote
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
                <h1>DEVIS</h1>
                <div>
                    <strong>Devis N°:</strong> {devis.devisNumber}<br />
                    <strong>Établi par:</strong> {devis.issuedBy}<br />
                    <strong>Date:</strong> {new Date(devis.date).toLocaleDateString()}
                </div>
            </header>

            <section className="print-client-info">
                <h2>Le Locataire:</h2>
                <div>
                    <strong>Nom:</strong> {`${devis.client?.firstName || 'N/A'} ${devis.client?.lastName || 'N/A'}`}<br />
                    <strong>Numéro de Téléphone:</strong> {devis.client?.phone || 'N/A'}<br />
                    <strong>Code client:</strong> {devis.client?.codeClient || 'N/A'}<br />
                    <strong>Type Client:</strong> {devis.client?.typeClient || 'N/A'}<br />
                    <strong>Email:</strong> {devis.client?.email || 'N/A'}
                </div>
            </section>

            <section className="billing-period">
                <h3>Période de devis:</h3>
                <div>
                    {devis.billingPeriod ? (
                        `${new Date(devis.billingPeriod.startDate).toLocaleDateString()} - ${new Date(devis.billingPeriod.endDate).toLocaleDateString()}`
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
                <div><strong>Total HT:</strong> {formatNumber(devis.totalHT)} CFA</div>
                <div><strong>TVA 18%:</strong> {formatNumber(devis.tva)} CFA</div>
                <div><strong>CSS 1%:</strong> {formatNumber(devis.css)} CFA</div>
                <div><strong>Total TTC:</strong> {formatNumber(devis.totalTTC)} CFA</div>
                {devis.remise > 0 && discountPercentage && (
                    <div><strong>Remise ({discountPercentage}%):</strong> {formatNumber(devis.remise)} CFA</div>
                )}
                <div><strong>Total Net:</strong> {formatNumber(devis.totalNet)} CFA</div>
            </section>

            <footer className="print-footer">
                <p>Mode de paiement: {devis.paymentMode || 'Virement bancaire'}</p>
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

export default Imprimedevis;
