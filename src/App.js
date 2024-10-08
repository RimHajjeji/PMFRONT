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

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
