import React, { useState, useEffect } from "react";
import "../css/Vote.css";

// API URL och nyckel från The Cat API
// Inspirerad av The Cat API-exempel: Grundläggande URL och API-nyckelhantering https://developers.thecatapi.com/view-account/ylX4blBYT9FaoVd6OhvR?report=s7StySvTw
const API_URL = "https://api.thecatapi.com/v1/";
const API_KEY =
  "live_6gao4LLmzRWzxYNHgpr3wVztfGwgIWBDwCVYTi95yBmnpg3aMxezSH8E80LvM8hP";

const Vote = () => {
  const [currentImage, setCurrentImage] = useState(null); // Sparar aktuell kattbild
  const [breedName, setBreedName] = useState(""); // Sparar kattens rasnamn
  const [loading, setLoading] = useState(true); // Visar laddningsstatus

  // Hämta en slumpmässig katt med en känd ras från The Cat API
  // Inspirerad av The Cat API-exempel: Användning av "images/search" för att hämta bilder
  const fetchRandomCat = () => {
    setLoading(true);

    // Inspirerad av The Cat API-exempel: Användning av fetch med API-nyckel i headers
    fetch(`${API_URL}images/search?include_breeds=true&limit=1`, {
      headers: { "x-api-key": API_KEY },
    })
      .then((response) => response.json()) // Inspirerad av The Cat API-exempel: Omvandling av svar till JSON
      .then((data) => {
        const cat = data[0];

        // Om katten saknar en känd ras, hämta en ny istället
        if (!cat.breeds || cat.breeds.length === 0) {
          fetchRandomCat(); // Hämtar ny bild om rasinformation saknas
          return;
        }

        // Spara rasdata och bild-URL från The Cat API
        setCurrentImage(cat);
        setBreedName(cat.breeds[0].name); // Använder rasnamn från API-svaret
        setLoading(false);
      })
      .catch((error) => console.error("Fel vid hämtning av kattbild:", error)); // Inspirerad av The Cat API-exempel: Felhantering med console.log
  };

  // Röstningsfunktion som skickar data till The Cat API
  // Inspirerad av The Cat API-exempel: Användning av POST-metoden för att skicka röstdata
  const voteForCat = (value) => {
    if (!currentImage || !breedName) return;

    // Inspirerad av The Cat API-exempel: Skicka röstdata via fetch
    fetch(`${API_URL}votes`, {
      method: "POST", // POST används för att skicka röstdata
      headers: {
        "Content-Type": "application/json", // Anger att innehållet är JSON
        "x-api-key": API_KEY, // API-nyckel behövs för autentisering
      },
      body: JSON.stringify({
        image_id: currentImage.id, // Bild-ID från API-svaret
        sub_id: breedName, // Rasnamn som sub_id för att koppla röstning
        value, // Värdet kan vara 1 (gilla) eller -1 (ogilla)
      }),
    })
      .then((response) => response.json()) // Inspirerad av The Cat API-exempel: Omvandling av svar till JSON
      .then((data) => {
        if (data.message === "SUCCESS") {
          console.log(`Rösten registrerad för ${breedName}! 🚀`); // Bekräftar lyckad röstning
          fetchRandomCat(); // 🔹 Laddar en ny katt efter röstning
        } else {
          console.error("Fel vid röstning:", data); // Felhantering vid röstning
        }
      })
      .catch((error) => console.error("Fel vid röstning:", error)); // Inspirerad av The Cat API-exempel: Felhantering
  };

  // Hämta första katten vid sidladdning
  useEffect(() => {
    fetchRandomCat(); // Laddar första katten vid sidstart
  }, []);

  return (
    <div className="vote-container">
      <h2>Rösta på katter</h2>
      {loading ? (
        <p>Laddar katt...</p> // Visar meddelande under laddning
      ) : currentImage ? (
        <div className="vote-section">
          <h3>{breedName}</h3> {/* 🔹 Visar rasens namn */}
          {/* Bild hämtad från The Cat API */}
          <img src={currentImage.url} alt={breedName} className="vote-image" />
          <div className="vote-buttons">
            {/* Knapp för gilla-röstning */}
            <button onClick={() => voteForCat(1)}>👍 Gilla</button>
            {/* Knapp för ogilla-röstning */}
            <button onClick={() => voteForCat(-1)}>👎 Ogilla</button>
          </div>
        </div>
      ) : (
        <p>Ingen katt hittades, försök igen!</p> // Felmeddelande om ingen bild finns
      )}
    </div>
  );
};

export default Vote;
