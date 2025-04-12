import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import EnterMood from './pages/EnterMood';
import MoodHistory from './pages/MoodHistory';
import AnalyzeMood from './pages/AnalyzeMood';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/enter-mood" element={<EnterMood />} />
        <Route path="/mood-history" element={<MoodHistory />} />
        <Route path="/analyze-mood" element={<AnalyzeMood />} />
      </Routes>
    </Router>
  );
}

export default App;