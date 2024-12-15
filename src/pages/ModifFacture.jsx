import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import "../style/ModifFacture.css";

const ModifFacture = () => {
  const { invoiceId } = useParams(); // ID de la facture dans l'URL
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const [invoice, setInvoice] = useState(null); // Données de la facture
  const [clients, setClients] = useState([]); // Liste des clients
  const [selectedClient, setSelectedClient] = useState(null); // Client sélectionné
  const [loadingInvoice, setLoadingInvoice] = useState(true);
  const [error, setError] = useState(null);

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

  // Récupérer les données de la facture
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/invoices/${invoiceId}`,
        );
        const invoiceData = response.data;

        setInvoice(invoiceData);
        reset(invoiceData); // Pré-remplir le formulaire avec les données de la facture
        setSelectedClient(invoiceData.client); // Définir le client initial

        // Pré-remplir les dates et les frais supplémentaires
        setValue("date", invoiceData.date?.split("T")[0]);
        setValue(
          "billingPeriod.startDate",
          invoiceData.billingPeriod?.startDate?.split("T")[0],
        );
        setValue(
          "billingPeriod.endDate",
          invoiceData.billingPeriod?.endDate?.split("T")[0],
        );
        setValue(
          "fraisCarburant",
          invoiceData.fraisSupplementaires?.fraisCarburant || 0,
        );
        setValue(
          "fraisKilometrage",
          invoiceData.fraisSupplementaires?.fraisKilometrage || 0,
        );
        setValue(
          "fraisLivraison",
          invoiceData.fraisSupplementaires?.fraisLivraison || 0,
        );
        setValue(
          "fraisChauffeur",
          invoiceData.fraisSupplementaires?.fraisChauffeur || 0,
        );
      } catch (err) {
        setError("Erreur lors de la récupération de la facture.");
        console.error(err);
      } finally {
        setLoadingInvoice(false);
      }
    };

    fetchInvoice();
  }, [invoiceId, reset, setValue]);

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

  
  useEffect(() => {
    if (invoice) {
      setValue("tarifType", invoice.vehicles[0]?.tarifType || "Taux Journalier");
      setValue("durationType", invoice.vehicles[0]?.durationType || "Jours Loués");
    }
  }, [invoice, setValue]);
  

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

  // Soumission du formulaire
  const onSubmit = async (data) => {
    try {
      const updatedData = {
        ...data,
        client: selectedClient._id,
        totalHT: calculateTotalHT(),
        totalHTFrais: calculateTotalHTFrais(),
        tva: calculateTVA(),
        css: calculateCSS(),
        totalTTC: calculateTotalTTC(),
        totalNet: calculateTotalNet(),
      };
      await axios.put(
        `http://localhost:5000/api/invoices/${invoiceId}`,
        updatedData,
      );
      alert("Facture mise à jour avec succès !");
    } catch (err) {
      setError("Erreur lors de la mise à jour de la facture.");
      console.error(err);
    }
  };

  if (loadingInvoice) return <p>Chargement des données de la facture...</p>;
  if (error) return <p>{error}</p>;

  return (
      <div className="modif-facture">
        <h1 className="modif-facture-title">Modifier la Facture #{invoice?.invoiceNumber}</h1>
    
        {/* Sélection du client */}
        <h2 className="modif-facture-client-info">Informations du Client</h2>
        <div className="modif-facture-client-select">
          <label className="modif-facture-label">Client :</label>
          <select
            className="modif-facture-select"
            value={selectedClient?._id || ""}
            onChange={(e) => handleClientChange(e.target.value)}
          >
            <option value="">Sélectionnez un client</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id} className="modif-facture-client-option">
                {client.firstName} {client.lastName}
              </option>
            ))}
          </select>
        </div>
    
        {/* Affichage des informations du client */}
        {selectedClient && (
          <div className="modif-facture-client-details">
            <div className="modif-facture-field">
              <label className="modif-facture-label">Prénom :</label>
              <input
                type="text"
                className="modif-facture-input"
                {...register("client.firstName")}
                defaultValue={selectedClient.firstName}
                readOnly
              />
            </div>
            <div className="modif-facture-field">
              <label className="modif-facture-label">Nom :</label>
              <input
                type="text"
                className="modif-facture-input"
                {...register("client.lastName")}
                defaultValue={selectedClient.lastName}
                readOnly
              />
            </div>
            <div className="modif-facture-field">
              <label className="modif-facture-label">Email :</label>
              <input
                type="email"
                className="modif-facture-input"
                {...register("client.email")}
                defaultValue={selectedClient.email}
                readOnly
              />
            </div>
            <div className="modif-facture-field">
              <label className="modif-facture-label">Téléphone :</label>
              <input
                type="text"
                className="modif-facture-input"
                {...register("client.phone")}
                defaultValue={selectedClient.phone}
                readOnly
              />
            </div>
            <div className="modif-facture-field">
              <label className="modif-facture-label">Code Client :</label>
              <input
                type="text"
                className="modif-facture-input"
                {...register("client.codeClient")}
                defaultValue={selectedClient.codeClient}
                readOnly
              />
            </div>
            <div className="modif-facture-field">
              <label className="modif-facture-label">Type de Client :</label>
              <input
                type="text"
                className="modif-facture-input"
                {...register("client.typeClient")}
                defaultValue={selectedClient.typeClient}
                readOnly
              />
            </div>
          </div>
        )}
    
        {/* Formulaire de modification de la facture */}
        <h2 className="modif-facture-info">Informations de la Facture</h2>
        <form className="modif-facture-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="modif-facture-field">
            <label className="modif-facture-label">Date de Facturation :</label>
            <input type="date" className="modif-facture-input" {...register("date")} readOnly />
          </div>
    
          <div className="modif-facture-field">
            <label className="modif-facture-label">Émis Par :</label>
            <input
              className="modif-facture-input"
              {...register("issuedBy")}
              defaultValue={invoice?.issuedBy}
              readOnly
            />
          </div>
          <div className="modif-facture-billing-period">
            <label className="modif-facture-label">Période de Facturation :</label>
            <div className="modif-facture-field">
              <label className="modif-facture-label">Début :</label>
              <input type="date" className="modif-facture-input" {...register("billingPeriod.startDate")} />
            </div>
            <div className="modif-facture-field">
              <label className="modif-facture-label">Fin :</label>
              <input type="date" className="modif-facture-input" {...register("billingPeriod.endDate")} />
            </div>
          </div>
    
          {/* Informations des véhicules facturés */}
          <div className="modif-facture-vehicles">
            <h3 className="modif-facture-subtitle">Véhicules Facturés :</h3>
            <table className="modif-facture-table">
              <thead>
                <tr>
                  <th className="modif-facture-th">Marque</th>
                  <th className="modif-facture-th">Modèle</th>
                  <th className="modif-facture-th">{invoice?.vehicles[0]?.tarifType || "Tarif"}</th>
                  <th className="modif-facture-th">{invoice?.vehicles[0]?.durationType || "Durée"}</th>
                  <th className="modif-facture-th">Montant HT</th>
                </tr>
              </thead>
              <tbody>
                {rentedVehicles.map((vehicle, index) => (
                  <tr key={index} className="modif-facture-row">
                    <td>
                      <input
                        type="text"
                        className="modif-facture-input"
                        {...register(`vehicles[${index}].marque`)}
                        defaultValue={vehicle.marque}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="modif-facture-input"
                        {...register(`vehicles[${index}].modele`)}
                        defaultValue={vehicle.modele}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="modif-facture-input"
                        {...register(`vehicles[${index}].dailyRate`, {
                          valueAsNumber: true,
                          onChange: () => setValue("totalHT", calculateTotalHT()),
                        })}
                        defaultValue={vehicle.dailyRate}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="modif-facture-input"
                        {...register(`vehicles[${index}].daysRented`, {
                          valueAsNumber: true,
                          onChange: () => setValue("totalHT", calculateTotalHT()),
                        })}
                        defaultValue={vehicle.daysRented}
                      />
                    </td>
                    <td className="modif-facture-amount">
                      {vehicle.dailyRate * vehicle.daysRented || 0} {/* Calcul automatique */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
    
          {/* Nouveaux champs */}
          <div className="modif-facture-additional-fees">
            <div className="modif-facture-field">
              <label className="modif-facture-label">Frais Carburant :</label>
              <input
                type="number"
                className="modif-facture-input"
                {...register("fraisCarburant")}
                defaultValue={invoice?.fraisCarburant}
              />
            </div>
            <div className="modif-facture-field">
              <label className="modif-facture-label">Frais Kilométrage :</label>
              <input
                type="number"
                className="modif-facture-input"
                {...register("fraisKilometrage")}
                defaultValue={invoice?.fraisKilometrage}
              />
            </div>
            <div className="modif-facture-field">
              <label className="modif-facture-label">Frais Livraison :</label>
              <input
                type="number"
                className="modif-facture-input"
                {...register("fraisLivraison")}
                defaultValue={invoice?.fraisLivraison}
              />
            </div>
            <div className="modif-facture-field">
              <label className="modif-facture-label">Frais Chauffeur :</label>
              <input
                type="number"
                className="modif-facture-input"
                {...register("fraisChauffeur")}
                defaultValue={invoice?.fraisChauffeur}
              />
            </div>
            <div className="modif-facture-field">
              <label className="modif-facture-label">CSS :</label>
              <input
                type="number"
                className="modif-facture-input"
                {...register("css")}
                defaultValue={invoice?.css}
                readOnly
              />
            </div>
            <div className="modif-facture-field">
              <label className="modif-facture-label">Total HT Frais :</label>
              <input
                type="number"
                className="modif-facture-input"
                {...register("totalHTFrais")}
                defaultValue={invoice?.totalHTFrais}
                readOnly
              />
            </div>
            <div className="modif-facture-field">
              <label className="modif-facture-label">Acompte :</label>
              <input
                type="number"
                className="modif-facture-input"
                {...register("acompte")}
                defaultValue={invoice?.acompte}
                readOnly
              />
            </div>
            <div className="modif-facture-field">
              <label className="modif-facture-label">Montant Remboursement :</label>
              <input
                type="number"
                className="modif-facture-input"
                {...register("montantRemboursement")}
                defaultValue={invoice?.montantRemboursement}
              />
            </div>
          </div>
    
          {/* Totaux de la facture */}
    
          <div className="modif-facture-totals">
            <div className="modif-facture-field">
              <label className="modif-facture-label">Remise :</label>
              <input
                type="number"
                className="modif-facture-input"
                {...register("remise")}
                defaultValue={invoice?.remise}
                readOnly
              />
            </div>
            <div className="modif-facture-field">
              <label className="modif-facture-label">Pourcentage de Réduction :</label>
              <input
                type="number"
                className="modif-facture-input"
                {...register("discountPercentage")}
                defaultValue={invoice?.discountPercentage}
              />
            </div>
    
            <div className="modif-facture-field">
              <label className="modif-facture-label">Total HT :</label>
              <input type="number" className="modif-facture-input" {...register("totalHT")} readOnly />
            </div>
    
            <div className="modif-facture-field">
              <label className="modif-facture-label">TVA :</label>
              <input type="number" className="modif-facture-input" {...register("tva")} readOnly />
            </div>
    
            <div className="modif-facture-field">
              <label className="modif-facture-label">Total TTC :</label>
              <input type="number" className="modif-facture-input" {...register("totalTTC")} readOnly />
            </div>
            <div className="modif-facture-field">
              <label className="modif-facture-label">Total Net :</label>
              <input type="number" className="modif-facture-input" {...register("totalNet")} readOnly />
            </div>
          </div>
          <button type="submit" className="modif-facture-submit">Modifier</button>
        </form>
      </div>
    );
};

export default ModifFacture;
