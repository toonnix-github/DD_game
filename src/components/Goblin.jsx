import React from 'react';
import './Goblin.scss';

function Goblin({ goblin, damaged }) {
  return (
    <div className={`goblin${damaged ? ' shake' : ''}`}>
      <img src='/icon/icon-goblin.png' alt={goblin.name} />
    </div>
  );
}

export default Goblin;
