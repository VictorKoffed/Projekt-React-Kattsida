import React, { useState, useEffect } from "react";
import "../css/Gallery.css";

const Gallery = () => {
  // URL från The Cat API för att hämta 10 slumpmässiga kattbilder
  // Ingen API-nyckel behövs då gränsen är 10 bilder
  // Tagit inspiration ifrån The Cat API https://developers.thecatapi.com/view-account/ylX4blBYT9FaoVd6OhvR?report=s7StySvTw
  const url = "https://api.thecatapi.com/v1/images/search?limit=10";
  const [images, setImages] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); // För att tvinga omrendering

  // Funktion för att hämta fler kattbilder från API:t
  const fetchImages = () => {
    // Anrop till The Cat API med fetch-funktion
    fetch(url)
      .then((response) => response.json()) // Omvandlar API-svaret till JSON
      .then((data) => {
        setImages(data); // Sätter de hämtade bilderna i state
        setRefreshKey((prev) => prev + 1); // Tvingar omrendering genom att uppdatera nyckeln
      })
      .catch((error) => console.error("Fel vid hämtning av bilder:", error)); // Hanterar fel vid API-anropet
  };

  // Använder useEffect för att hämta bilder vid sidladdning
  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="gallery-container" key={refreshKey}>
      {/* För att tvinga omrendering */}
      <h2>Galleri med slumpmässiga kattbilder</h2>
      <div className="gallery-layout">
        {/* Knappcontainer för att ladda fler bilder */}
        <div className="button-container">
          <button className="load-more-btn" onClick={fetchImages}>
            🐱 Ladda fler katter
          </button>
        </div>

        {/* Bildgalleri */}
        <div className="image-grid">
          {images.map((image, index) => (
            <div key={image.id || index} className="grid-cell">
              {/* Bilden laddas från URL som hämtats från The Cat API */}
              <img src={image.url} alt="Random Cat" className="gallery-image" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
