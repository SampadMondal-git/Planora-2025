import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./destination.css";

export function Destination() {
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const [step, setStep] = useState(1);
  const [departureDate, setDepartureDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const navigate = useNavigate();
  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (isSelected || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://api.locationiq.com/v1/autocomplete?key=${API_KEY}&q=${query}&limit=5`
        );
        setSuggestions(res.data);
      } catch (error) {
        console.error("LocationIQ error:", error);
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(fetchData, 500);
    return () => clearTimeout(debounce);
  }, [query, isSelected]);

  const handleSelect = (place) => {
    setQuery(place.display_name);
    setSuggestions([]);
    setIsSelected(true);

    const locationData = {
      name: place.display_name,
    };

    localStorage.setItem("selectedLocation", JSON.stringify(locationData));
  };

  const handleConfirm = () => {
    const tripDetails = {
      location: JSON.parse(localStorage.getItem("selectedLocation")),
      departureDate,
      departureTime,
    };
    localStorage.setItem("tripDetails", JSON.stringify(tripDetails));
    navigate("/planner");
  };

  const goToNextStep = () => {
    if (step === 2) {
      const today = new Date();
      const selectedDate = new Date(departureDate);

      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        alert("Departure date cannot be in the past.");
        return;
      }
    }

    if (step === 4) {
      handleConfirm();
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const goToPreviousStep = () => setStep((prev) => prev - 1);

  return (
    <div className="plans-container">
      <div className="card">
        {step === 1 && (
          <>
            <h1 className="title">Where to next?</h1>
            <p className="subtitle">Start typing to search your destination</p>

            <input type="text" placeholder="e.g., Paris, Tokyo, Goa" className="input" value={query} onChange={(e) => { setQuery(e.target.value); setIsSelected(false)}}/>

            {suggestions.length > 0 && !isSelected && (
              <ul className="suggestions">
                {suggestions.map((place, idx) => (
                  <li key={idx} className="suggestion-item" onClick={() => handleSelect(place)}>
                    {place.display_name}
                  </li>
                ))}
              </ul>
            )}

            <button
              className={`button ${!isSelected ? "disabled" : "primary"}`}
              onClick={goToNextStep} disabled={!isSelected}>
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="title">When are you leaving?</h1>
            <p className="subtitle">Pick your departure date</p>

            <input type="date" className="input" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}/>

            <div className="button-group">
              <button className="button secondary" onClick={goToPreviousStep}>
                Back
              </button>
              <button className={`button ${!departureDate ? "disabled" : "primary"}`}
                onClick={goToNextStep} disabled={!departureDate}>
                Next
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="title">What time are you leaving?</h1>
            <p className="subtitle">Pick your departure time</p>
            <input type="time" className="input" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)}/>

            <div className="button-group">
              <button className="button secondary" onClick={goToPreviousStep}>
                Back
              </button>
              <button className={`button ${!departureTime ? "disabled" : "primary"}`}
                onClick={goToNextStep}
                disabled={!departureTime}>
                Next
              </button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h1 className="title">Review Your Plan</h1>
            <div className="review">
              <p>
                <strong>Destination:</strong> {query}
              </p>
              <p>
                <strong>Departure Date:</strong>{" "}
                {new Date(departureDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p>
                <strong>Departure Time:</strong>{" "}
                {new Date(`2000-01-01T${departureTime}`).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  }
                )}
              </p>
            </div>

            <div className="button-group">
              <button  className="button secondary" onClick={goToPreviousStep}>
                Back
              </button>
              <button className="button primary" onClick={handleConfirm}>
                Start Planning
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
