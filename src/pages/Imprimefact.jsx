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
                const response = await axios.get(`https://envoices.premiummotorscars.com/api/invoices/${invoiceId}`);
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

    const formatNumber = (number) => number ? number.toLocaleString() : 'N/A';

    // Calculer le pourcentage de remise si une remise est appliquée
    const discountPercentage = invoice.remise && invoice.totalTTC ? ((invoice.remise / invoice.totalTTC) * 100).toFixed(2) : null;

    const vehicleRows = invoice.vehicles.map((vehicle, index) => (
        <tr key={index}>
            <td>{index + 1}</td>
            <td>{`${vehicle.marque} ${vehicle.modele}`}</td>
            <td>{formatNumber(vehicle.dailyRate)} CFA</td>
            <td>{vehicle.daysRented}</td>
            <td>{formatNumber(vehicle.montant)} CFA</td>
        </tr>
    ));

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
                        <h1>FACTURE</h1>
                    </div>
                </div>
                <div className="separatorF"></div>
                
                <div className="client-info-box">
                    <p><strong>Nom :</strong> {`${invoice.client?.firstName || 'N/A'} ${invoice.client?.lastName || 'N/A'}`}</p>
                    <p><strong>Téléphone :</strong> {invoice.client?.phone || 'N/A'}</p>
                    <p><strong>Code Client :</strong> {invoice.client?.codeClient || 'N/A'}</p>
                    <p><strong>Type Client :</strong> {invoice.client?.typeClient || 'N/A'}</p>
                    <p><strong>Email :</strong> {invoice.client?.email || 'N/A'}</p>
                    <p><strong>NIF :</strong> {invoice.client?.nif || 'N/A'}</p>
                    <p><strong>RCCM :</strong> {invoice.client?.rccm || 'N/A'}</p>
                    <p><strong>Représentant(e) Autorisé(e) :</strong> {invoice.client?.representant || 'N/A'}</p>
                    <p><strong>Adresse :</strong> Libreville - Gabon</p>
                </div>
                
                <table className="invoice-info-table">
                    <tbody>
                        <tr>
                            <td><strong>Numéro de Facture :</strong> {invoice.invoiceNumber}</td>
                            <td><strong>Date :</strong> {new Date(invoice.date).toLocaleDateString()}</td>
                        </tr>
                    </tbody>
                </table>
            </header>

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

            <section className="billing-period">
                
                <div>
                    <h3>Période Locative:</h3>
                    {invoice.billingPeriod ? (
                        `${new Date(invoice.billingPeriod.startDate).toLocaleDateString()} - ${new Date(invoice.billingPeriod.endDate).toLocaleDateString()}`
                    ) : 'N/A'}
                </div>
            </section>

            <div className="financial-tables">
                <table className="left-table">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Montant</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>TVA 18%</td>
                            <td>{formatNumber(invoice.tva)} CFA</td>
                        </tr>
                        <tr>
                            <td>CSS 1%</td>
                            <td>{formatNumber(invoice.css)} CFA</td>
                        </tr>
                        <tr>
                            <td>Total TTC</td>
                            <td>{formatNumber(invoice.totalTTC)} CFA</td>
                        </tr>
                    </tbody>
                </table>

                <table className="right-table">
                    <thead>
                        <tr>
                            {/* Ajouter le pourcentage de remise dans l'en-tête du tableau */}
                            <th>Remise {discountPercentage ? `(${discountPercentage}%)` : ''}</th>
                            <th>Total Net</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {/* Afficher la valeur finale de la remise dans la cellule du tableau */}
                            <td>{formatNumber(invoice.remise)} CFA</td>
                            <td>{formatNumber(invoice.totalNet)} CFA</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <footer className="print-footer">
                <p>BICIG GABON Compte N°40001 09070 10038300 50 137</p>
                <p>BGFIBANK Compte N°40003 04105 41093410011 33</p>
                <p className="signature-section">
                    <span className="left-signature">Le Service de Location</span>
                    <span className="right-signature">Le Client " Bon pour Accord "</span>
                </p>
            </footer>

            <div className="blue-strip">
                <p>PREMIUM MOTORS, Société par Actions Simplifiée avec Conseil d'Administration au Capital de 20.000.000 Fcfa<br></br>
                Siège social : Boulevard Triomphal, Centre Guido / Tél. : (+241) 11707515 - 011760568 - BP : 8357 Libreville<br></br>
                Mail : commercial@premiummotorscars.com - Site web : www.premiummotorscars.com / RCCM : GA-LBV-04-2022. B16-00059 - NIF : 20220101016209 A</p>
            </div>

            <div className="print-button-container">
                <button onClick={handlePrint} className="print-button">
                    Imprimer
                </button>
            </div>
        </div>
    );
};
 

export default Imprimefact;
