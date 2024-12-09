import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";

const ModifFacture = () => {
  const { invoiceId } = useParams(); // ID de la facture dans l'URL
  const { register, handleSubmit, reset, setValue } = useForm();

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
          `http://localhost:5000/api/invoices/${invoiceId}`
        );
        setInvoice(response.data);
        reset(response.data); // Pré-remplir le formulaire avec les données de la facture
        setSelectedClient(response.data.client); // Définir le client initial
        // Pré-remplir les dates
        setValue("date", response.data.date?.split("T")[0]);
        setValue("billingPeriod.startDate", response.data.billingPeriod.startDate?.split("T")[0]);
        setValue("billingPeriod.endDate", response.data.billingPeriod.endDate?.split("T")[0]);
      } catch (err) {
        setError("Erreur lors de la récupération de la facture.");
        console.error(err);
      } finally {
        setLoadingInvoice(false);
      }
    };

    fetchInvoice();
  }, [invoiceId, reset, setValue]);

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
      await axios.put(`http://localhost:5000/api/invoices/${invoiceId}`, {
        ...data,
        client: selectedClient._id, // Inclure l'ID du client sélectionné
      });
      alert("Facture mise à jour avec succès !");
    } catch (err) {
      setError("Erreur lors de la mise à jour de la facture.");
      console.error(err);
    }
  };

  if (loadingInvoice) return <p>Chargement des données de la facture...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Modifier la Facture #{invoice?.invoiceNumber}</h1>

      {/* Sélection du client */}
      <h2>Informations du Client</h2>
      <div>
        <label>Client :</label>
        <select
          value={selectedClient?._id || ""}
          onChange={(e) => handleClientChange(e.target.value)}
        >
          <option value="">Sélectionnez un client</option>
          {clients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.firstName} {client.lastName}
            </option>
          ))}
        </select>
      </div>

      {/* Affichage des informations du client */}
      {selectedClient && (
        <div>
          <div>
            <label>Prénom :</label>
            <input
              type="text"
              {...register("client.firstName")}
              defaultValue={selectedClient.firstName}
              disabled
            />
          </div>
          <div>
            <label>Nom :</label>
            <input
              type="text"
              {...register("client.lastName")}
              defaultValue={selectedClient.lastName}
              disabled
            />
          </div>
          <div>
            <label>Email :</label>
            <input
              type="email"
              {...register("client.email")}
              defaultValue={selectedClient.email}
              disabled
            />
          </div>
          <div>
            <label>Téléphone :</label>
            <input
              type="text"
              {...register("client.phone")}
              defaultValue={selectedClient.phone}
              disabled
            />
          </div>
          <div>
            <label>Code Client :</label>
            <input
              type="text"
              {...register("client.codeClient")}
              defaultValue={selectedClient.codeClient}
              disabled
            />
          </div>
          <div>
            <label>Type de Client :</label>
            <input
              type="text"
              {...register("client.typeClient")}
              defaultValue={selectedClient.typeClient}
              disabled
            />
          </div>
        </div>
      )}

      {/* Formulaire de modification de la facture */}
      <h2>Informations de la Facture</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Date de Facturation :</label>
          <input type="date" {...register("date")} />
        </div>

        <div>
          <label>Émis Par :</label>
          <input {...register("issuedBy")} defaultValue={invoice?.issuedBy} />
        </div>

        <div>
          <label>Période de Facturation :</label>
          <div>
            <label>Début :</label>
            <input type="date" {...register("billingPeriod.startDate")} />
          </div>
          <div>
            <label>Fin :</label>
            <input type="date" {...register("billingPeriod.endDate")} />
          </div>
        </div>

        {/* Informations des véhicules facturés */}
        <div>
          <h3>Véhicules Facturés :</h3>
          {invoice?.vehicles.map((vehicle, index) => (
            <div key={index}>
              <label>Marque :</label>
              <input {...register(`vehicles[${index}].marque`)} defaultValue={vehicle.marque} />
              <label>Modèle :</label>
              <input {...register(`vehicles[${index}].modele`)} defaultValue={vehicle.modele} />
              <label>Taux Journalier :</label>
              <input
                type="number"
                {...register(`vehicles[${index}].dailyRate`)}
                defaultValue={vehicle.dailyRate}
              />
              <label>Jours Loués :</label>
              <input
                type="number"
                {...register(`vehicles[${index}].daysRented`)}
                defaultValue={vehicle.daysRented}
              />
              <label>Montant :</label>
              <input
                type="number"
                {...register(`vehicles[${index}].montant`)}
                defaultValue={vehicle.montant}
              />
            </div>
          ))}
        </div>

        {/* Totaux de la facture */}
        <div>
          <label>Total HT :</label>
          <input type="number" {...register("totalHT")} defaultValue={invoice.totalHT} />
        </div>
        <div>
          <label>TVA :</label>
          <input type="number" {...register("tva")} defaultValue={invoice.tva} />
        </div>
        <div>
          <label>Remise :</label>
          <input type="number" {...register("remise")} defaultValue={invoice.remise} />
        </div>
        <div>
          <label>Pourcentage de Réduction :</label>
          <input
            type="number"
            {...register("discountPercentage")}
            defaultValue={invoice.discountPercentage}
          />
        </div>
        <div>
          <label>Total TTC :</label>
          <input type="number" {...register("totalTTC")} defaultValue={invoice.totalTTC} />
        </div>
        <div>
          <label>Total Net :</label>
          <input type="number" {...register("totalNet")} defaultValue={invoice.totalNet} />
        </div>

        <button type="submit">Modifier</button>
      </form>
    </div>
  );
};

export default ModifFacture;
