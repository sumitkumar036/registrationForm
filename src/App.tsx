import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RegistrationPage } from './pages/RegistrationPage';
import { VerificationPage } from './pages/VerificationPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Main Marathon Registration Page */}
        <Route path="/" element={<RegistrationPage />} />

        {/* Verification Pass Route */}
        <Route path="/verifyUser" element={<VerificationPage />} />

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}