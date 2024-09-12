import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "../style/Imprimefact.css";

const Imprimedevis = () => {
    const { devisId } = useParams();
    const [devi, setDevi] = useState(null);

    useEffect(() => {
        const fetchDevi = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/devis/${devisId}`);
                setDevi(response.data);
            } catch (error) {
                console.error("Error fetching devi:", error);
            }
        };

        fetchDevi();
    }, [devisId]);

    if (!devi) {
        return <div>Loading...</div>;
    }

    // Helper function to safely format numbers
    const formatNumber = (number) => number ? number.toLocaleString() : 'N/A';

    // Format the vehicle details into the table
    const vehicleRows = devi.vehicles.map((vehicle, index) => (
        <tr key={index}>
            <td>{index + 1}</td>
            <td>{`${vehicle.marque} ${vehicle.modele}`}</td>
            <td>{formatNumber(vehicle.dailyRate)} CFA</td>
            <td>{vehicle.daysQuoted}</td>
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
                    <div className="logoD">
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
                <h1>Devis</h1>
                <div>
                    <strong>Devis N°:</strong> {devi.quoteNumber}<br />
                    <strong>Établie par:</strong> {devi.issuedBy}<br />
                    <strong>Date:</strong> {new Date(devi.date).toLocaleDateString()}
                </div>
            </header>

            <section className="print-client-info">
                <h2>Le Locataire:</h2>
                <div>
                    <strong>Nom:</strong> {`${devi.client?.firstName || 'N/A'} ${devi.client?.lastName || 'N/A'}`}<br />
                    <strong>Numéro de Téléphone:</strong> {devi.client?.phone || 'N/A'}<br />
                    <strong>Email:</strong> {devi.client?.email || 'N/A'}
                </div>
            </section>

            <section className="billing-period">
                <h3>Période de facturation:</h3>
                <div>
                    {devi.validityPeriod? (
                        `${new Date(devi.validityPeriod.startDate).toLocaleDateString()} - ${new Date(devi.validityPeriod.endDate).toLocaleDateString()}`
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
                <div><strong>Total HT:</strong> {formatNumber(devi.totalHT)} CFA</div>
                <div><strong>TVA 18%:</strong> {formatNumber(devi.tva)} CFA</div>
                <div><strong>CSS 1%:</strong> {formatNumber(devi.css)} CFA</div>
                <div><strong>Total TTC:</strong> {formatNumber(devi.totalTTC)} CFA</div>
                {devi.remise > 0 && (
                    <div><strong>Remise -15%:</strong> {formatNumber(devi.remise)} CFA</div>
                )}
                <div><strong>Total Net:</strong> {formatNumber(devi.totalNet)} CFA</div>
            </section>

            <footer className="print-footer">
                <p>Mode de paiement: {devi.paymentMode || 'Virement bancaire'}</p>
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
