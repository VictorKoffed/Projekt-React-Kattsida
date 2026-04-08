import React, { useState, useEffect } from "react";
import "../css/Search.css";

const Search = () => {
  const url = "https://api.thecatapi.com/v1/breeds"; // API-endpoint för att hämta kattraser
  const api_key =
    "live_6gao4LLmzRWzxYNHgpr3wVztfGwgIWBDwCVYTi95yBmnpg3aMxezSH8E80LvM8hP";

  // React State för att lagra raser och vald ras
  const [breeds, setBreeds] = useState([]); // Lagrar alla kattraser
  const [selectedBreed, setSelectedBreed] = useState(null); // Lagrar vald ras

  // Hämta kattraser från API:t (Inspirerat från The Cat API:s exempel) https://developers.thecatapi.com/view-account/ylX4blBYT9FaoVd6OhvR?report=s7StySvTw
  useEffect(() => {
    fetch(url, {
      headers: { "x-api-key": api_key }, // The Cat API kräver en API-nyckel i headers
    })
      .then((response) => response.json()) // Konverterar svaret till JSON
      .then((data) => {
        // Filtrerar endast raser som har en bild (Denna logik är tagen från The Cat API:s exempel)
        const filteredBreeds = data.filter((breed) => breed.image?.url);
        setBreeds(filteredBreeds); // Sparar de filtrerade raserna i state
      })
      .catch((error) => console.error("Fel vid hämtning av raser:", error)); // Hanterar eventuella fel
  }, []);

  // Uppdatera vald ras när användaren väljer en från dropdown
  const handleBreedChange = (event) => {
    const breedIndex = event.target.value;
    setSelectedBreed(breeds[breedIndex] || null);
  };

  return (
    <div className="search-container">
      <h2>Sök efter kattraser</h2>

      {/* Dropdown-meny för att välja ras */}
      <select onChange={handleBreedChange} className="breed-selector">
        <option value="">Välj en ras</option> {/* Förvald tom option */}
        {breeds.map((breed, index) => (
          <option key={breed.id} value={index}>
            {breed.name}
          </option>
        ))}
      </select>

      {/* Visar information om den valda kattrasen */}
      {selectedBreed && (
        <div className="breed-info">
          <h3>{selectedBreed.name}</h3>
          <p>{selectedBreed.temperament}</p>

          {/* Länk till Wikipedia */}
          {selectedBreed.wikipedia_url && (
            <a
              href={selectedBreed.wikipedia_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Läs mer på Wikipedia
            </a>
          )}

          {/* Visar rasens bild */}
          <img
            src={selectedBreed.image.url}
            alt={selectedBreed.name}
            className="breed-image"
          />
        </div>
      )}
    </div>
  );
};

export default Search;
