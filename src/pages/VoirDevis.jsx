import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "../style/Imprimedevis.css";

const VoirDevis = () => {
    
    const { devisId } = useParams();
    const [devis, setDevis] = useState(null);
    const [caution, setCaution] = useState(0); // Initialiser la caution à 0

    useEffect(() => {
        const fetchDevis = async () => {
            try {
                const response = await axios.get(`https://envoices.premiummotorscars.com/api/devis/${devisId}`);
                setDevis(response.data);
                setCaution(response.data.caution); 
            } catch (error) {
                console.error("Erreur lors de la récupération de la DEVIS:", error);
            }
        };

        fetchDevis();
    }, [ devisId ]);

    // Mettre à jour la caution dans le backend
    const handleUpdateCaution = async () => {
        try {
            const updatedDevis = { caution }; // Données de la caution
            await axios.put(`https://envoices.premiummotorscars.com/api/devis/${devisId}`, updatedDevis);
            alert("Caution mise à jour avec succès");
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la caution:", error);
        }
    };

    // Formatage des nombres
    const formatNumber = (number) => number ? number.toLocaleString() : 'N/A';

    

    const discountPercentage = devis && devis.remise && devis.totalTTC 
    ? ((devis.remise / devis.totalTTC) * 100).toFixed(2) 
    : null;



    const vehicleRows = devis?.vehicles.map((vehicle, index) => (
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

    if (!devis) {
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
                        <h1>Devis</h1>
                    </div>
                </div>
                <div className="separatorF"></div>

                <div className="client-and-period-container">
                    <div className="client-info-box">
                        <p><strong>Nom :</strong> {`${devis.client?.firstName || 'N/A'} ${devis.client?.lastName || 'N/A'}`}</p>
                        <p><strong>Établie par :</strong> {devis.issuedBy || 'N/A'}</p>
                        <p><strong>Téléphone :</strong> {devis.client?.phone || 'N/A'}</p>
                        <p><strong>Code Client :</strong> {devis.client?.codeClient || 'N/A'}</p>
                        <p><strong>Type Client :</strong> {devis.client?.typeClient || 'N/A'}</p>
                        <p><strong>Email :</strong> {devis.client?.email || 'N/A'}</p>
                        <p><strong>NIF :</strong> {devis.client?.nif || 'N/A'}</p>
                        <p><strong>RCCM :</strong> {devis.client?.rccm || 'N/A'}</p>
                        <p><strong>Représentant(e) Autorisé(e) :</strong> {devis.client?.representant || 'N/A'}</p>
                        <p><strong>Adresse :</strong> Libreville - Gabon</p>
                    </div>

                    <div className="billing-infoFACT">
                        {/* Ligne Numéro de Facture */}
                        <p className="title"><strong>Numéro de Devis :</strong></p>
                        <p className="value">{devis.devisNumber}</p>

                        {/* Ligne Date */}
                        <p className="title"><strong>Date :</strong></p>
                        <p className="value">{new Date(devis.date).toLocaleDateString()}</p>

                        {/* Période Locative */}
                        <h3>Période Locative :</h3>
                        <p className="value">
                            {devis.billingPeriod ? (
                                `${new Date(devis.billingPeriod.startDate).toLocaleDateString()} - ${new Date(devis.billingPeriod.endDate).toLocaleDateString()}`
                            ) : 'N/A'}
                        </p> 
                    </div>
                </div>
            </header>
            <table className="print-table">
                <thead>
                    <tr>
                        <th>N°</th>
                        <th>Description</th>
                        <th>{devis.vehicles.length > 0 ? devis.vehicles[0].tarifType || 'N/A' : 'N/A'}</th>
                        <th>{devis.vehicles.length > 0 ? devis.vehicles[0].durationType || 'N/A' : 'N/A'}</th>
                       
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
                            <td>{formatNumber(devis.fraisSupplementaires.fraisKilometrage)} CFA</td>
                        </tr>
                        <tr>
                            <td>Frais de Livraison</td>
                            <td>{formatNumber(devis.fraisSupplementaires.fraisLivraison)} CFA</td>
                        </tr>
                        <tr>
                            <td>Frais de Chauffeur</td>
                            <td>{formatNumber(devis.fraisSupplementaires.fraisChauffeur)} CFA</td>
                        </tr>
                        <tr>
                            <td>Frais de Carburant</td>
                            <td>{formatNumber(devis.fraisSupplementaires.fraisCarburant)} CFA</td>
                        </tr>
                        <tr>
                            <td>Accompte</td>
                            <td>{formatNumber(devis.acompte)} CFA</td>
                        </tr>
                        <tr>
                            <td>Montant Remboursement</td>
                            <td>{formatNumber(devis.montantRemboursement)} CFA</td>
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
                            <td>{formatNumber(devis.totalHTFrais)} CFA</td>
                        </tr> 
                    <tr>
                            <td>TVA 18%</td>
                            <td>{formatNumber(devis.tva)} CFA</td>
                        </tr>
                        <tr>
                            <td>CSS 1%</td>
                            <td>{formatNumber(devis.css)} CFA</td>
                        </tr>
                        <tr>
                            <td>Total TTC</td>
                            <td>{formatNumber(devis.totalTTC)} CFA</td>
                        </tr>      
                        <tr>
                            <td>Remise {discountPercentage ? `(${discountPercentage}%)` : ''}</td>
                            <td>{formatNumber(devis.remise)} CFA</td>
                        </tr>
                        <tr>
                            <td>Total Net </td>
                            <td>{formatNumber(devis.totalNet)} CFA</td>
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

export default VoirDevis;
