import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import '../style/ModifDevis.css'

const ModifDevis = () => {
  const { devisId } = useParams(); // ID du devis dans l'URL
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const [devis, setDevis] = useState(null); // Données du devis
  const [clients, setClients] = useState([]); // Liste des clients
  const [selectedClient, setSelectedClient] = useState(null); // Client sélectionné
  const [loadingDevis, setLoadingDevis] = useState(true);
  const [error, setError] = useState(null);
  const [modificationHistory, setModificationHistory] = useState([]);
  const [admin, setAdmin] = useState("");
  
  const [admins, setAdmins] = useState([]); // Liste des admins
  const [selectedAdmin, setSelectedAdmin] = useState(""); // Admin sélectionné
  const [password, setPassword] = useState(""); // Mot de passe saisi


  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/admins",
        );
        setAdmins(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des admins.");
        console.error(err);
      }
    };
    fetchAdmins();
  }, []);

  // Récupérer la liste des clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/clients");
        setClients(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des clients.");
        console.error(err);
      }
    };
    fetchClients();
  }, []);

  // Récupérer les données du devis
  useEffect(() => {
    const fetchDevis = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/devis/${devisId}`,
        );
        const devisData = response.data;

        setDevis(devisData);
        setModificationHistory(devisData.modificationHistory || []);
        reset(devisData); // Pré-remplir le formulaire avec les données du devis
        setSelectedClient(devisData.client); // Définir le client initial

        // Pré-remplir les dates et les frais supplémentaires
        setValue("date", devisData.date?.split("T")[0]);
        setValue(
          "billingPeriod.startDate",
          devisData.billingPeriod?.startDate?.split("T")[0],
        );
        setValue(
          "billingPeriod.endDate",
          devisData.billingPeriod?.endDate?.split("T")[0],
        );
        setValue(
          "fraisCarburant",
          devisData.fraisSupplementaires?.fraisCarburant || 0,
        );
        setValue(
          "fraisKilometrage",
          devisData.fraisSupplementaires?.fraisKilometrage || 0,
        );
        setValue(
          "fraisLivraison",
          devisData.fraisSupplementaires?.fraisLivraison || 0,
        );
        setValue(
          "fraisChauffeur",
          devisData.fraisSupplementaires?.fraisChauffeur || 0,
        );
      } catch (err) {
        setError("Erreur lors de la récupération du devis.");
        console.error(err);
      } finally {
        setLoadingDevis(false);
      }
    };

    fetchDevis();
  }, [devisId, reset, setValue]);

  // Gestion des calculs
  const rentedVehicles = watch("vehicles") || []; // Surveillance des véhicules
  const fraisCarburant = watch("fraisCarburant") || 0;
  const fraisKilometrage = watch("fraisKilometrage") || 0;
  const fraisLivraison = watch("fraisLivraison") || 0;
  const fraisChauffeur = watch("fraisChauffeur") || 0;
  const discountPercentage = watch("discountPercentage") || 0;
  const acompte = watch("acompte") || 0;
  const montantRemboursement = watch("montantRemboursement") || 0;

  const calculateTotalHTFrais = () => {
    const fraisSupplémentaires =
      Number(fraisCarburant) +
      Number(fraisKilometrage) +
      Number(fraisLivraison) +
      Number(fraisChauffeur);
    return calculateTotalHT() + fraisSupplémentaires;
  };

  const calculateTotalHT = () => {
    return rentedVehicles.reduce((total, vehicle) => {
      const tarif = Number(vehicle.dailyRate || 0);
      const duration = Number(vehicle.daysRented || 0);
      return total + tarif * duration;
    }, 0);
  };

  const vehicles = watch("vehicles") || []; // Surveillance des véhicules
  const updatedVehicles = vehicles.map((vehicle) => ({
    ...vehicle,
    montant: vehicle.dailyRate * vehicle.daysRented || 0, // Calcul automatique
  }));

  useEffect(() => {
    if (devis) {
      setValue(
        "tarifType",
        devis.vehicles[0]?.tarifType || "Taux Journalier",
      );
      setValue(
        "durationType",
        devis.vehicles[0]?.durationType || "Jours Loués",
      );
    }
  }, [devis, setValue]);

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
    return (discountPercentage * calculateTotalTTC()) / 100;
  };

  const calculateTotalNet = () => {
    const totalTTC = calculateTotalTTC();
    const remise = calculateRemise();
    const deduction = remise + Number(acompte) + Number(montantRemboursement);
    return totalTTC - deduction;
  };

  // Mise à jour des champs calculés
  useEffect(() => {
    setValue("totalHT", calculateTotalHT());
    setValue("totalHTFrais", calculateTotalHTFrais());
    setValue("tva", calculateTVA());
    setValue("css", calculateCSS());
    setValue("totalTTC", calculateTotalTTC());
    setValue("remise", calculateRemise());
    setValue("totalNet", calculateTotalNet());
  }, [
    rentedVehicles, // Liste des véhicules
    fraisCarburant, // Champs frais
    fraisKilometrage,
    fraisLivraison,
    fraisChauffeur,
    discountPercentage, // Pourcentage de remise
    acompte, // Acompte
    montantRemboursement, // Remboursement
    watch(), // Ajoutez cela pour écouter tous les champs surveillés
  ]);

  // Mise à jour du formulaire lors du changement de client
  const handleClientChange = (clientId) => {
    const client = clients.find((c) => c._id === clientId);
    setSelectedClient(client);

    // Mise à jour des champs liés au client
    setValue("client.firstName", client.firstName);
    setValue("client.lastName", client.lastName);
    setValue("client.email", client.email);
    setValue("client.phone", client.phone);
    setValue("client.codeClient", client.codeClient);
    setValue("client.typeClient", client.typeClient);
  };

  const handleAdminChange = (adminId) => {
    const adminInfo = admins.find((a) => a._id === adminId);
    setSelectedAdmin(adminId); // ID de l'admin sélectionné
    setAdmin(adminInfo); // Met à jour les détails de l'admin sélectionné
  };

    // Soumission du formulaire
  const onSubmit = async (data) => {
    if (!selectedAdmin || !password) {
      alert("Veuillez sélectionner un admin et fournir un mot de passe.");
      return;
    }

    try {
      if (!admin || !admin.nom || !admin.prenom || !password) {
        alert(
          "Veuillez sélectionner un admin valide et fournir un mot de passe.",
        );
        return;
      }

      // Créez une entrée pour l'historique des modifications
      const modificationData = {
        modifiedBy: `${admin.nom} ${admin.prenom}`, // Récupère le nom et prénom de l'admin sélectionné
        modifiedAt: new Date().toISOString(),
        changes: JSON.stringify(data), // Vous pouvez personnaliser ce champ selon les besoins
      };

      // Ajoutez l'entrée à l'historique des modifications existant
      const updatedHistory = [...modificationHistory, modificationData];

      const updatedData = {
        ...data,
        modifiedBy: selectedAdmin,
        password, // Mot de passe pour vérification
        vehicles: data.vehicles.map((vehicle) => ({
          ...vehicle,
          montant: vehicle.dailyRate * vehicle.daysRented || 0, // Met à jour montant
        })),
        client: selectedClient._id,
        fraisSupplementaires: {
          fraisCarburant: Number(data.fraisCarburant || 0),
          fraisKilometrage: Number(data.fraisKilometrage || 0),
          fraisLivraison: Number(data.fraisLivraison || 0),
          fraisChauffeur: Number(data.fraisChauffeur || 0),
        },
        totalHT: calculateTotalHT(),
        totalHTFrais: calculateTotalHTFrais(),
        tva: calculateTVA(),
        css: calculateCSS(),
        totalTTC: calculateTotalTTC(),
        totalNet: calculateTotalNet(),
           
        modificationHistory: updatedHistory, // Ajouter l'historique mis à jour
      };
      await axios.put(
        `http://localhost:5000/api/devis/${devisId}`,
        updatedData,
      );
      alert("Devis mis à jour avec succès !");
    } catch (err) {
      setError("Erreur lors de la mise à jour du devis.");
      console.error(err);
    }
  };

  if (loadingDevis) return <p>Chargement des données du devis...</p>;
  if (error) return <p>{error}</p>;

  return ( 
    <div className="modif-devis">
      <h1 className="modif-devis-title">
        Modifier le Devis #{devis?.devisNumber}
      </h1>
  
      {/* Sélection du client */}
      <h2 className="modif-devis-client-info">Informations du Client</h2>
      <div className="modif-devis-client-select">
        <label className="modif-devis-label">Client :</label>
        <select
          className="modif-devis-select"
          value={selectedClient?._id || ""}
          onChange={(e) => handleClientChange(e.target.value)}
        >
          <option value="">Sélectionnez un client</option>
          {clients.map((client) => (
            <option
              key={client._id}
              value={client._id}
              className="modif-devis-client-option"
            >
              {client.firstName} {client.lastName}
            </option>
          ))}
        </select>
      </div>
  
      {/* Affichage des informations du client */}
      {selectedClient && (
        <div className="modif-devis-client-details">
          <div className="modif-devis-field">
            <label className="modif-devis-label">Prénom :</label>
            <input
              type="text"
              className="modif-devis-input"
              {...register("client.firstName")}
              defaultValue={selectedClient.firstName}
              readOnly
            />
          </div>
          <div className="modif-devis-field">
            <label className="modif-devis-label">Nom :</label>
            <input
              type="text"
              className="modif-devis-input"
              {...register("client.lastName")}
              defaultValue={selectedClient.lastName}
              readOnly
            />
          </div>
          <div className="modif-devis-field">
            <label className="modif-devis-label">Email :</label>
            <input
              type="email"
              className="modif-devis-input"
              {...register("client.email")}
              defaultValue={selectedClient.email}
              readOnly
            />
          </div>
          <div className="modif-devis-field">
            <label className="modif-devis-label">Téléphone :</label>
            <input
              type="text"
              className="modif-devis-input"
              {...register("client.phone")}
              defaultValue={selectedClient.phone}
              readOnly
            />
          </div>
          <div className="modif-devis-field">
            <label className="modif-devis-label">Code Client :</label>
            <input
              type="text"
              className="modif-devis-input"
              {...register("client.codeClient")}
              defaultValue={selectedClient.codeClient}
              readOnly
            />
          </div>
          <div className="modif-devis-field">
            <label className="modif-devis-label">Type de Client :</label>
            <input
              type="text"
              className="modif-devis-input"
              {...register("client.typeClient")}
              defaultValue={selectedClient.typeClient}
              readOnly
            />
          </div>
        </div>
      )}
  
      {/* Formulaire de modification du devis */}
      <h2 className="modif-devis-info">Informations du Devis</h2>
      <form className="modif-devis-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="modif-devis-field">
          <label className="modif-devis-label">Date de Devis :</label>
          <input
            type="date"
            className="modif-devis-input"
            {...register("date")}
            readOnly
          />
        </div>
  
        <div className="modif-devis-field">
          <label className="modif-devis-label">Émis Par :</label>
          <input
            className="modif-devis-input"
            {...register("issuedBy")}
            defaultValue={devis?.issuedBy}
            readOnly
          />
        </div>
        <div className="modif-devis-billing-period">
          <label className="modif-devis-label">
            Période de Devis :
          </label>
          <div className="modif-devis-field">
            <label className="modif-devis-label">Début :</label>
            <input
              type="date"
              className="modif-devis-input"
              {...register("billingPeriod.startDate")}
            />
          </div>
          <div className="modif-devis-field">
            <label className="modif-devis-label">Fin :</label>
            <input
              type="date"
              className="modif-devis-input"
              {...register("billingPeriod.endDate")}
            />
          </div>
        </div>
  
        {/* Informations des véhicules devisés */}
        <div className="modif-devis-vehicles">
          <h3 className="modif-devis-subtitle">Véhicules Devisés :</h3>
          <table className="modif-devis-table">
            <thead>
              <tr>
                <th className="modif-devis-th">Marque</th>
                <th className="modif-devis-th">Modèle</th>
                <th className="modif-devis-th">
                  {devis?.vehicles[0]?.tarifType || "Tarif"}
                </th>
                <th className="modif-devis-th">
                  {devis?.vehicles[0]?.durationType || "Durée"}
                </th>
                <th className="modif-devis-th">Montant</th>
              </tr>
            </thead>
            <tbody>
              {rentedVehicles.map((vehicle, index) => (
                <tr key={index} className="modif-devis-row">
                  <td>
                    <input
                      type="text"
                      className="modif-devis-input"
                      {...register(`vehicles[${index}].marque`)}
                      defaultValue={vehicle.marque}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="modif-devis-input"
                      {...register(`vehicles[${index}].modele`)}
                      defaultValue={vehicle.modele}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      onWheel={(e) => e.target.blur()} // Désactive le scroll
                      className="modif-devis-input"
                      {...register(`vehicles[${index}].dailyRate`, {
                        valueAsNumber: true,
                        onChange: (e) => {
                          const updatedAmount =
                            (e.target.valueAsNumber || 0) *
                            (vehicle.daysRented || 0);
                          setValue(`vehicles[${index}].montant`, updatedAmount);
                        },
                      })}
                      defaultValue={vehicle.dailyRate}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      onWheel={(e) => e.target.blur()} // Désactive le scroll
                      className="modif-devis-input"
                      {...register(`vehicles[${index}].daysRented`, {
                        valueAsNumber: true,
                        onChange: (e) => {
                          const updatedAmount =
                            (vehicle.dailyRate || 0) *
                            (e.target.valueAsNumber || 0);
                          setValue(`vehicles[${index}].montant`, updatedAmount);
                        },
                      })}
                      defaultValue={vehicle.daysRented}
                    />
                  </td>
                  <td className="modif-devis-amount">
                    <input
                      type="number"
                      className="modif-devis-input"
                      {...register(`vehicles[${index}].montant`)}
                      defaultValue={vehicle.dailyRate * vehicle.daysRented || 0}
                      readOnly
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <br />
        <br />
        {/* Nouveaux champs */}
        <div className="modif-devis-additional-fees">
          <div className="modif-devis-field">
            <label className="modif-devis-label">Frais Carburant :</label>
            <input
              type="number"
              className="modif-devis-input"
              {...register("fraisCarburant")}
              defaultValue={devis?.fraisSupplementaires?.fraisCarburant || 0}
              onWheel={(e) => e.target.blur()} // Désactive le scroll
            />
          </div>
          <div className="modif-devis-field">
            <label className="modif-devis-label">Frais Kilométrage :</label>
            <input
              type="number"
              className="modif-devis-input"
              {...register("fraisKilometrage")}
              defaultValue={devis?.fraisSupplementaires?.fraisKilometrage || 0}
              onWheel={(e) => e.target.blur()} // Désactive le scroll
            />
          </div>
          <div className="modif-devis-field">
            <label className="modif-devis-label">Frais Livraison :</label>
            <input
              type="number"
              className="modif-devis-input"
              {...register("fraisLivraison")}
              defaultValue={devis?.fraisSupplementaires?.fraisLivraison || 0}
              onWheel={(e) => e.target.blur()} // Désactive le scroll
            />
          </div>
          <div className="modif-devis-field">
            <label className="modif-devis-label">Frais Chauffeur :</label>
            <input
              type="number"
              className="modif-devis-input"
              {...register("fraisChauffeur")}
              defaultValue={devis?.fraisSupplementaires?.fraisChauffeur || 0}
              onWheel={(e) => e.target.blur()} // Désactive le scroll
            />
          </div>
          <div className="modif-devis-field">
            <label className="modif-devis-label">CSS :</label>
            <input
              type="number"
              className="modif-devis-input"
              {...register("css")}
              defaultValue={devis?.css}
              readOnly
            />
          </div>
          <div className="modif-devis-field">
            <label className="modif-devis-label">Total HT Frais :</label>
            <input
              type="number"
              className="modif-devis-input"
              {...register("totalHTFrais")}
              defaultValue={devis?.totalHTFrais}
              readOnly
            />
          </div>
          <div className="modif-devis-field">
            <label className="modif-devis-label">Acompte :</label>
            <input
              type="number"
              className="modif-devis-input"
              {...register("acompte")}
              defaultValue={devis?.acompte}
              readOnly
            />
          </div>
          <div className="modif-devis-field">
            <label className="modif-devis-label">
              Montant Remboursement :
            </label>
            <input
              type="number"
              className="modif-devis-input"
              {...register("montantRemboursement")}
              defaultValue={devis?.montantRemboursement}
              onWheel={(e) => e.target.blur()} // Désactive le scroll
            />
          </div>
        </div>
  
        {/* Totaux du devis */}
        <div className="modif-devis-totals">
          <div className="modif-devis-field">
            <label className="modif-devis-label">Remise :</label>
            <input
              type="number"
              className="modif-devis-input"
              {...register("remise")}
              defaultValue={devis?.remise}
              readOnly
            />
          </div>
          <div className="modif-devis-field">
            <label className="modif-devis-label">
              Pourcentage de Réduction :
            </label>
            <input
              type="number"
              className="modif-devis-input"
              {...register("discountPercentage")}
              defaultValue={devis?.discountPercentage}
              onWheel={(e) => e.target.blur()} // Désactive le scroll
            />
          </div>
  
          <div className="modif-devis-field">
            <label className="modif-devis-label">Total HT :</label>
            <input
              type="number"
              className="modif-devis-input"
              {...register("totalHT")}
              readOnly
            />
          </div>
  
          <div className="modif-devis-field">
            <label className="modif-devis-label">TVA :</label>
            <input
              type="number"
              className="modif-devis-input"
              {...register("tva")}
              readOnly
            />
          </div>
  
          <div className="modif-devis-field">
            <label className="modif-devis-label">Total TTC :</label>
            <input
              type="number"
              className="modif-devis-input"
              {...register("totalTTC")}
              readOnly
            />
          </div>
          <div className="modif-devis-field">
            <label className="modif-devis-label">Total Net :</label>
            <input
              type="number"
              className="modif-devis-input"
              {...register("totalNet")}
              readOnly
            />
          </div>
        </div>

        <div className="modif-devis-admin-verification">
          <div className="modif-devis-field">
            <label className="modif-devis-label" htmlFor="admin">
              Sélectionnez un administrateur :
            </label>
            <select
              id="admin"
              className="modif-devis-select"
              value={selectedAdmin}
              onChange={(e) => handleAdminChange(e.target.value)}
            >
              <option value="">-- Sélectionnez --</option>
              {admins.map((admin) => (
                <option
                  key={admin._id}
                  value={admin._id}
                  className="modif-devis-admin-option"
                >
                  {admin.nom} {admin.prenom}
                </option>
              ))}
            </select>
          </div>

          <div className="modif-devis-field">
            <label className="modif-devis-label" htmlFor="password">
              Mot de passe :
            </label>
            <input
              type="password"
              id="password"
              className="modif-devis-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>


        <button type="submit" className="modif-devis-submit">
          Modifier
        </button>
      </form>
    </div>
  );
  };
  
  export default ModifDevis;
  