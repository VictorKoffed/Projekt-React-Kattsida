import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./css/index.css";
import Home from "./pages/Home";
import Search from "./pages/Search";
import TopList from "./pages/TopList";
import Gallery from "./pages/Gallery";
import Products from "./pages/Products";
import Vote from "./pages/Vote";
// Tog router ifrån lektions tillfällena och omvandla det till mitt projekt.
function App() {
  return (
    <Router>
      <Navbar />
      <div className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/Vote" element={<Vote />} />
          <Route path="/toplist" element={<TopList />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
