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
    const totalHT = calculateTotalHT();
    const newDevis = {
      clientId: selectedClient._id,
      issuedBy,
      validityPeriod,
      vehicles: quotedVehicles,
      totalHT,
      tva: calculateTVA(),
      css: calculateCSS(),
      totalTTC: calculateTotalTTC(),
      remise: remise || 0,
      totalNet: calculateTotalNet(),
    };

    await axios.post("http://localhost:5000/api/devis/add", newDevis);
    alert("Devis créé avec succès");
    navigate('/dashboard'); // Redirection après la création du devis
  };

  return (
    <div className="wrapperD">
      <div className="devis-containerD">
        <div className="headerD">
          <div className="logoD">
            <img src="/assets/logo.png" alt="Logo" />
          </div>
          <div className="company-infoD">
            <strong>SIEGE SOCIAL</strong>
            <br />
            Libreville-Gabon-B.P.8357
            <br />
            Blvd Triomphale(Immeuble Centre Guido)
            <br />
            Tél: 011 70 75 15 / 060 47 34 10
          </div>
        </div>

        <div className="separatorD"></div>

        <form onSubmit={handleSubmit}>
          <div className="client-infoD">
            <div className="left-sectionD">
              <strong>Devis pour</strong>
              <br />
              <br />
              <strong className="highlighted-textD">Client:</strong>
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

            <div className="right-sectionD">
              <strong className="highlighted-text-largeD">DEVIS</strong>
              <br />
              <strong>Devis N°:</strong> {quoteNumber}
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
              <strong>Période de Validité:</strong>
              <br />
              <input
                type="date"
                value={validityPeriod.startDate}
                onChange={(e) =>
                  setValidityPeriod({ ...validityPeriod, startDate: e.target.value })
                }
                required
              />
              <input
                type="date"
                value={validityPeriod.endDate}
                onChange={(e) =>
                  setValidityPeriod({ ...validityPeriod, endDate: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="vehicle-selectionD">
            <h3>Sélectionner un véhicule</h3>
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
            <h3>Véhicules</h3>
            <table className="vehicle-tableD">
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
                {quotedVehicles.map((vehicle, index) => (
                  <tr key={index}>
                    <td>{vehicle.marque}</td>
                    <td>{vehicle.modele}</td>
                    <td>{vehicle.dailyRate}</td>
                    <td>{vehicle.daysQuoted}</td>
                    <td>{vehicle.montant} XAF</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="totalsD">
            <div className="total-rowD">
              <span className="total-labelD">Total HT:</span>
              <span className="total-valueD">{calculateTotalHT()} XAF</span>
            </div>
            <div className="total-rowD">
              <span className="total-labelD">TVA 18%:</span>
              <span className="total-valueD">{calculateTVA()} XAF</span>
            </div>
            <div className="total-rowD">
              <span className="total-labelD">CSS 1%:</span>
              <span className="total-valueD">{calculateCSS()} XAF</span>
            </div>
            <div className="total-rowD">
              <span className="total-labelD">Total TTC:</span>
              <span className="total-valueD">{calculateTotalTTC()} XAF</span>
              <button type="button" onClick={handleDiscountPopup} className="remise-buttonD">
                Remise
              </button>
            </div>
            {remise && (
              <div className="total-rowD">
                <span className="total-labelD">Remise 15%:</span>
                <span className="total-valueD">- {remise} XAF</span>
              </div>
            )}
            <div className="total-rowD">
              <span className="total-labelD">Total Net:</span>
              <span className="total-valueD">{calculateTotalNet()} XAF</span>
            </div>
          </div>

          <button type="submit" className="submit-buttonD">
            Créer le devis
          </button>
        </form>

        {isPopupOpen && (
          <div className="popupD">
            <div className="popup-contentD">
              <h3>Ajouter un véhicule</h3>
              <label htmlFor="dailyRate">Tarif Journalier:</label>
              <input
                type="number"
                value={dailyRate}
                onChange={(e) => setDailyRate(e.target.value)}
                required
              />
              <br />
              <label htmlFor="daysQuoted">Nombre de Jours:</label>
              <input
                type="number"
                value={daysQuoted}
                onChange={(e) => setDaysQuoted(e.target.value)}
                required
              />
              <br />
              <button onClick={handleAddVehicle}>Ajouter</button>
            </div>
          </div>
        )}

        {isDiscountPopupOpen && (
          <div className="popupD">
            <div className="popup-contentD">
              <p>Voulez-vous appliquer une remise de 15%?</p>
              <button onClick={handleDiscountYes}>Oui</button>
              <button onClick={handleDiscountNo}>Non</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Devis;
