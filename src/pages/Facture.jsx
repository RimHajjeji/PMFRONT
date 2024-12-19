import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
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
  const [fraisCarburant, setFraisCarburant] = useState(0);
  const [fraisKilometrage, setFraisKilometrage] = useState(0);
  const [fraisLivraison, setFraisLivraison] = useState(0);
  const [fraisChauffeur, setFraisChauffeur] = useState(0);
  const [acompte, setAcompte] = useState(0); // Nouveau champ
  const [montantRemboursement, setMontantRemboursement] = useState(0); // Nouveau champ
  const [selectedTarifType, setSelectedTarifType] = useState("");
  const [selectedDurationType, setSelectedDurationType] = useState("");

  const navigate = useNavigate();

  // Fonction pour vérifier l'expiration du token
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      if (decoded && decoded.exp < Date.now() / 1000) {
        return true;
      }
      return false;
    } catch (error) {
      return true;
    }
  };

  // Rafraîchissement du token
  const refreshToken = async () => {
    const token = localStorage.getItem("token");

    if (!token) return null;

    try {
      const response = await axios.post("https://envoices.premiummotorscars.com/api/refresh-token", {}, {
        headers: {
          'x-auth-token': token,
        },
      });
      const newToken = response.data.token;
      localStorage.setItem("token", newToken);
      return newToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
      localStorage.removeItem("token");
      navigate('/login');
      return null;
    }
  };

  // Récupérer les détails de l'admin connecté
  const fetchAdminDetails = async () => {
    let token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      console.log('Token expired or not found, refreshing token...');
      token = await refreshToken(); // Tente de rafraîchir le token

      if (!token) {
        navigate('/login'); // Rediriger vers la page de login si le token est invalide
        return;
      }
    }

    try {
      const response = await axios.get(
        "https://envoices.premiummotorscars.com/api/admin/profile",
        {
          headers: {
            "x-auth-token": token, // Utilise le token stocké localement
          },
        }
      );
      const { nom, prenom } = response.data;
      setIssuedBy(`${nom} ${prenom}`); // Combine le nom et le prénom
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails de l'admin :",
        error
      );
      alert(
        "Impossible de récupérer les informations de l'utilisateur connecté."
      );
    }
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("https://envoices.premiummotorscars.com/api/clients");
        setClients(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des clients:", error);
        alert("Erreur lors de la récupération des clients.");
      }
    };

    const fetchAdminDetails = async () => {
      try {
        const response = await axios.get(
          "https://envoices.premiummotorscars.com/api/admin/profile",
          {
            headers: {
              "x-auth-token": localStorage.getItem("token"), // Utilise le token stocké localement
            },
          },
        );
        const { nom, prenom } = response.data;
        setIssuedBy(`${nom} ${prenom}`); // Combine le nom et le prénom
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des détails de l'admin :",
          error,
        );
        alert(
          "Impossible de récupérer les informations de l'utilisateur connecté.",
        );
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://envoices.premiummotorscars.com/api/categories/categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
        alert("Erreur lors de la récupération des catégories.");
      }
    };

    fetchAdminDetails();
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
      alert(
        "Les champs Tarif Journalier et Nombre de jours doivent être des nombres."
      );
      return;
    }

    const montant = dailyRateNumber * daysRentedNumber;

    // Retain the previously selected tarifType and durationType if not explicitly changed
    const appliedTarifType =
      selectedTarifType ||
      (rentedVehicles.length > 0 ? rentedVehicles[0].tarifType : "");
    const appliedDurationType =
      selectedDurationType ||
      (rentedVehicles.length > 0 ? rentedVehicles[0].durationType : "");

    setRentedVehicles([
      ...rentedVehicles,
      {
        marque: selectedVehicle.marque,
        modele: selectedVehicle.modele,
        dailyRate: dailyRateNumber,
        daysRented: daysRentedNumber,
        montant,
        tarifType: appliedTarifType,
        durationType: appliedDurationType,
      },
    ]);

    setIsPopupOpen(false);
    setDailyRate("");
    setDaysRented("");
    setSelectedVehicle("");
    setSelectedCategory("");
    setSelectedTarifType(appliedTarifType); // Pre-fill the tarifType for the next vehicle
    setSelectedDurationType(appliedDurationType); // Pre-fill the durationType for the next vehicle
    setVehicles([]);
  };

  const calculateTotalHTFrais = () => {
    const totalLocation = rentedVehicles.reduce(
      (total, vehicle) => total + vehicle.montant,
      0
    );
    const totalFraisSupplémentaires =
      Number(fraisCarburant) +
      Number(fraisKilometrage) +
      Number(fraisLivraison) +
      Number(fraisChauffeur);
    return totalLocation + totalFraisSupplémentaires;
  };

  const calculateTotalHT = () => {
    return rentedVehicles.reduce(
      (total, vehicle) => total + vehicle.montant,
      0
    );
  };

  const calculateTVA = () => {
    return calculateTotalHTFrais() * 0.18;
  };

  const calculateCSS = () => {
    return calculateTotalHTFrais() * 0.01;
  };

  const calculateTotalTTC = () => {
    return calculateTotalHTFrais() + calculateTVA() + calculateCSS();
  };

  const calculateRemise = () => {
    return calculateTotalTTC() * (discountPercentage / 100);
  };

  const calculateTotalNet = () => {
    const totalTTC = calculateTotalTTC();
    const deduction =
      (remise || 0) + (acompte || 0) + (montantRemboursement || 0);
    return totalTTC - deduction;
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

    const totalHTFrais = calculateTotalHTFrais();
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
      totalHTFrais,
      totalHT,
      tva,
      css,
      totalTTC,
      remise: remiseAmount,
      discountPercentage,
      totalNet,
      acompte,
      montantRemboursement,
      fraisSupplementaires: {
        fraisCarburant,
        fraisKilometrage,
        fraisLivraison,
        fraisChauffeur,
      },
    };

    try {
      const response = await axios.post(
        "https://envoices.premiummotorscars.com/api/invoices/add",
        newInvoice
      );
      alert(
        "Facture créée avec succès. Numéro de facture: " +
          response.data.invoice.invoiceNumber
      );
      navigate("/dashboard");
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
    <div className="invoice">
      <div className="invoice__container">
        <div className="invoice__header">
          <div className="invoice__logo">
            <img src="/assets/logo.png" alt="Logo" />
          </div>
          <div className="invoice__company-info">
            <strong className="invoice__title">FACTURE</strong>
          </div>
        </div>

        <div className="invoice__separator"></div>

        <form onSubmit={handleSubmit}>
          <div className="invoice__client-info">
            <div className="invoice__client-details">
              <strong>Facturé à</strong>
              <br />
              <strong className="invoice__client-highlight">
                Le Locataire:
              </strong>
              <select
                className="invoice__select--client"
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
              <strong>Code client:</strong>{" "}
              {selectedClient?.codeClient || "N/A"}
              <br />
              <strong>Type client:</strong>{" "}
              {selectedClient?.typeClient || "N/A"}
              <br />
              <strong>Email:</strong> {selectedClient?.email || "N/A"}
              <br />
            </div>

            <div className="invoice__details">
              <strong>Facture N°:</strong> {/* Numéro généré par le backend */}
              <br />
              <strong>Etablie Par:</strong>
              <input
                type="text"
                className="invoice__input--issued-by"
                value={issuedBy}
                readOnly // Rendre le champ non modifiable
              />
              <br />
              <strong>Date:</strong> {date}
              <br />
              <strong>Période de Facturation:</strong>
              <br />
              <input
                type="date"
                className="invoice__input--period-start"
                value={billingPeriod.startDate}
                onChange={(e) =>
                  setBillingPeriod({
                    ...billingPeriod,
                    startDate: e.target.value,
                  })
                }
                required
              />
              <input
                type="date"
                className="invoice__input--period-end"
                value={billingPeriod.endDate}
                onChange={(e) =>
                  setBillingPeriod({
                    ...billingPeriod,
                    endDate: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <div className="invoice__vehicle-list">
            <h3>Véhicules Loués</h3>
            <table className="invoice__table">
              <thead>
                <tr>
                  <th>Marque</th>
                  <th>Modèle</th>
                  <th>
                    Type de Tarif
                    <select
                      className="invoice__dropdown invoice__dropdown--tarif"
                      onChange={(e) => setSelectedTarifType(e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Choisissez
                      </option>
                      <option value="Tarif journalier">Tarif journalier</option>
                      <option value="Tarif hebdomadaire">
                        Tarif hebdomadaire
                      </option>
                      <option value="Tarif mensuel">Tarif mensuel</option>
                    </select>
                  </th>
                  <th>
                    Type de Durée
                    <select
                      className="invoice__dropdown invoice__dropdown--duree"
                      onChange={(e) => setSelectedDurationType(e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Choisissez
                      </option>
                      <option value="Nombres de jours">Nombres de jours</option>
                      <option value="Nombres de semaines">
                        Nombres de semaines
                      </option>
                      <option value="Nombres de mois">Nombres de mois</option>
                    </select>
                  </th>
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

          <div className="invoice__vehicle-selection">
            <h3>Sélectionner un véhicule à louer</h3>
            <select
              className="invoice__select--category"
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
              className="invoice__select--vehicle"
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

          {isPopupOpen && (
            <div className="invoice__popup">
              <div className="invoice__popup-content">
                <h3>Ajouter un véhicule</h3>
                <label>
                  {selectedTarifType || "Tarif"} :
                  <input
                    type="number"
                    className="invoice__input--daily-rate"
                    value={dailyRate}
                    onChange={(e) => setDailyRate(e.target.value)}
                    required
                    onWheel={(e) => e.target.blur()} // Désactive le scroll
                  />
                </label>
                <label>
                  {selectedDurationType || "Durée"} :
                  <input
                    type="number"
                    className="invoice__input--days-rented"
                    value={daysRented}
                    onChange={(e) => setDaysRented(e.target.value)}
                    required
                    min="1"
                    onWheel={(e) => e.target.blur()} // Désactive le scroll
                  />
                </label>
                <button
                  className="btnfacture1"
                  type="button"
                  onClick={handleAddVehicle}
                >
                  Ajouter
                </button>
                <button
                  className="btnfacture2"
                  type="button"
                  onClick={() => setIsPopupOpen(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {isDiscountPopupOpen && (
            <div className="invoice__popup--discount">
              <div className="invoice__popup-contentF">
                <p>Voulez-vous appliquer une remise ?</p>
                <label>
                  Pourcentage de Remise:
                  <input
                    type="number"
                    className="invoice__input--discount"
                    value={discountPercentage}
                    onChange={(e) =>
                      setDiscountPercentage(Number(e.target.value))
                    }
                    required
                  />
                </label>
                <button
                  className="btnfacture3"
                  type="button"
                  onClick={handleDiscountYes}
                >
                  Appliquer
                </button>
                <button
                  className="btnfacture4"
                  type="button"
                  onClick={handleDiscountNo}
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          <div className="factu-frais-supplementaires">
            <h3>Frais Supplémentaires</h3>
            <label>
              Frais de carburant:
              <input
                type="number"
                value={fraisCarburant}
                onChange={(e) => setFraisCarburant(e.target.value)}
                onWheel={(e) => e.target.blur()} // Désactive le scroll
              />
            </label>
            <label>
              Frais de kilométrage:
              <input
                type="number"
                value={fraisKilometrage}
                onChange={(e) => setFraisKilometrage(e.target.value)}
                onWheel={(e) => e.target.blur()} // Désactive le scroll
              />
            </label>
            <label>
              Frais de livraison:
              <input
                type="number"
                value={fraisLivraison}
                onChange={(e) => setFraisLivraison(e.target.value)}
                onWheel={(e) => e.target.blur()} // Désactive le scroll
              />
            </label>
            <label>
              Frais de chauffeur:
              <input
                type="number"
                value={fraisChauffeur}
                onChange={(e) => setFraisChauffeur(e.target.value)}
                onWheel={(e) => e.target.blur()} // Désactive le scroll
              />
            </label>
          </div>

          <div className="factu-autres-montants">
            <h3>Autres Montants</h3>
            <label>
              Acompte:
              <input
                type="number"
                value={acompte}
                onChange={(e) => setAcompte(parseFloat(e.target.value))}
                onWheel={(e) => e.target.blur()} // Désactive le scroll
              />
            </label>
            <label>
              Montant Remboursement:
              <input
                type="number"
                value={montantRemboursement}
                onChange={(e) =>
                  setMontantRemboursement(parseFloat(e.target.value))
                }
                onWheel={(e) => e.target.blur()} // Désactive le scroll
              />
            </label>
          </div>

          <div className="invoice__total">
            <strong>Total des véhicules loués:</strong>{" "}
            {calculateTotalHT().toFixed(2)} FCFA
            <br />
            <strong>Total HT + Frais supplementaires:</strong>{" "}
            {calculateTotalHTFrais().toFixed(2)} FCFA
            <br />
            <strong>TVA (18%):</strong> {calculateTVA().toFixed(2)} FCFA
            <br />
            <strong>CSS (1%):</strong> {calculateCSS().toFixed(2)} FCFA
            <br />
            <strong>Total TTC:</strong> {calculateTotalTTC().toFixed(2)} FCFA
            <br />
            {remise !== null && (
              <>
                <strong>Remise ({discountPercentage}%):</strong>{" "}
                {remise.toFixed(2)} FCFA
                <br />
              </>
            )}
            <strong>Total Net:</strong> {calculateTotalNet().toFixed(2)} FCFA
            <br />
            <button
              type="button"
              className="invoice__btn-submit"
              onClick={handleDiscountPopup}
            >
              Appliquer une remise
            </button>
          </div>
          {/* Submit Button */}
          <button type="submit" className="invoice__btn-submit">
            Créer Facture
          </button>
        </form>
      </div>
    </div>
  );
};

export default Facture;
