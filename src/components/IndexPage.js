import React from 'react';
import TapaCard from './TapaCard';

// Este componente recibe un array de 'tapas' y las renderiza
function IndexPage({ tapas }) {
  if (!tapas || tapas.length === 0) {
    return <p>No hay conjuntos de sliders disponibles en este momento.</p>;
  }

  return (
    <div className="index-page">
      {tapas.map((tapa, index) => (
        <div key={tapa.id} className="tapa-card-wrapper">
          <TapaCard 
            title={tapa.title} 
            description={tapa.description} 
            linkTo={tapa.path} 
          />
        </div>
      ))}
    </div>
  );
}

export default IndexPage;
