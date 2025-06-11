import React from 'react';
import './ItemCard.scss';

function ItemCard({ item }) {
  const typeIcons = {
    melee: '/fist.png',
    magic: '/lightning.png',
    range: '/arrows.png',
  };
  const typeIcon = typeIcons[item.attackType || 'melee'];
  return (
    <div className="item-card">
      <div className="item-name">{item.name}</div>
      <img className="item-image" src={item.image} alt={item.name} />
      <div className="item-stats">
        <div className="attack-value">
          <img src="/add-icon.png" alt="attack" className="plus-icon" />
          <span>{item.attack}</span>
        </div>
      </div>
      <div className="weapon-type">
        <img src={typeIcon} alt={item.attackType || 'melee'} />
      </div>
    </div>
  );
}

export default ItemCard;