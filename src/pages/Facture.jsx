// src/components/Facture.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "../style/Facture.css";

const Facture = () => {
  const [clients, setClients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [issuedBy, setIssuedBy] = useState("");
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
  const [discountPercentage, setDiscountPercentage] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/clients");
        setClients(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des clients:", error);
        alert("Erreur lors de la récupération des clients.");
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categories/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
        alert("Erreur lors de la récupération des catégories.");
      }
    };

    fetchClients();
    fetchCategories();
  }, []);

  const handleClientSelect = (clientId) => {
    const client = clients.find((c) => c._id === clientId);
    setSelectedClient(client);
  };

  const handleCategorySelect = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    setSelectedCategory(categoryId);
    setVehicles(category ? category.vehicles : []);
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

    const dailyRateNumber = Number(dailyRate);
    const daysRentedNumber = Number(daysRented);

    if (isNaN(dailyRateNumber) || isNaN(daysRentedNumber)) {
      alert("Les champs Tarif Journalier et Nombre de jours doivent être des nombres.");
      return;
    }

    const montant = dailyRateNumber * daysRentedNumber;

    setRentedVehicles([
      ...rentedVehicles,
      {
        marque: selectedVehicle.marque,
        modele: selectedVehicle.modele,
        dailyRate: dailyRateNumber,
        daysRented: daysRentedNumber,
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

  // Updated remise calculation based on entered percentage
  const calculateRemise = () => {
    return calculateTotalTTC() * (discountPercentage / 100);
  };

  const calculateTotalNet = () => {
    return remise ? calculateTotalTTC() - remise : calculateTotalTTC();
  };

  const handleDiscountPopup = () => {
    setIsDiscountPopupOpen(true);
  };

  const handleDiscountYes = () => {
    if (discountPercentage < 0 || discountPercentage > 100) {
      alert("Le pourcentage de remise doit être entre 0 et 100.");
      return;
    }
    const remiseCalculated = calculateRemise();
    setRemise(remiseCalculated);
    setIsDiscountPopupOpen(false);
  };

  const handleDiscountNo = () => {
    setIsDiscountPopupOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedClient) {
      alert("Veuillez sélectionner un client.");
      return;
    }

    if (!issuedBy) {
      alert("Veuillez indiquer qui a émis la facture.");
      return;
    }

    if (!billingPeriod.startDate || !billingPeriod.endDate) {
      alert("Veuillez indiquer la période de facturation.");
      return;
    }

    if (rentedVehicles.length === 0) {
      alert("Veuillez ajouter au moins un véhicule loué.");
      return;
    }

    const totalHT = calculateTotalHT();
    const tva = calculateTVA();
    const css = calculateCSS();
    const totalTTC = calculateTotalTTC();
    const remiseAmount = remise || 0;
    const totalNet = calculateTotalNet();

    const newInvoice = {
      clientId: selectedClient._id,
      issuedBy,
      billingPeriod,
      vehicles: rentedVehicles,
      totalHT,
      tva,
      css,
      totalTTC,
      remise: remiseAmount,
      discountPercentage,
      totalNet,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/invoices/add", newInvoice);
      alert("Facture créée avec succès. Numéro de facture: " + response.data.invoice.invoiceNumber);
      navigate('/dashboard'); // Redirection vers le tableau de bord après la création
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);
      if (error.response && error.response.data && error.response.data.error) {
        alert("Erreur: " + error.response.data.error);
      } else {
        alert("Une erreur est survenue lors de la création de la facture.");
      }
    }
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
              <select
                className="client-select"
                onChange={(e) => handleClientSelect(e.target.value)}
                required
              >
                <option value="">Sélectionner un client</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.firstName} {client.lastName}
                  </option>
                ))}
              </select>
              <br />
              <strong>N° de Téléphone:</strong> {selectedClient?.phone || "N/A"}
              <br />
              <br />
              <strong>code client:</strong> {selectedClient?.codeClient || "N/A"}
              <br />
              <br />
              <strong>Type client:</strong> {selectedClient?.typeClient || "N/A"}
              <br />
              <strong>Email:</strong> {selectedClient?.email || "N/A"}
              <br />
            </div>

            <div className="right-sectionF">
              <strong className="highlighted-text-largeF">FACTURE</strong>
              <br />
              <strong>Facture N°:</strong> {/* Invoice Number will be generated by backend */}
              <br />
              <strong>Etablie Par:</strong>
              <input
                type="text"
                className="input-issued-by"
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
                className="input-billing-period-start"
                value={billingPeriod.startDate}
                onChange={(e) =>
                  setBillingPeriod({ ...billingPeriod, startDate: e.target.value })
                }
                required
              />
              <input
                type="date"
                className="input-billing-period-end"
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
              className="category-select"
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
              className="vehicle-select"
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
                  <th>Nombre de Jours</th>
                  <th>Montant</th>
                </tr>
              </thead>
              <tbody>
                {rentedVehicles.map((vehicle, index) => (
                  <tr key={index}>
                    <td>{vehicle.marque}</td>
                    <td>{vehicle.modele}</td>
                    <td>{vehicle.dailyRate.toFixed(2)}</td>
                    <td>{vehicle.daysRented}</td>
                    <td>{vehicle.montant.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isPopupOpen && (
            <div className="popupF">
              <div className="popup-contentF">
                <h3>Ajouter un véhicule</h3>
                <label>
                  Tarif Journalier:
                  <input
                    type="number"
                    className="input-daily-rate"
                    value={dailyRate}
                    onChange={(e) => setDailyRate(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                  />
                </label>
                <label>
                  Nombre de jours:
                  <input
                    type="number"
                    className="input-days-rented"
                    value={daysRented}
                    onChange={(e) => setDaysRented(e.target.value)}
                    required
                    min="1"
                  />
                </label>
                <button type="button" onClick={handleAddVehicle}>Ajouter</button>
                <button type="button" onClick={() => setIsPopupOpen(false)}>Annuler</button>
              </div>
            </div>
          )}

          {isDiscountPopupOpen && (
            <div className="discount-popupF">
              <div className="discount-popup-contentF">
                <p>Voulez-vous appliquer une remise ?</p>
                <label>
                  Pourcentage de Remise:
                  <input
                    type="number"
                    className="input-discount-percentage"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                    required
                    min="0"
                    max="100"
                  />
                </label>
                <button type="button" onClick={handleDiscountYes}>Appliquer</button>
                <button type="button" onClick={handleDiscountNo}>Annuler</button>
              </div>
            </div>
          )}

          <div className="total-sectionF">
            <strong>Total HT:</strong> {calculateTotalHT().toFixed(2)} FCFA
            <br />
            <strong>TVA (18%):</strong> {calculateTVA().toFixed(2)} FCFA
            <br />
            <strong>CSS (1%):</strong> {calculateCSS().toFixed(2)} FCFA
            <br />
            <strong>Total TTC:</strong> {calculateTotalTTC().toFixed(2)} FCFA
            <br />
            {remise !== null && (
              <>
                <strong>Remise ({discountPercentage}%):</strong> {remise.toFixed(2)} FCFA
                <br />
              </>
            )}
            <strong>Total Net:</strong> {calculateTotalNet().toFixed(2)} FCFA
            <br />
            <button type="button" onClick={handleDiscountPopup}>Appliquer une remise</button>
          </div>

          <button type="submit" className="submit-btnF">Créer Facture</button>
        </form>
      </div>
    </div>
  );
};

export default Facture;
