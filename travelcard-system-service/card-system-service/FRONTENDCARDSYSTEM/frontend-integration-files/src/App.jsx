import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import MainLayout from './layouts/MainLayout';

// Pages
import Dashboard      from './pages/Dashboard';
import RegisterCard   from './pages/RegisterCard';
import TopUp          from './pages/TopUp';
import StartJourney   from './pages/StartJourney';
import EndJourney     from './pages/EndJourney';
import CardDetails    from './pages/CardDetails';
import JourneyHistory from './pages/JourneyHistory';
import Stations       from './pages/Stations';

/**
 * Root router — all pages are rendered inside MainLayout (sidebar + navbar).
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index                   element={<Dashboard />} />
          <Route path="/register"        element={<RegisterCard />} />
          <Route path="/topup"           element={<TopUp />} />
          <Route path="/start-journey"   element={<StartJourney />} />
          <Route path="/end-journey"     element={<EndJourney />} />
          <Route path="/card-details"    element={<CardDetails />} />
          <Route path="/history"         element={<JourneyHistory />} />
          <Route path="/stations"        element={<Stations />} />
          {/* Catch-all → dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
