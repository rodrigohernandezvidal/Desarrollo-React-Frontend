import React from 'react';

const EstadoBadge = ({ estado }) => {
  const colors = {
    pendiente: 'bg-yellow-500',
    aprobada: 'bg-green-500',
    rechazada: 'bg-red-500',
  };

  return (
    <span className={`${colors[estado]} text-white px-3 py-1 rounded-full text-xs`}>
      {estado.toUpperCase()}
    </span>
  );
};

export default EstadoBadge;