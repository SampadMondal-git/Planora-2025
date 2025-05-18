import "./notes.css";
import { useState } from "react";

export function Notes({ onClose, onSubmit }) {
  const [notesTitle, setNotesTitle] = useState("");
  const [notesList, setNotesList] = useState([""]);

  const handleAddNote = () => {
    setNotesList([...notesList, ""]);
  };

  const handleNoteChange = (index, value) => {
    const updatedNotes = [...notesList];
    updatedNotes[index] = value;
    setNotesList(updatedNotes);
  };

  const handleSubmit = () => {
    onSubmit({
      title: notesTitle,
      subNotes: notesList.map((note) => ({
        id: Date.now() + Math.random(),
        text: note,
      })),
    });
    onClose();
  };

  return (
    <div className="notes-popup-overlay">
      <div className="notes-popup-container">
        <div className="notes-container">
          {" "}
          <div className="notes-header">
            <h1>Add Your Notes</h1>
            <button className="close-btn" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="notes-title-input">
            <input type="text" placeholder="Enter Notes Title" className="title-input" value={notesTitle} onChange={(e) => setNotesTitle(e.target.value)}/>
          </div>
          <div className="notes-input">
            <h1>Add Notes Itinerary</h1>
            {notesList.map((note, index) => (
              <div key={index} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input type="text" placeholder="Enter itinerary notes" className="title-input" value={note} 
                onChange={(e) => handleNoteChange(index, e.target.value)}/>
                <button onClick={() => { const newNotes = notesList.filter((_, i) => i !== index);
                    setNotesList(newNotes);
                  }}
                  style={{
                    background: "rgba(255, 0, 0, 0.1)",
                    border: "1px solid rgba(255, 0, 0, 0.2)",
                    color: "#ff4444",
                    padding: "0.5rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "35px",
                    height: "35px",
                  }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </div>
            ))}
            <div className="notes-btn">
              <button className="add-notes-btn" onClick={handleAddNote}>
                + Add Notes
              </button>
              <button className="submit-btn" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
