import { v4 as uuidv4 } from 'uuid'; // For Timestamps

class MoodLogObject {
  constructor({
    rating, // Mood rating (1-10)
    label, // Mood label (e.g., Happy, Sad, Angry)
    notes = "", // Optional notes
    activities = [], // Optional activities (array of strings)
    location = "", // Optional location (string)
    factors = [] // Optional factors (array of strings)
  }) {
    this.id = uuidv4(); // Unique ID for each mood log entry
    this.date = new Date().toLocaleDateString(); // Current date
    this.timestamp = new Date().toISOString(); // ISO format timestamp
    this.mood = {
      rating, // Mood rating (1-10)
      label // Mood label (e.g., Happy, Sad, Angry)
    };
    this.context = {
      notes,
      activities,
      location,
      factors
    };
    this.analysis = {
      aiProcessed: false,
      aiNotes: null
    };
  }
  // Method to add the AI analysis notes to the mood log object
  analyze(aiAnalysis) {
    this.analysis.aiProcessed = true;
    this.analysis.aiNotes = aiAnalysis;
  }
}

export default MoodLogObject;