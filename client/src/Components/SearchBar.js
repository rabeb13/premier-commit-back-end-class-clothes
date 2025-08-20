// src/Components/SearchBar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import "./SearchBar.css";

const SearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // Liste de toutes les catégories/pages
  const categories = ["tshirts", "jeans", "dresses", "accessories"];

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Filtrer les catégories/pages en fonction de la saisie
    const filtered = categories.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );
    setResults(filtered);
  };

  const handleSelect = (item) => {
    navigate(`/category/${item}`); // redirige vers la page de la catégorie
    setQuery(""); // vider l'input
    setResults([]); // cacher les résultats
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Rechercher..."
        value={query}
        onChange={handleChange}
      />
      {results.length > 0 && (
        <div className="search-results">
          {results.map((item, index) => (
            <div
              key={index}
              className="result-item"
              onClick={() => handleSelect(item)}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
