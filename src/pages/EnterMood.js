import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MoodLogObject from '../models/MoodLogObject';
import '../styles/EnterMood.css'; 

const EnterMood = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  
  const [formData, setFormData] = useState({
    rating: 5,
    label: 'Neutral',
    notes: '',
    activities: '',
    location: '',
    factors: ''
  });

  // Load existing logs from localStorage on component mount
  useEffect(() => {
    const savedLogs = localStorage.getItem('moodLogs');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert comma-separated strings to arrays
    const activities = formData.activities ? formData.activities.split(',').map(item => item.trim()) : [];
    const factors = formData.factors ? formData.factors.split(',').map(item => item.trim()) : [];
    
    // Create new mood log object
    const newLog = new MoodLogObject({
      rating: parseInt(formData.rating),
      label: formData.label,
      notes: formData.notes,
      activities: activities,
      location: formData.location,
      factors: factors
    });
    
    // Add to logs array
    const updatedLogs = [...logs, newLog];
    setLogs(updatedLogs);
    
    // Save to localStorage
    localStorage.setItem('moodLogs', JSON.stringify(updatedLogs));
    
    // Redirect to history page or clear form
    // alert('Mood logged successfully!');
    navigate('/mood-history');
  };

  return (
    <div className="enter-mood-container">
      <h1>Log Your Mood</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>How are you feeling? (1-10)</label>
          <input
            type="range"
            min="1"
            max="10"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
          />
          <span>{formData.rating}</span>
        </div>
        
        <div className="form-group">
          <label>Mood Label</label>
          <select name="label" value={formData.label} onChange={handleChange}>
            <option value="Happy">Happy</option>
            <option value="Excited">Excited</option>
            <option value="Content">Content</option>
            <option value="Neutral">Neutral</option>
            <option value="Anxious">Anxious</option>
            <option value="Sad">Sad</option>
            <option value="Angry">Angry</option>
            <option value="Stressed">Stressed</option>
            <option value="Tired">Tired</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="How are you feeling? What's on your mind?"
          ></textarea>
        </div>
        
        <div className="form-group">
          <label>Activities (comma-separated)</label>
          <input
            type="text"
            name="activities"
            value={formData.activities}
            onChange={handleChange}
            placeholder="Work, Exercise, Reading"
          />
        </div>
        
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Home, Work, Outside"
          />
        </div>
        
        <div className="form-group">
          <label>Factors (comma-separated)</label>
          <input
            type="text"
            name="factors"
            value={formData.factors}
            onChange={handleChange}
            placeholder="Weather, Health, Relationships"
          />
        </div>
        
        <button type="submit" className="submit-btn">Log Mood</button>
      </form>
    </div>
  );
};

export default EnterMood;