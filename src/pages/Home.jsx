import React from "react";
import "../css/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Header */}
      <header className="hero-header">
        <h1>Välkommen till Kattsidan! 🐱</h1>
        <p>
          Din plats för att utforska, rösta på och lära dig mer om olika
          kattraser.
        </p>
        <a href="/search" className="cta-button">
          Utforska katter
        </a>
      </header>

      {/* Kort förklaring av hemsidan */}
      <section className="info-section">
        <h2>Vad kan du göra här?</h2>
        <p>
          På Kattsidan kan du söka efter kattraser, rösta på dina favoriter,
          utforska topplistor, bläddra i ett kattgalleri och hitta
          kattprodukter. Vi använder The Cat API för att ge dig den bästa
          kattupplevelsen! 😻 För produktinformationen har vi även skapat ett
          eget, men något enklare, API.
        </p>
      </section>
    </div>
  );
};

export default Home;
