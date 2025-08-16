import React from "react";
import ProductCard from "../ProductCard/ProductCard";
import { Container } from "react-bootstrap";

const ProductList = ({ products, onAddToCart }) => {
  return (
    <Container className="d-flex flex-wrap gap-3 justify-content-start">
      {products.map((p, i) => (
        <ProductCard key={i} product={p} onAddToCart={onAddToCart} />
      ))}
    </Container>
  );
};

export default ProductList;
