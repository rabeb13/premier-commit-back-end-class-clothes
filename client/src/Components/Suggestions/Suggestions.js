import React from 'react';
import './Suggestions.css';

const Suggestions = ({ products }) => {
  return (
    <div className="suggestions-container">
      <h2 className="suggestions-title">→ CELA PEUT VOUS INTÉRESSER</h2>
      <div className="suggestions-scroll">
        {products.map((item) => (
          <div key={item.id} className="suggestion-card">
            <div className="image-wrapper">
              <img src={item.image} alt={item.name} />
            </div>
            <p className="product-name">{item.name}</p>
            <p className="product-price">{item.price} €</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;
