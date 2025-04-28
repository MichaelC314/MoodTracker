import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/AnalyzeMood.css';

const AnalyzeMood = () => {
  const { id } = useParams();
  const [moodLogs, setMoodLogs] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);

  // Load mood logs from localStorage (Possibly change to DB later)
  useEffect(() => {
    const savedLogs = localStorage.getItem('moodLogs');
    if (savedLogs) {
      const logs = JSON.parse(savedLogs);
      setMoodLogs(logs);
      
      // If an ID was passed in the URL, find and select that mood
      if (id) {
        const found = logs.find(log => log.id === id);
        if (found) {
          setSelectedMood(found);
        }
      }
    }
  }, [id]);

  // Check for saved API key
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleSelectMood = (event) => {
    const selected = moodLogs.find(log => log.id === event.target.value);
    setSelectedMood(selected);
  };

  const handleSaveApiKey = () => {
    localStorage.setItem('openai_api_key', apiKey);
    setShowApiInput(false);
  };

  const analyzeMood = async () => {
    if (!selectedMood) {
      setError('Please select a mood to analyze');
      return;
    }

    if (!apiKey) {
      setShowApiInput(true);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const prompt = generateAnalysisPrompt(selectedMood);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful therapeutic assistant specialized in mood analysis and providing supportive insights."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const analysisText = data.choices[0].message.content;
      
      // Update the mood log with analysis
      const updatedLogs = moodLogs.map(log => {
        if (log.id === selectedMood.id) {
          return {
            ...log,
            analysis: {
              aiProcessed: true,
              aiNotes: analysisText
            }
          };
        }
        return log;
      });
      
      // Save to localStorage
      localStorage.setItem('moodLogs', JSON.stringify(updatedLogs));
      setMoodLogs(updatedLogs);
      
      // Update the selectedMood state with the analyzed mood
      const updatedMood = updatedLogs.find(log => log.id === selectedMood.id);
      setSelectedMood(updatedMood);
      
    } catch (err) {
      console.error("Error analyzing mood:", err);
      setError(`Failed to analyze mood: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generateAnalysisPrompt = (mood) => {
    return `
    Please analyze the following mood entry:
    
    Rating: ${mood.mood.rating}/10
    Mood: ${mood.mood.label}
    Date: ${mood.date}
    
    ${mood.context.notes ? `Notes: ${mood.context.notes}` : ''}
    ${mood.context.activities.length > 0 ? `Activities: ${mood.context.activities.join(', ')}` : ''}
    ${mood.context.location ? `Location: ${mood.context.location}` : ''}
    ${mood.context.factors.length > 0 ? `Factors: ${mood.context.factors.join(', ')}` : ''}
    
    Please provide:
    1. A brief summary of the current mood
    2. Potential factors contributing to this mood
    3. Suggestions for maintaining positive mood or improving negative mood
    4. Any patterns you notice (if applicable)
    
    Format your response in clear sections with helpful insights.
    `;
  };

  return (
    <div className="analyze-mood-page">
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
            <Link to="/mood-history" className="history-link">
              History
            </Link>
          </div>
        </div>
      </header>

      <div className="analyze-mood-container">
        <h2 className="page-title">Analyze Your Mood</h2>
        
        {showApiInput ? (
          <div className="api-key-section">
            <h3>Enter your OpenAI API Key</h3>
            <p>Your API key is stored locally and never sent to our servers.</p>
            <input
              type="password"
              className="api-key-input"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
            />
            <div className="api-key-actions">
              <button 
                className="save-key-btn"
                onClick={handleSaveApiKey}
                disabled={!apiKey}
              >
                Save Key
              </button>
              <button 
                className="cancel-btn"
                onClick={() => setShowApiInput(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="select-mood-section">
              <label htmlFor="mood-select">Select a mood to analyze:</label>
              <select 
                id="mood-select" 
                value={selectedMood?.id || ''}
                onChange={handleSelectMood}
                className="mood-select"
              >
                <option value="">-- Select a mood --</option>
                {moodLogs.map(log => (
                  <option key={log.id} value={log.id}>
                    {log.date} - {log.mood.label} ({log.mood.rating}/10)
                  </option>
                ))}
              </select>
            </div>

            {selectedMood && (
              <div className="selected-mood-card">
                <div className="mood-header">
                  <h3>{selectedMood.mood.label}</h3>
                  <div className="mood-rating">{selectedMood.mood.rating}/10</div>
                </div>
                
                <div className="mood-date">{new Date(selectedMood.timestamp).toLocaleString()}</div>
                
                {selectedMood.context.notes && (
                  <div className="mood-notes">
                    <p>{selectedMood.context.notes}</p>
                  </div>
                )}
                
                <div className="mood-details">
                  {selectedMood.context.activities.length > 0 && (
                    <div className="mood-activities">
                      <strong>Activities:</strong> {selectedMood.context.activities.join(', ')}
                    </div>
                  )}
                  
                  {selectedMood.context.location && (
                    <div className="mood-location">
                      <strong>Location:</strong> {selectedMood.context.location}
                    </div>
                  )}
                  
                  {selectedMood.context.factors.length > 0 && (
                    <div className="mood-factors">
                      <strong>Factors:</strong> {selectedMood.context.factors.join(', ')}
                    </div>
                  )}
                </div>

                {!selectedMood.analysis?.aiProcessed && (
                  <div className="analyze-actions">
                    <button
                      className="analyze-btn"
                      onClick={analyzeMood}
                      disabled={loading}
                    >
                      {loading ? 'Analyzing...' : 'Analyze with AI'}
                    </button>
                    {!apiKey && (
                      <button 
                        className="api-key-btn"
                        onClick={() => setShowApiInput(true)}
                      >
                        Set API Key
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {error && <div className="error-message">{error}</div>}

            {selectedMood?.analysis?.aiProcessed && (
              <div className="analysis-results">
                <h3>AI Analysis</h3>
                <div className="analysis-content">
                  {selectedMood.analysis.aiNotes.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Analyzing your mood...</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyzeMood;