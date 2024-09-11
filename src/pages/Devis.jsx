import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "../style/Devis.css";

const Devis = () => {
  const [clients, setClients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [issuedBy, setIssuedBy] = useState("");
  const [quoteNumber, setQuoteNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [validityPeriod, setValidityPeriod] = useState({
    startDate: "",
    endDate: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [quotedVehicles, setQuotedVehicles] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [dailyRate, setDailyRate] = useState("");
  const [daysQuoted, setDaysQuoted] = useState("");
  const [isDiscountPopupOpen, setIsDiscountPopupOpen] = useState(false);
  const [remise, setRemise] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      const response = await axios.get("http://localhost:5000/api/clients");
      setClients(response.data);
    };

    const fetchCategories = async () => {
      const response = await axios.get("http://localhost:5000/api/categories/categories");
      setCategories(response.data);
    };

    const fetchQuoteNumber = async () => {
      const response = await axios.get("http://localhost:5000/api/devis");
      const nextQuoteNumber = response.data.length + 1;
      setQuoteNumber(nextQuoteNumber.toString().padStart(7, "0"));
    };

    fetchClients();
    fetchCategories();
    fetchQuoteNumber();
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
    if (!dailyRate || !daysQuoted || !selectedVehicle) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const montant = dailyRate * daysQuoted;

    setQuotedVehicles([
      ...quotedVehicles,
      {
        marque: selectedVehicle.marque,
        modele: selectedVehicle.modele,
        dailyRate,
        daysQuoted,
        montant,
      },
    ]);

    setIsPopupOpen(false);
    setDailyRate("");
    setDaysQuoted("");
    setSelectedVehicle("");
    setSelectedCategory("");
    setVehicles([]);
  };

  const calculateTotalHT = () => {
    return quotedVehicles.reduce((total, vehicle) => total + vehicle.montant, 0);
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

  const calculateTotalNet = () => {
    return remise ? calculateTotalTTC() - remise : calculateTotalTTC();
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
    if (!selectedClient || !issuedBy || !validityPeriod.startDate || !validityPeriod.endDate || quotedVehicles.length === 0) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const newDevis = {
      clientId: selectedClient._id,
      issuedBy,
      validityPeriod,
      vehicles: quotedVehicles,
      totalHT: calculateTotalHT(),
      tva: calculateTVA(),
      css: calculateCSS(),
      totalTTC: calculateTotalTTC(),
      remise: remise || 0,
      totalNet: calculateTotalNet(),
    };

    try {
      const response = await axios.post("http://localhost:5000/api/devis/add", newDevis);
      alert("Devis créé avec succès");
      navigate('/dashboard');
    } catch (error) {
      console.error("Erreur lors de l'ajout du devis :", error);
    }
  };

  return (
    <div className="wrapperD">
      <div className="devis-containerD">
        <h1>Créer un Devis</h1>
        <form onSubmit={handleSubmit}>
          <div className="devis-section">
            <label>Client:</label>
            <select onChange={(e) => handleClientSelect(e.target.value)} value={selectedClient?._id || ""}>
              <option value="">Sélectionner un client</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.firstName} {client.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="devis-section">
            <label>Émis par:</label>
            <input type="text" value={issuedBy} onChange={(e) => setIssuedBy(e.target.value)} required />
          </div>

          <div className="devis-section">
            <label>Période de Validité:</label>
            <input
              type="date"
              value={validityPeriod.startDate}
              onChange={(e) => setValidityPeriod({ ...validityPeriod, startDate: e.target.value })}
              required
            />
            <input
              type="date"
              value={validityPeriod.endDate}
              onChange={(e) => setValidityPeriod({ ...validityPeriod, endDate: e.target.value })}
              required
            />
          </div>

          <div className="vehicle-selectionD">
            <h3>Sélectionner un véhicule à louer</h3>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategorySelect(e.target.value)}
              required={quotedVehicles.length === 0}
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
              required={quotedVehicles.length === 0}
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

          <div className="vehicle-listD">
            <h3>Véhicules Quotés</h3>
            <table className="vehicle-tableD">
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
                {quotedVehicles.map((vehicle, index) => (
                  <tr key={index}>
                    <td>{vehicle.marque}</td>
                    <td>{vehicle.modele}</td>
                    <td>{vehicle.dailyRate} FCFA</td>
                    <td>{vehicle.daysQuoted}</td>
                    <td>{vehicle.montant} FCFA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="totalsD">
            <div className="totals-sectionD">
              <div>
                <strong>Total HT:</strong> {calculateTotalHT()} FCFA
              </div>
              <div>
                <strong>TVA 18%:</strong> {calculateTVA()} FCFA
              </div>
              <div>
                <strong>CSS 1%:</strong> {calculateCSS()} FCFA
              </div>
              <div>
                <strong>Total TTC:</strong> {calculateTotalTTC()} FCFA
              </div>
              {remise !== null && (
                <div>
                  <strong>Remise -15%:</strong> {remise} FCFA
                </div>
              )}
              <div>
                <strong>Total Net:</strong> {calculateTotalNet()} FCFA
              </div>
              <button type="button" className="remise-buttonD" onClick={handleDiscountPopup}>
                Appliquer une remise
              </button>
            </div>
          </div>

          <button type="submit" className="submit-buttonD">Créer le Devis</button>
        </form>

        {isPopupOpen && (
          <div className="popupD">
            <h3>Informations du véhicule</h3>
            <label>Tarif journalier:</label>
            <input
              type="number"
              value={dailyRate}
              onChange={(e) => setDailyRate(e.target.value)}
              required
            />
            <label>Nombre de jours quotés:</label>
            <input
              type="number"
              value={daysQuoted}
              onChange={(e) => setDaysQuoted(e.target.value)}
              required
            />
            <button type="button" onClick={handleAddVehicle}>
              Ajouter le véhicule
            </button>
          </div>
        )}

        {isDiscountPopupOpen && (
          <div className="discount-popupD">
            <h3>Voulez-vous appliquer une remise de 15%?</h3>
            <button onClick={handleDiscountYes}>Oui</button>
            <button onClick={handleDiscountNo}>Non</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Devis;
