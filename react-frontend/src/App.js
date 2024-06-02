import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login/Login';
import Organization from './Organization/Organization';
import OAuth2RedirectHandler from '././Login/OAuth2RedirectHandler';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/organization" element={<Organization />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
      </Routes>
    </Router>
  );
}

export default App;