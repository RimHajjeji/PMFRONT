import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PrivateRoute from './PrivateRoute';
import Dashboard from './pages/Dashboard';
import TableDevis from './pages/TableDevis';
import AddClient from './pages/AddClient';
import AddMaterial from './pages/AddMaterial';
import Facture from './pages/Facture';
import Devis from './pages/Devis';
import Layout from './components/Layout'; 
import Imprimefact from './pages/Imprimefact'; 
import Imprimedevis from './pages/Imprimedevis';
import Facture_Devis from './pages/Facture_Devis';
import DevisClient from './pages/DevisClients';
import FacturesClient from './pages/FacturesClient';
import ModifFacture from './pages/ModifFacture';
import ModiferClient from './pages/ModiferClient';
import HistoriqueModifs from './pages/HistoriqueModifs';
import DevisClients from './pages/DevisClients';
import ModifDevis from './pages/ModifDevis';
import VoirDevis from './pages/VoirDevis';
import VoirFacture from './pages/VoirFacture';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/table-devis"
          element={
            <PrivateRoute>
              <Layout>
                <TableDevis />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-client"
          element={
            <PrivateRoute>
              <Layout>
                <AddClient />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/modif-client/:clientId"
          element={
            <PrivateRoute>
              <Layout>
                <ModiferClient />
              </Layout>
            </PrivateRoute>
          }
        />
         <Route
          path="/facture_devis"
          element={
            <PrivateRoute>
              <Layout>
                <Facture_Devis />
              </Layout>
            </PrivateRoute>
          }
        />
         <Route
          path="/factures_client/:clientId"
          element={
            <PrivateRoute>
              <Layout>
                <FacturesClient />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/devis_clients/:clientId"
          element={
            <PrivateRoute>
              <Layout>
                <DevisClients />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/historique_modifs/:invoiceId"
          element={
            <PrivateRoute>
              <Layout>
                <HistoriqueModifs />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/modif_facture/:invoiceId"
          element={
            <PrivateRoute>
              <Layout>
                <ModifFacture />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/modif_devis/:devisId"
          element={
            <PrivateRoute>
              <Layout>
                <ModifDevis />
              </Layout>
            </PrivateRoute>
          }
        />
         <Route
          path="/devis_client"
          element={
            <PrivateRoute>
              <Layout>
                <DevisClient />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-material"
          element={
            <PrivateRoute>
              <Layout>
                <AddMaterial />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/facture"
          element={
            <PrivateRoute>
              <Layout>
                <Facture />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/devis"
          element={
            <PrivateRoute>
              <Layout>
                <Devis />
              </Layout>
            </PrivateRoute>
          }
        />
        {/* Wrap Imprimefact inside Layout */}
        <Route
          path="/imprimefact/:invoiceId"
          element={
            <PrivateRoute>
              <Layout>
                <Imprimefact />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/imprimedevis/:devisId"
          element={
            <PrivateRoute>
              <Layout>
                <Imprimedevis/>
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/Voirfacture/:invoiceId"
          element={
            <PrivateRoute>
              <Layout>
                <VoirFacture />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/Voirdevis/:devisId"
          element={
            <PrivateRoute>
              <Layout>
                <VoirDevis />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
