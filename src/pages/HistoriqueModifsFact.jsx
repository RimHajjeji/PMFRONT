import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom"; // Importez useParams pour récupérer l'ID depuis l'URL
import axios from 'axios';

const HistoriqueModifsFact = () => {
  const { invoiceId } = useParams(); // Utilisez useParams pour récupérer l'ID de la facture
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!invoiceId) {
      setError('L\'ID de la facture est manquant.');
      setLoading(false);
      return;
    }

    const fetchModificationHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/invoices/${invoiceId}/modification-history`);
        setHistory(response.data);
      } catch (err) {
        setError('Erreur lors de la récupération de l\'historique des modifications');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchModificationHistory();
  }, [invoiceId]); // Ajoutez l'ID de la facture comme dépendance

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Historique des Modifications de la Facture</h2>
      <table>
        <thead>
          <tr>
            <th>Nom de l'Admin</th>
            <th>Date de Modification</th>
            <th>Heure de Modification</th>
          </tr>
        </thead>
        <tbody>
          {history.length > 0 ? (
            history.map((entry, index) => (
              <tr key={index}>
                <td>{entry.modifiedBy}</td>
                <td>{new Date(entry.timestamp).toLocaleDateString()}</td>
                <td>{new Date(entry.timestamp).toLocaleTimeString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">Aucune modification trouvée.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistoriqueModifsFact;
