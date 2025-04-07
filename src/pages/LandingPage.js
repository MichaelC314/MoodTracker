import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="container">
      <h1>Mood App</h1>
      <div className="button-group">
        <Link to="/enter-mood">
          <button className="mood-btn">Enter Mood</button>
        </Link>
        <Link to="/mood-history">
          <button className="mood-btn">Mood History</button>
        </Link>
        <Link to="/analyze-mood">
          <button className="mood-btn">Analyze Mood</button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;