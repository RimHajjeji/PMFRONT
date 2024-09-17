import React, { useEffect, useState } from 'react'; 
import { useParams } from 'react-router-dom';
import axios from 'axios';

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

    const formatNumber = (number) => number ? number.toLocaleString() : 'N/A';

    const vehicleRows = devi.vehicles.map((vehicle, index) => (
        <tr key={index}>
            <td>{index + 1}</td>
            <td>{`${vehicle.marque} ${vehicle.modele}`}</td>
            <td>{formatNumber(vehicle.dailyRate)} CFA</td>
            <td>{vehicle.daysQuoted}</td>
            <td>{formatNumber(vehicle.montant)} CFA</td>
        </tr>
    ));

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="invoice-print-container">
            <header className="invoice-header">
                <div className="invoice-header-top">
                    <div className="invoice-logo">
                        <img src="/assets/logo.png" alt="Logo" />
                    </div>
                    <div className="invoice-company-details">
                        <strong>HEAD OFFICE</strong><br />
                        Libreville-Gabon-B.P.8357<br />
                        Blvd Triomphale(Immeuble Centre Guido)<br />
                        Tél: 011 70 75 15 / 060 47 34 10
                    </div>
                </div>
                <div className="invoice-separator"></div>
                <h1>Quote</h1>
                <div>
                    <strong>Quote N°:</strong> {devi.quoteNumber}<br />
                    <strong>Issued by:</strong> {devi.issuedBy}<br />
                    <strong>Date:</strong> {new Date(devi.date).toLocaleDateString()}
                </div>
            </header>

            <section className="client-details-section">
                <h2>The Renter:</h2>
                <div>
                    <strong>Name:</strong> {`${devi.client?.firstName || 'N/A'} ${devi.client?.lastName || 'N/A'}`}<br />
                    <strong>Phone Number:</strong> {devi.client?.phone || 'N/A'}<br />
                    <strong>Email:</strong> {devi.client?.email || 'N/A'}
                </div>
            </section>

            <section className="billing-period-section">
                <h3>Billing Period:</h3>
                <div>
                    {devi.validityPeriod ? (
                        `${new Date(devi.validityPeriod.startDate).toLocaleDateString()} - ${new Date(devi.validityPeriod.endDate).toLocaleDateString()}`
                    ) : 'N/A'}
                </div>
            </section>

            <table className="invoice-details-table">
                <thead>
                    <tr>
                        <th>N°</th>
                        <th>Description</th>
                        <th>Daily Rate</th>
                        <th>Days Quoted</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {vehicleRows}
                </tbody>
            </table>

            <section className="invoice-totals-section">
                <div><strong>Total HT:</strong> {formatNumber(devi.totalHT)} CFA</div>
                <div><strong>TVA 18%:</strong> {formatNumber(devi.tva)} CFA</div>
                <div><strong>CSS 1%:</strong> {formatNumber(devi.css)} CFA</div>
                <div><strong>Total TTC:</strong> {formatNumber(devi.totalTTC)} CFA</div>
                {devi.remise > 0 && (
                    <div><strong>Discount -15%:</strong> {formatNumber(devi.remise)} CFA</div>
                )}
                <div><strong>Total Net:</strong> {formatNumber(devi.totalNet)} CFA</div>
            </section>

            <footer className="invoice-footer">
                <p>Payment Method: {devi.paymentMode || 'Bank Transfer'}</p>
                <p>Account Number: 41093410011 | PREMIUM MOTORS | BGFI BANK GABON</p>
                <p>Payment Terms and Conditions:</p>
                <ul>
                    <li>Payment is due within 15 days</li>
                    <li>Late payments will incur penalties.</li>
                </ul>
            </footer>

            <div className="print-button-wrapper">
                <button onClick={handlePrint} className="invoice-print-button">
                    Print
                </button>
            </div>
        </div>
    );
};

export default Imprimedevis;
