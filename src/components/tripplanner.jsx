import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calender from "../assets/calender.png";
import { Notes } from "./notes";
import "./tripplanner.css";

export function TripPlanner() {
  const navigate = useNavigate();
  const [tripDetails, setTripDetails] = useState(null);
  const [notes, setNotes] = useState([]);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [showNotesPopup, setShowNotesPopup] = useState(false);

  useEffect(() => {
    try {
      const storedTrip = localStorage.getItem("tripDetails");
      const storedNotes = localStorage.getItem("tripNotes");

      if (storedTrip) {
        const parsedTrip = JSON.parse(storedTrip);
        setTripDetails(parsedTrip);
      } else {
        navigate("/enter-your-plans");
        return;
      }

      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        if (
          Array.isArray(parsedNotes) &&
          parsedNotes.every(
            (note) =>
              note &&
              typeof note === "object" &&
              "id" in note &&
              "title" in note &&
              "subNotes" in note &&
              Array.isArray(note.subNotes)
          )
        ) {
          setNotes(parsedNotes);
        } else {
          console.warn("Invalid notes structure found in localStorage");
          localStorage.removeItem("tripNotes");
          setNotes([]);
        }
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      setNotes([]);
    }
  }, [navigate]);

  useEffect(() => {
    if (!tripDetails) return;

    const calculateCountdown = () => {
      const now = new Date().getTime();
      const tripDate = new Date(
        `${tripDetails.departureDate} ${tripDetails.departureTime}`
      ).getTime();
      const difference = tripDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      }
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);

    return () => clearInterval(timer);
  }, [tripDetails]);
  useEffect(() => {
    try {
      if (notes && notes.length > 0) {
        localStorage.setItem("tripNotes", JSON.stringify(notes));
      } else {
        localStorage.removeItem("tripNotes");
      }
    } catch (error) {
      console.error("Error saving notes to localStorage:", error);
    }
  }, [notes]);

  const handleDeleteTrip = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this trip? This action cannot be undone."
      )
    ) {
      try {
        localStorage.removeItem("tripDetails");
        localStorage.removeItem("tripNotes");
        setTripDetails(null);
        setNotes([]);
        navigate("/");
      } catch (error) {
        console.error("Error deleting trip data:", error);
      }
    }
  };

  const handleAddNote = () => {
    setShowNotesPopup(true);
  };
  const handleNotesSubmit = (noteData) => {
    try {
      const newNote = {
        id: Date.now(),
        title: noteData.title || "Untitled",
        subNotes: Array.isArray(noteData.subNotes) ? noteData.subNotes : [],
      };

      setNotes((prev) => [...prev, newNote]);
      setShowNotesPopup(false);
    } catch (error) {
      console.error("Error adding new note:", error);
      alert("Failed to add note. Please try again.");
    }
  };

  const handleDeleteNote = (noteId) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
  };

  const handleDeleteSubNote = (noteId, subNoteId) => {
    setNotes((prev) =>
      prev.map((note) => {
        if (note.id === noteId) {
          return {
            ...note,
            subNotes: note.subNotes.filter(
              (subNote) => subNote.id !== subNoteId
            ),
          };
        }
        return note;
      })
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  const DeleteIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <>
      <div className="planner-container">
        <div className="timer-container">
          <div className="trip-container">
            <div className="location-container">
              <p className="city">Next Trip</p>
              <p className="location">
                {tripDetails?.location?.name?.split(",")[0] || "Loading..."}
              </p>
            </div>
            <span className="arrow">&rarr;</span>
            <div className="departure-container">
              <p className="departure">Departure</p>
              <p className="date">{formatDate(tripDetails?.departureDate)}</p>
            </div>
          </div>
          <div className="trip-calender">
            <div className="days">
              <p>{countdown.days}</p>
              <p className="aqua">DAYS</p>
            </div>
            <div className="hours">
              <p>{countdown.hours}</p>
              <p className="aqua">HOURS</p>
            </div>
            <div className="minutes">
              <p>{countdown.minutes}</p>
              <p className="aqua">MINUTES</p>
            </div>
            <div className="seconds">
              <p>{countdown.seconds}</p>
              <p className="aqua">SECONDS</p>
            </div>
          </div>
        </div>
        <div className="planner-actions">
          <button className="delete-trip-btn" onClick={handleDeleteTrip}>
            <DeleteIcon />
            Delete Trip
          </button>
          <button className="add-day-btn" onClick={handleAddNote}>
            <img src={Calender} width={20} alt="calender" />
            Add Day
          </button>
        </div>
        <div className="trip-planner">
          <div className="notes-grid">
            {notes.map((note, index) => (
              <div className="note-card" key={note.id}>
                <div className="note-card-header">
                  <div className="note-day">
                    <h3>Day {index + 1}</h3>
                  </div>
                  <button className="delete-note-btn" onClick={() => handleDeleteNote(note.id)}>
                    <DeleteIcon />
                  </button>
                </div>

                <div className="note-card-content">
                  <h4 className="note-card-title">{note.title}</h4>
                  <p className="note-date">
                    {(() => {
                      if (!tripDetails?.departureDate) return "";
                      const date = new Date(tripDetails.departureDate);
                      date.setDate(date.getDate() + index);
                      return (
                        formatDate(date.toISOString()) +
                        ", " +
                        date.toLocaleDateString("en-US", { weekday: "long" })
                      );
                    })()}
                  </p>

                  <div className="note-items">
                    {note.subNotes.map((subNote, subIndex) => (
                      <div key={subNote.id} className="note-item">
                        <span className="note-number">{subIndex + 1}.</span>
                        <p className="note-text">{subNote.text}</p>
                        <button className="delete-subnote-btn" onClick={() => handleDeleteSubNote(note.id, subNote.id)}>
                          <DeleteIcon />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showNotesPopup && (
        <Notes
          onClose={() => setShowNotesPopup(false)}
          onSubmit={handleNotesSubmit}
        />
      )}
    </>
  );
}
