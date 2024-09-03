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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [rentedVehicles, setRentedVehicles] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [dailyRate, setDailyRate] = useState("");
  const [daysRented, setDaysRented] = useState("");
  const [firstEntry, setFirstEntry] = useState(true); // Ajout de cette ligne

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
    setSelectedCategory(category);
    setVehicles(category.vehicles);
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsPopupOpen(true); // Ouvre la popup lorsqu'un véhicule est sélectionné
  };

  const handleAddVehicle = () => {
    if (firstEntry && (!dailyRate || !daysRented || !selectedVehicle)) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setRentedVehicles([
      ...rentedVehicles,
      { 
        marque: selectedVehicle.marque, 
        modele: selectedVehicle.modele, 
        dailyRate, 
        daysRented 
      },
    ]);

    setIsPopupOpen(false); // Ferme la popup après l'ajout du véhicule
    setDailyRate("");
    setDaysRented("");
    setSelectedVehicle(null); // Réinitialise le véhicule sélectionné
    setSelectedCategory(null); // Réinitialise la catégorie sélectionnée
    setVehicles([]); // Vide la liste des véhicules

    setFirstEntry(false); // La première entrée a été faite
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newInvoice = {
      clientId: selectedClient._id,
      issuedBy,
      billingPeriod,
      vehicles: rentedVehicles,
    };

    await axios.post("http://localhost:5000/api/invoices/add", newInvoice);
    alert("Facture créée avec succès");
  };

  return (
    <div className="wrapperF">
      <div className="facture-containerF">
        <div className="headerF">
          <div className="logoF">
            <img src="/assets/logoF.png" alt="Logo" />
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
              value={selectedCategory ? selectedCategory._id : ""}
              onChange={(e) => handleCategorySelect(e.target.value)}
              required={firstEntry} // Obligatoire seulement pour la première entrée
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            {vehicles.length > 0 && (
              <select
                value={selectedVehicle ? selectedVehicle._id : ""}
                onChange={(e) => handleVehicleSelect(vehicles.find((v) => v._id === e.target.value))}
                required={firstEntry} // Obligatoire seulement pour la première entrée
              >
                <option value="">Sélectionner un véhicule</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle._id} value={vehicle._id}>
                    {vehicle.marque} {vehicle.modele} - {vehicle.plaque}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Popup pour entrer le tarif journalier et le nombre de jours */}
          {isPopupOpen && (
            <div className="popupF">
              <div className="popup-contentF">
                <h3>Entrer les détails de location du véhicule</h3>
                <label>Tarif Journalier:</label>
                <input
                  type="number"
                  value={dailyRate}
                  onChange={(e) => setDailyRate(e.target.value)}
                  required={firstEntry} // Obligatoire seulement pour la première entrée
                />
                <label>Nombre de Jours:</label>
                <input
                  type="number"
                  value={daysRented}
                  onChange={(e) => setDaysRented(e.target.value)}
                  required={firstEntry} // Obligatoire seulement pour la première entrée
                />
                <button type="button" onClick={handleAddVehicle}>
                  Ajouter le véhicule
                </button>
              </div>
            </div>
          )}

          <div className="rented-vehicles-tableF">
            <h3>Véhicules Loués</h3>
            <table>
              <thead>
                <tr>
                  <th>Marque</th>
                  <th>Modèle</th>
                  <th>Tarif Journalier</th>
                  <th>Nombre de Jours</th>
                </tr>
              </thead>
              <tbody>
                {rentedVehicles.map((vehicle, index) => (
                  <tr key={index}>
                    <td>{vehicle.marque}</td>
                    <td>{vehicle.modele}</td>
                    <td>{vehicle.dailyRate}</td>
                    <td>{vehicle.daysRented}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button type="submit">Créer la facture</button>
        </form>
      </div>
    </div>
  );
};

export default Facture;
