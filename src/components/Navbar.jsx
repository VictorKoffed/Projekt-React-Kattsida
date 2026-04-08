import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/Navbar.css";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  // Navbar som jag kallar in som komponent på varje sida
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="logo">
          <img src="/Logo.JPG" alt="Kattsidan Logotyp" className="logo-img" />
          <span className="logo-text">Kattsidan</span>
        </h1>

        <ul className="nav-links">
          <li>
            <Link to="/" className={isActive("/") ? "active" : ""}>
              Hem
            </Link>
          </li>
          <li>
            <Link to="/search" className={isActive("/search") ? "active" : ""}>
              Sök kattraser
            </Link>
          </li>
          <li>
            <Link to="/vote" className={isActive("/vote") ? "active" : ""}>
              Rösta!
            </Link>
          </li>
          <li>
            <Link
              to="/toplist"
              className={isActive("/toplist") ? "active" : ""}
            >
              Topplista
            </Link>
          </li>
          <li>
            <Link
              to="/gallery"
              className={isActive("/gallery") ? "active" : ""}
            >
              Galleri
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className={isActive("/products") ? "active" : ""}
            >
              Produkter
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
