import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import '../styles/MoodHistory.css';

const MoodHistory = () => {
  const navigate = useNavigate();
  const [moodLogs, setMoodLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest');
  const [filterMood, setFilterMood] = useState('all');

  // Load logs from localStorage (Most likely will change to DB in the future)
  useEffect(() => {
    const savedLogs = localStorage.getItem('moodLogs');
    if (savedLogs) {
      const logs = JSON.parse(savedLogs);
      setMoodLogs(logs);
      setFilteredLogs(logs);
    }
  }, []);

  // Handle sorting and filtering
  useEffect(() => {
    let sorted = [...moodLogs];
    
    // Apply sorting
    if (sortOrder === 'newest') {
      sorted.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } else if (sortOrder === 'oldest') {
      sorted.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } else if (sortOrder === 'highest') {
      sorted.sort((a, b) => b.mood.rating - a.mood.rating);
    } else if (sortOrder === 'lowest') {
      sorted.sort((a, b) => a.mood.rating - b.mood.rating);
    }
    
    // Apply filtering
    if (filterMood !== 'all') {
      sorted = sorted.filter(log => log.mood.label === filterMood);
    }
    
    setFilteredLogs(sorted);
  }, [moodLogs, sortOrder, filterMood]);

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterMood(e.target.value);
  };

  const handleViewDetails = (id) => {
    // Navigate to analysis page with the mood log ID
    navigate(`/analyze-mood/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this mood log?')) {
      const updatedLogs = moodLogs.filter(log => log.id !== id);
      setMoodLogs(updatedLogs);
      localStorage.setItem('moodLogs', JSON.stringify(updatedLogs));
    }
  };

  // Get unique mood labels for filter dropdown
  const moodLabels = ['all', ...new Set(moodLogs.map(log => log.mood.label))];

  return (
    <div className="mood-history-page">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <Link to="/" className="home-link">
              <div className="home-button">
                <span className="home-icon">↩</span>
                <span className="home-text">Home</span>
              </div>
            </Link>
          </div>
          
          <div className="header-center">
            <h1 className="app-title">Kibun Keeper</h1>
          </div>
          
          <div className="header-right">
            <div className="entry-count">
              <span className="count-number">{moodLogs.length}</span>
              <span className="count-text">entries</span>
            </div>
          </div>
        </div>
      </header>

      <div className="mood-history-container">
        <h2 className="page-title">Your Mood History</h2>
        
        <div className="controls">
          <div className="control-group">
            <label>Sort by:</label>
            <select value={sortOrder} onChange={handleSortChange}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
          
          <div className="control-group">
            <label>Filter by mood:</label>
            <select value={filterMood} onChange={handleFilterChange}>
              {moodLabels.map(label => (
                <option key={label} value={label}>
                  {label === 'all' ? 'All Moods' : label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {filteredLogs.length === 0 ? (
          <div className="no-logs">
            <p>No mood logs found. Start tracking your mood to see history here.</p>
          </div>
        ) : (
          <div className="mood-logs">
            {filteredLogs.map(log => (
              <div className="mood-card" key={log.id}>
                <div className="mood-header">
                  <h3>{log.mood.label}</h3>
                  <div className="mood-rating">{log.mood.rating}/10</div>
                </div>
                
                <div className="mood-date">{new Date(log.timestamp).toLocaleString()}</div>
                
                {log.context.notes && (
                  <div className="mood-notes">
                    <p>{log.context.notes}</p>
                  </div>
                )}
                
                <div className="mood-details">
                  {log.context.activities.length > 0 && (
                    <div className="mood-activities">
                      <strong>Activities:</strong> {log.context.activities.join(', ')}
                    </div>
                  )}
                  
                  {log.context.location && (
                    <div className="mood-location">
                      <strong>Location:</strong> {log.context.location}
                    </div>
                  )}
                  
                  {log.context.factors.length > 0 && (
                    <div className="mood-factors">
                      <strong>Factors:</strong> {log.context.factors.join(', ')}
                    </div>
                  )}
                </div>
                
                <div className="mood-actions">
                  <button 
                    className="analyze-btn" 
                    onClick={() => handleViewDetails(log.id)}
                  >
                    Analyze
                  </button>
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDelete(log.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodHistory;