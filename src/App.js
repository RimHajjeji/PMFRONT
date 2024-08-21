import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';  // Import Signup component
import PrivateRoute from './PrivateRoute';
import Dashboard from './pages/Dashboard'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />  {/* Add Signup route */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard /> 
            </PrivateRoute>
          } 
        />
        {/* Default route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
