import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/Facture.css";

const Facture = () => {
  const [clients, setClients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [issuedBy, setIssuedBy] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [billingPeriod, setBillingPeriod] = useState({
    startDate: "",
    endDate: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [rentedVehicles, setRentedVehicles] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [dailyRate, setDailyRate] = useState("");
  const [daysRented, setDaysRented] = useState("");
  const [isDiscountPopupOpen, setIsDiscountPopupOpen] = useState(false);
  const [remise, setRemise] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      const response = await axios.get("http://localhost:5000/api/clients");
      setClients(response.data);
    };

    const fetchCategories = async () => {
      const response = await axios.get("http://localhost:5000/api/categories/categories");
      setCategories(response.data);
    };

    const fetchInvoiceNumber = async () => {
      const response = await axios.get("http://localhost:5000/api/invoices");
      const nextInvoiceNumber = response.data.length + 1;
      setInvoiceNumber(nextInvoiceNumber.toString().padStart(7, "0"));
    };

    fetchClients();
    fetchCategories();
    fetchInvoiceNumber();
  }, []);

  const handleClientSelect = (clientId) => {
    const client = clients.find((c) => c._id === clientId);
    setSelectedClient(client);
  };

  const handleCategorySelect = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    setSelectedCategory(categoryId);
    setVehicles(category.vehicles);
  };

  const handleVehicleSelect = (index) => {
    const vehicle = vehicles[index];
    setSelectedVehicle(vehicle);
    setIsPopupOpen(true);
  };

  const handleAddVehicle = () => {
    if (!dailyRate || !daysRented || !selectedVehicle) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const montant = dailyRate * daysRented;

    setRentedVehicles([
      ...rentedVehicles,
      {
        marque: selectedVehicle.marque,
        modele: selectedVehicle.modele,
        dailyRate,
        daysRented,
        montant,
      },
    ]);

    setIsPopupOpen(false);
    setDailyRate("");
    setDaysRented("");
    setSelectedVehicle("");
    setSelectedCategory("");
    setVehicles([]);
  };

  const calculateTotalHT = () => {
    return rentedVehicles.reduce((total, vehicle) => total + vehicle.montant, 0);
  };

  const calculateTVA = () => {
    return calculateTotalHT() * 0.18;
  };

  const calculateCSS = () => {
    return calculateTotalHT() * 0.01;
  };

  const calculateTotalTTC = () => {
    return calculateTotalHT() + calculateTVA() + calculateCSS();
  };

  const calculateRemise = () => {
    return calculateTotalTTC() * 0.15;
  };

  const handleDiscountPopup = () => {
    setIsDiscountPopupOpen(true);
  };

  const handleDiscountYes = () => {
    setRemise(calculateRemise());
    setIsDiscountPopupOpen(false);
  };

  const handleDiscountNo = () => {
    setIsDiscountPopupOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalHT = calculateTotalHT();
    const newInvoice = {
      clientId: selectedClient._id,
      issuedBy,
      billingPeriod,
      vehicles: rentedVehicles,
      totalHT,
      tva: calculateTVA(),
      css: calculateCSS(),
      totalTTC: calculateTotalTTC(),
      remise: remise || 0, // Add remise in case it exists
    };

    await axios.post("http://localhost:5000/api/invoices/add", newInvoice);
    alert("Facture créée avec succès");
  };

  return (
    <div className="wrapperF">
      <div className="facture-containerF">
        <div className="headerF">
          <div className="logoF">
            <img src="/assets/logo.png" alt="Logo" />
          </div>
          <div className="company-infoF">
            <strong>SIEGE SOCIAL</strong>
            <br />
            Libreville-Gabon-B.P.8357
            <br />
            Blvd Triomphale(Immeuble Centre Guido)
            <br />
            Tél: 011 70 75 15 / 060 47 34 10
          </div>
        </div>

        <div className="separatorF"></div>

        <form onSubmit={handleSubmit}>
          <div className="client-infoF">
            <div className="left-sectionF">
              <strong>Facturé à</strong>
              <br />
              <br />
              <strong className="highlighted-textF">Le Locataire:</strong>
              <select onChange={(e) => handleClientSelect(e.target.value)} required>
                <option value="">Sélectionner un client</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.firstName} {client.lastName}
                  </option>
                ))}
              </select>
              <br />
              <strong>N° de Téléphone:</strong> {selectedClient?.phone}
              <br />
              <strong>Email:</strong> {selectedClient?.email}
              <br />
            </div>

            <div className="right-sectionF">
              <strong className="highlighted-text-largeF">FACTURE</strong>
              <br />
              <strong>Facture N°:</strong> {invoiceNumber}
              <br />
              <strong>Etablie Par:</strong>
              <input
                type="text"
                value={issuedBy}
                onChange={(e) => setIssuedBy(e.target.value)}
                required
              />
              <br />
              <strong>Date:</strong> {date}
              <br />
              <strong>Période de Facturation:</strong>
              <br />
              <input
                type="date"
                value={billingPeriod.startDate}
                onChange={(e) =>
                  setBillingPeriod({ ...billingPeriod, startDate: e.target.value })
                }
                required
              />
              <input
                type="date"
                value={billingPeriod.endDate}
                onChange={(e) =>
                  setBillingPeriod({ ...billingPeriod, endDate: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="vehicle-selectionF">
            <h3>Sélectionner un véhicule à louer</h3>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategorySelect(e.target.value)}
              required={rentedVehicles.length === 0}
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <br />
            <select
              value={selectedVehicle ? vehicles.indexOf(selectedVehicle) : ""}
              onChange={(e) => handleVehicleSelect(e.target.value)}
              required={rentedVehicles.length === 0}
              disabled={!selectedCategory}
            >
              <option value="">Sélectionner un véhicule</option>
              {vehicles.map((vehicle, index) => (
                <option key={index} value={index}>
                  {vehicle.marque} {vehicle.modele}
                </option>
              ))}
            </select>
          </div>

          <div className="vehicle-listF">
            <h3>Véhicules Loués</h3>
            <table className="vehicle-tableF">
              <thead>
                <tr>
                  <th>Marque</th>
                  <th>Modèle</th>
                  <th>Tarif Journalier</th>
                  <th>Nbre de Jours</th>
                  <th>Montant</th>
                </tr>
              </thead>
              <tbody>
                {rentedVehicles.map((vehicle, index) => (
                  <tr key={index}>
                    <td>{vehicle.marque}</td>
                    <td>{vehicle.modele}</td>
                    <td>{vehicle.dailyRate} FCFA</td>
                    <td>{vehicle.daysRented}</td>
                    <td>{vehicle.montant} FCFA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isPopupOpen && (
            <div className="popupF">
              <h3>Ajouter Détails du Véhicule</h3>
              <label>Tarif Journalier:</label>
              <input
                type="number"
                value={dailyRate}
                onChange={(e) => setDailyRate(e.target.value)}
                required
              />
              <label>Nbre de Jours Loués:</label>
              <input
                type="number"
                value={daysRented}
                onChange={(e) => setDaysRented(e.target.value)}
                required
              />
              <br />
              <button type="button" onClick={handleAddVehicle}>
                Ajouter
              </button>
            </div>
          )}

          <div className="total-sectionF">
            <div>
              <strong>Total HT:</strong> {calculateTotalHT()} FCFA
            </div>
            <div>
              <strong>TVA (18%):</strong> {calculateTVA()} FCFA
            </div>
            <div>
              <strong>CSS (1%):</strong> {calculateCSS()} FCFA
            </div>
            <div>
              <strong>Total TTC:</strong> {calculateTotalTTC()} FCFA
            </div>
            {remise !== null && (
              <div>
                <strong>Remise (15%):</strong> {remise} FCFA
              </div>
            )}
          </div>

          {!remise && (
            <button type="button" className="remise-buttonF" onClick={handleDiscountPopup}>
              Remise -15%
            </button>
          )}

          {isDiscountPopupOpen && (
            <div className="popupF">
              <h3>Voulez-vous appliquer une remise de 15% ?</h3>
              <button onClick={handleDiscountYes}>Oui</button>
              <button onClick={handleDiscountNo}>Non</button>
            </div>
          )}

          <button type="submit" className="submit-buttonF">
            Créer la Facture
          </button>
        </form>
      </div>
    </div>
  );
};

export default Facture;
