import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // État pour vérifier si l'utilisateur est authentifié
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Vérifiez si le token existe et potentiellement vérifiez sa validité
    if (token) {
      // Par exemple, vérifier l'expiration du token
      // Si vous utilisez un JWT, vous pouvez décoder le token pour vérifier la date d'expiration
      try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
        const isTokenValid = payload.exp * 1000 > Date.now(); // Vérifier l'expiration

        if (isTokenValid) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token'); // Token expiré, le retirer
        }
      } catch (e) {
        console.error('Invalid token');
        localStorage.removeItem('token'); // Token invalide, le retirer
      }
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    // Affichez un chargement pendant la vérification du token
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
