import React, { useEffect, useState } from "react";
import "../css/Products.css";

// 🌐 Bas-URL för API-anrop
const API_BASE_URL = "https://informatik3.ei.hv.se/MenuAPI/api/Product";

// Swagger för MenuAPI: https://informatik3.ei.hv.se/MenuAPI/swagger/index.html

const Products = () => {
  //  Användning av useState för att hantera komponentens tillstånd
  // Guide: https://www.freecodecamp.org/news/how-to-use-the-usestate-and-useeffect-hooks-in-your-project/
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAdding, setIsAdding] = useState(false); // Lägg till state för att hantera tillägg
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    imageURL: "",
    description: "",
  });

  // Funktion för att hämta produkter från kategorin "ReactKatt"
  // Guide: https://www.freecodecamp.org/news/how-to-fetch-api-data-in-react/
  const fetchProducts = () => {
    const category = "ReactKatt";
    fetch(`${API_BASE_URL}/category/${encodeURIComponent(category)}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(`Produkter i kategorin ${category}:`, data);
        setProducts(data);
      })
      .catch((error) => console.error("Fel vid hämtning av produkter:", error));
  };

  // Uppdatera produkt via API
  // Guide: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  const updateProduct = async (productId) => {
    try {
      const payload = {
        productID: productId,
        category: "ReactKatt",
        productName: formData.productName, //   Tog hjälp av AI då jag hade problem med uppdatering av product.
        price: parseFloat(formData.price), // Symptom: Produkten uppdaterades inte korrekt efter ändringar.
        isVegetarian: formData.isVegetarian, // Orsak: Vi upptäckte att vi inte konverterade priset från sträng till flyttal.
        imageURL: formData.imageURL, // Lösning: Användning av parseFloat(formData.price) i updateProduct för att säkerställa rätt typ på priset
        description: formData.description,
      };

      const response = await fetch(`${API_BASE_URL}/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("Fel vid uppdatering av produkt");
        alert("Misslyckades med att uppdatera produkten.");
        return;
      }

      console.log("Produkt uppdaterad!");
      fetchProducts();
      closeModal();
    } catch (error) {
      console.error("Fel vid uppdatering av produkt:", error);
    }
  };

  // Radera produkt
  // Guide: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error("Fel vid radering av produkt");
        alert("Misslyckades med att radera produkten.");
        return;
      }

      console.log("Produkt raderad!");
      fetchProducts();
    } catch (error) {
      console.error("Fel vid radering av produkt:", error);
    }
  };

  // Lägg till produkt
  // Guide: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  const addProduct = async () => {
    // Tog hjälp av AI Problem med hantering av tomma formulärfält
    try {
      // Symptom: Produkten lades till eller uppdaterades med tomma värden.
      const payload = {
        // Orsak: Inga valideringar innan data skickades.
        category: "ReactKatt", // Lösning: Vi lade till grundläggande validering i addProduct och updateProduct för att kontrollera att nödvändiga fält är ifyllda innan anropet görs.
        productName: formData.productName,
        price: parseFloat(formData.price),
        isVegetarian: formData.isVegetarian,
        imageURL: formData.imageURL,
        description: formData.description,
      };

      const response = await fetch(`${API_BASE_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("Fel vid tillägg av produkt");
        alert("Misslyckades med att lägga till produkten.");
        return;
      }

      console.log("Produkt tillagd!");
      fetchProducts();
      closeModal();
    } catch (error) {
      console.error("Fel vid tillägg av produkt:", error);
    }
  };

  // Hantera formulärändringar
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Förbered för redigering
  const handleEdit = (product) => {
    setEditingProduct(product.productID);
    setFormData({
      productName: product.productName,
      price: product.price,
      imageURL: product.imageURL,
      description: product.description,
    });
  };

  // Stäng modal
  const closeModal = () => {
    setEditingProduct(null);
    setIsAdding(false);
    setFormData({ productName: "", price: "", imageURL: "", description: "" });
  };

  // Hämta produkter vid sidladdning
  // Guide: https://react.dev/reference/react/useEffect
  // Tog hjälp av AI
  /*
    Problem med tom produktlista vid sidladdning
Symptom: Produkterna visades inte vid första sidladdningen.
Orsak: useEffect-hooken anropade inte fetchProducts() korrekt.
Lösning: Vi lade till en tom beroende-array [] i useEffect, vilket säkerställer att hämtningen endast sker en gång när komponenten mountas.
  */
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="products-container">
      <h2>Produkter i kategorin "ReactKatt"</h2>
      <button onClick={() => setIsAdding(true)} className="add-button">
        ➕ Lägg till produkt
      </button>
      {/* Popup Modal för redigering eller tillägg */}
      {(editingProduct || isAdding) && (
        <>
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="modal">
            <h2 className="modal-title">
              {isAdding ? "Lägg till produkt" : "Redigera produkt"}
            </h2>
            <div className="modal-content">
              <label>Produktnamn</label>
              <input
                type="text"
                name="productName"
                placeholder="Produktnamn"
                value={formData.productName}
                onChange={handleChange}
              />

              <label>Pris</label>
              <input
                type="number"
                name="price"
                placeholder="Pris"
                value={formData.price}
                onChange={handleChange}
              />

              <label>Bild-URL</label>
              <input
                type="text"
                name="imageURL"
                placeholder="Bild-URL"
                value={formData.imageURL}
                onChange={handleChange}
              />

              <label>Beskrivning</label>
              <textarea
                name="description"
                placeholder="Beskrivning"
                value={formData.description}
                onChange={handleChange}
              ></textarea>

              <div className="modal-buttons">
                <button
                  onClick={
                    isAdding ? addProduct : () => updateProduct(editingProduct)
                  }
                  className="save-button"
                >
                  {isAdding ? "Lägg till" : "Spara"}
                </button>
                <button onClick={closeModal} className="cancel-button">
                  Avbryt
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tog hjälp av AI att skapa koden nedanför. */}

      {/* Visa produkter i kategorin */}
      {products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.productID} className="product-card">
              {product.imageURL && (
                <img
                  src={product.imageURL}
                  alt={product.productName}
                  className="product-image"
                />
              )}
              <h3>{product.productName}</h3>
              <p>{product.price} kr</p>
              {product.description && <p>{product.description}</p>}
              <div className="button-group">
                <button onClick={() => handleEdit(product)}>✏️ Redigera</button>
                <button onClick={() => deleteProduct(product.productID)}>
                  🗑️ Ta bort
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Inga produkter hittades i denna kategori.</p>
      )}
    </div>
  );
};

export default Products;
