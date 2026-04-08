import React, { useState, useEffect } from "react";
import "../css/TopList.css";

// API URL och nyckel från The Cat API
const API_URL = "https://api.thecatapi.com/v1/"; // Grundläggande URL för The Cat API
const API_KEY =
  "live_6gao4LLmzRWzxYNHgpr3wVztfGwgIWBDwCVYTi95yBmnpg3aMxezSH8E80LvM8hP"; // API-nyckel för autentisering

// inspirerat av The Cat API https://developers.thecatapi.com/view-account/ylX4blBYT9FaoVd6OhvR?report=s7StySvTw

const TopList = () => {
  const [topVotes, setTopVotes] = useState([]); // Sparar topplistan
  const [breedsMap, setBreedsMap] = useState({}); // Karta över ras-ID → Namn
  const [loading, setLoading] = useState(true);

  // Hämta alla kattraser från The Cat API
  useEffect(() => {
    // Anropar API:t för att hämta alla kattraser
    fetch(`${API_URL}breeds`, {
      headers: { "x-api-key": API_KEY }, // Skickar API-nyckeln i headers
    })
      .then((res) => res.json()) // Omvandlar API-svaret till JSON-format
      .then((data) => {
        const map = {};
        data.forEach((breed) => {
          // Skapar en karta över raser med deras namn och eventuella bild
          map[breed.name] = { name: breed.name, image: breed.image?.url || "" };
        });
        setBreedsMap(map); // Sparar rasinformationen i state
      })
      .catch((err) => console.error("Fel vid hämtning av raser:", err)); // Felhantering vid API-anrop
  }, []);

  // Hämta röster från The Cat API och räkna ihop poäng per ras (`sub_id`)
  useEffect(() => {
    // Anropar API:t för att hämta de senaste 100 rösterna
    fetch(`${API_URL}votes?limit=100`, {
      headers: { "x-api-key": API_KEY }, // Skickar API-nyckeln i headers
    })
      .then((res) => res.json()) // Omvandlar API-svaret till JSON-format
      .then((data) => {
        const votesByBreed = {};

        data.forEach((vote) => {
          // Kontrollera om rösten har ett sub_id och om det finns i raslistan
          if (!vote.sub_id || !breedsMap[vote.sub_id]) return;
          // Räkna ihop rösterna för respektive ras
          votesByBreed[vote.sub_id] =
            (votesByBreed[vote.sub_id] || 0) + vote.value;
        });

        // Sortera raserna efter antalet röster (fallande ordning) och ta de 10 bästa
        const sortedVotes = Object.entries(votesByBreed)
          .sort(([, a], [, b]) => b - a) // Sortera efter röstpoäng
          .slice(0, 10); // Begränsa till de 10 bästa

        setTopVotes(sortedVotes); // Uppdatera state med sorterad röstlista
        setLoading(false); // Stäng av laddningsindikatorn
      })
      .catch((err) => console.error("Fel vid hämtning av röster:", err)); // Felhantering vid API-anrop
  }, [breedsMap]);

  return (
    <div className="toplist-container">
      <h2>🏆 Top 10 Mest Röstade Kattraser</h2>

      {loading ? (
        <p>Laddar topplistan...</p>
      ) : topVotes.length > 0 ? (
        <ol>
          {topVotes.map(([breedName, score], index) => (
            <li key={breedName} className="toplist-item">
              <span>
                #{index + 1} {breedsMap[breedName]?.name || "Okänd ras"} –{" "}
                {score} röster
              </span>
              {/* Visa rasbild om den finns, hämtad från The Cat API */}
              {breedsMap[breedName]?.image && (
                <img
                  src={breedsMap[breedName]?.image} // Bildens URL hämtad från API:t
                  alt={breedsMap[breedName]?.name} // Alternativtext med rasens namn
                  className="toplist-image"
                />
              )}
            </li>
          ))}
        </ol>
      ) : (
        <p>Ingen röstning har skett ännu. Börja rösta på katter! 🐱</p>
      )}
    </div>
  );
};

export default TopList;
