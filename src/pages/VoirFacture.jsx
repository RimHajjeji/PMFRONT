import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "../style/Imprimefact.css";

const VoirFact = () => {
    const { invoiceId } = useParams(); // Récupérer l'ID de la facture depuis l'URL
    const [invoice, setInvoice] = useState(null);
    const [caution, setCaution] = useState(0); // Initialiser la caution à 0

    // Récupérer les données de la facture depuis le backend
    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/invoices/${invoiceId}`);
                setInvoice(response.data);
                setCaution(response.data.caution); // Initialiser la caution à partir des données de la facture
            } catch (error) {
                console.error("Erreur lors de la récupération de la facture:", error);
            }
        };

        fetchInvoice();
    }, [invoiceId]);

    // Mettre à jour la caution dans le backend
    const handleUpdateCaution = async () => {
        try {
            const updatedInvoice = { caution }; // Données de la caution
            await axios.put(`http://localhost:5000/api/invoices/${invoiceId}`, updatedInvoice);
            alert("Caution mise à jour avec succès");
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la caution:", error);
        }
    };

    // Formatage des nombres
    const formatNumber = (number) => number ? number.toLocaleString() : 'N/A';

    

    const discountPercentage = invoice && invoice.remise && invoice.totalTTC 
    ? ((invoice.remise / invoice.totalTTC) * 100).toFixed(2) 
    : null;



    const vehicleRows = invoice?.vehicles.map((vehicle, index) => (
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

    if (!invoice) {
        return <div>Chargement...</div>;
    }

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

                <div className="client-and-period-container">
                    <div className="client-info-box">
                        <p><strong>Nom :</strong> {`${invoice.client?.firstName || 'N/A'} ${invoice.client?.lastName || 'N/A'}`}</p>
                        <p><strong>Établie par :</strong> {invoice.issuedBy || 'N/A'}</p>
                        <p><strong>Téléphone :</strong> {invoice.client?.phone || 'N/A'}</p>
                        <p><strong>Code Client :</strong> {invoice.client?.codeClient || 'N/A'}</p>
                        <p><strong>Type Client :</strong> {invoice.client?.typeClient || 'N/A'}</p>
                        <p><strong>Email :</strong> {invoice.client?.email || 'N/A'}</p>
                        <p><strong>NIF :</strong> {invoice.client?.nif || 'N/A'}</p>
                        <p><strong>RCCM :</strong> {invoice.client?.rccm || 'N/A'}</p>
                        <p><strong>Représentant(e) Autorisé(e) :</strong> {invoice.client?.representant || 'N/A'}</p>
                        <p><strong>Adresse :</strong> Libreville - Gabon</p>
                    </div>

                    <div className="billing-infoFACT">
                        {/* Ligne Numéro de Facture */}
                        <p className="title">Numéro de Facture :</p>
                        <p className="value">{invoice.invoiceNumber}</p>

                        {/* Ligne Date */}
                        <p className="title">Date :</p>
                        <p className="value">{new Date(invoice.date).toLocaleDateString()}</p>

                        {/* Période Locative */}
                        <h3>Période Locative :</h3>
                        
                        <p className="value">
                            {invoice.billingPeriod
                                ? `${new Date(invoice.billingPeriod.startDate).toLocaleDateString()} - ${new Date(invoice.billingPeriod.endDate).toLocaleDateString()}`
                                : 'N/A'}
                        </p>

                        {/* Section Caution */}
                        <div className="caution-section">
                            <label className='caut' htmlFor="caution">Caution (en CFA) :</label>
                            <input
                                type="number"
                                id="caution"
                                value={caution}
                                onChange={(e) => setCaution(e.target.value)}
                                placeholder="0"
                                readOnly
                            />
                            <br />
                    
                        </div>
                    </div>
                </div>
            </header>

            {/* Champ caution */}
           

            <table className="print-table">
                <thead>
                    <tr>
                        <th>N°</th>
                        <th>Description</th>
                        <th>{invoice.vehicles.length > 0 ? invoice.vehicles[0].tarifType || 'N/A' : 'N/A'}</th>
                        <th>{invoice.vehicles.length > 0 ? invoice.vehicles[0].durationType || 'N/A' : 'N/A'}</th>
                       
                        <th>Montant</th>
                    </tr>
                </thead>
                <tbody>
                    {vehicleRows}
                </tbody>
            </table>

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
                            <td>Frais de Kilométrage</td>
                            <td>{formatNumber(invoice.fraisSupplementaires.fraisKilometrage)} CFA</td>
                        </tr>
                        <tr>
                            <td>Frais de Livraison</td>
                            <td>{formatNumber(invoice.fraisSupplementaires.fraisLivraison)} CFA</td>
                        </tr>
                        <tr>
                            <td>Frais de Chauffeur</td>
                            <td>{formatNumber(invoice.fraisSupplementaires.fraisChauffeur)} CFA</td>
                        </tr>
                        <tr>
                            <td>Frais de Carburant</td>
                            <td>{formatNumber(invoice.fraisSupplementaires.fraisCarburant)} CFA</td>
                        </tr>
                        <tr>
                            <td>Accompte</td>
                            <td>{formatNumber(invoice.acompte)} CFA</td>
                        </tr>
                        <tr>
                            <td>Montant Remboursement</td>
                            <td>{formatNumber(invoice.montantRemboursement)} CFA</td>
                        </tr>
                    </tbody>

                </table>

                <table className="right-table">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Montant</th>
                        </tr>
                    </thead>
                    <tbody>
                       
                    <tr>
                            <td>Total HT + Frais Supplémentaires</td>
                            <td>{formatNumber(invoice.totalHTFrais)} CFA</td>
                        </tr> 
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
                        <tr>
                            <td>Remise {discountPercentage ? `(${discountPercentage}%)` : ''}</td>
                            <td>{formatNumber(invoice.remise)} CFA</td>
                        </tr>
                        <tr>
                            <td>Total Net </td>
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

export default VoirFact;
