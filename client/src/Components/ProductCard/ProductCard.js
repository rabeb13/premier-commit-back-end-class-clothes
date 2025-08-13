import React, { useState } from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');

  const handleClick = () => {
    // ⚠️ on envoie UNIQUEMENT les options, pas tout l'objet produit
    onAddToCart?.({ color: selectedColor, size: selectedSize });
  };

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, maxWidth: 300, margin: 10 }}>
      <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: 8 }} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>

      {product.colors?.length > 0 && (
        <div>
          <strong>Couleurs :</strong>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            {product.colors.map((color) => (
              <div
                key={color}
                onClick={() => setSelectedColor(color)}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: color,
                  border: selectedColor === color ? '2px solid black' : '1px solid #ccc',
                  cursor: 'pointer',
                }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {product.sizes?.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <strong>Tailles :</strong>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            {product.sizes.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      )}

      <button
        style={{
          marginTop: 16, padding: '10px 20px', backgroundColor: '#007bff', color: 'white',
          border: 'none', borderRadius: 4, cursor: 'pointer',
          opacity: selectedColor && selectedSize ? 1 : 0.6
        }}
        disabled={!selectedColor || !selectedSize}
        onClick={handleClick}
      >
        Ajouter au panier
      </button>
    </div>
  );
};

export default ProductCard;
