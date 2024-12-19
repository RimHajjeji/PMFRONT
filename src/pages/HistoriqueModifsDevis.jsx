import React, { useEffect, useState } from 'react'; 
import { useParams } from "react-router-dom"; 
import axios from 'axios';
import ReactPaginate from 'react-paginate'; // Import ReactPaginate
import '../style/HistoriqueModifsDevis.css';

const HistoriqueModifsDevis = () => {
  const { devisId } = useParams(); // Utilisez useParams pour récupérer l'ID du Devis
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // Page actuelle
  const historyPerPage = 5; // Nombre d'éléments à afficher par page

  useEffect(() => {
    if (!devisId) {
      setError('L\'ID du Devis est manquant.');
      setLoading(false);
      return;
    }

    const fetchModificationHistory = async () => {
      try {
        const response = await axios.get(`https://envoices.premiummotorscars.com/api/devis/${devisId}/modification-history`);
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
  }, [devisId]);

  // Pagination : calculer les entrées pour la page actuelle
  const offset = currentPage * historyPerPage;
  const currentPageHistory = history.slice(offset, offset + historyPerPage);

  // Fonction pour gérer le changement de page
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="historique-container">
      <h2 className="titledevis">Historique des Modifications du Devis</h2>
      <table className="historique-table">
        <thead>
          <tr>
            <th>Nom de l'Admin</th>
            <th>Date de Modification</th>
            <th>Heure de Modification</th>
          </tr>
        </thead>
        <tbody>
          {currentPageHistory.length > 0 ? (
            currentPageHistory.map((entry, index) => (
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

      {/* Pagination */}
      <ReactPaginate
        previousLabel={'Précédent'}
        nextLabel={'Suivant'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={Math.ceil(history.length / historyPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination9'}
        activeClassName={'active'}
      />
    </div>
  );
};

export default HistoriqueModifsDevis;
