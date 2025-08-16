import React from 'react';
import { Link } from 'react-router-dom';
import './CardCategory.css';

const CardCategory = ({ title, image, link }) => {
  return (
    <Link to={link} className="card-category">
      <div
        className="card-image"
        style={{ backgroundImage: `url(${image})` }}
        aria-label={title}
      />
      <h3>{title}</h3>
    </Link>
  );
};

export default CardCategory;