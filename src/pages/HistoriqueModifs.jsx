import React, { useEffect, useState } from "react";
import axios from "axios";

const HistoriqueModifs = ({ factureId }) => {
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistorique = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/invoices/${factureId}/history`
        );
        setHistorique(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération de l'historique des modifications.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorique();
  }, [factureId]);

  if (loading) {
    return <p>Chargement de l'historique des modifications...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="historique-modifs">
      <h2>Historique des Modifications</h2>
      {historique.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Date</th>
              <th>Heure</th>
            </tr>
          </thead>
          <tbody>
            {historique.map((modif) => (
              <tr key={modif.id}>
                <td>{modif.nom}</td>
                <td>{modif.prenom}</td>
                <td>{new Date(modif.dateModification).toLocaleDateString()}</td>
                <td>{new Date(modif.dateModification).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucune modification enregistrée pour cette facture.</p>
      )}
    </div>
  );
};

export default HistoriqueModifs;
