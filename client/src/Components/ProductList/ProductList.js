import React from "react";
import ProductCard from "../ProductCard/ProductCard";
import { Container } from "react-bootstrap";

const ProductList = ({ products }) => {
  return (
    <Container className="d-flex flex-wrap gap-3 justify-content-start">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </Container>
  );
};

export default ProductList;
