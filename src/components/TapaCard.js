import React from 'react';
import { Link } from 'react-router-dom';

// Componente para cada 'tapa' o tarjeta en la página de índice
function TapaCard({ title, description, linkTo }) {
  return (
    <Link to={linkTo} className="tapa-card-link">
      <article className="tapa-card">
        <h2>{title}</h2>
        <p>{description}</p>
        {/* The 'Ver Sliders' button/link is now removed */}
      </article>
    </Link>
  );
}

export default TapaCard;
