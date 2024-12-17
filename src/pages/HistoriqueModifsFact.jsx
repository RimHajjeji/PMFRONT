import React, { useEffect, useState } from 'react'; 
import { useParams } from "react-router-dom"; 
import axios from 'axios';
import '../style/HistoriqueModifsFact.css';

const HistoriqueModifsFact = () => {
  const { invoiceId } = useParams();
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
        // Tri des données par date décroissante
        const sortedHistory = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setHistory(sortedHistory);
      } catch (err) {
        setError('Erreur lors de la récupération de l\'historique des modifications');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchModificationHistory();
  }, [invoiceId]);

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="historique-container">
      <h2 className="title">Historique des Modifications de la Facture</h2>
      <table className="historique-table">
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
