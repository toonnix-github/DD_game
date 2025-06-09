import React from 'react';
import './ItemCard.css';

function renderIcons(count, icon, alt) {
  return Array.from({ length: count }, (_, i) => (
    <img key={i} src={icon} alt={alt} className="stat-icon" />
  ));
}

function ItemCard({ item }) {
  const typeIcons = {
    melee: '/fist.svg',
    magic: '/lightning.png',
    range: '/arrows.png',
  };
  const typeIcon = typeIcons[item.attackType || 'melee'];
  return (
    <div className="item-card">
      <img className="item-image" src={item.image} alt={item.name} width="40" height="40" />
      <div className="item-name">{item.name}</div>
      <img className="item-image" src={item.image} alt={item.name} />
      <div className="item-stats">
        <div className="attack-icons">{renderIcons(item.attack, '/fist.svg', 'attack')}</div>
        <div className="attack-value">
          <img src="/add-icon.png" alt="attack" className="plus-icon" />
          <span>{item.attack}</span>
        </div>
        <div className="defence-icons">{renderIcons(item.defence, '/shield.svg', 'defence')}</div>
        <span>{item.dice}</span>
      </div>
      <div className="weapon-type">
        <img src={typeIcon} alt={item.attackType || 'melee'} />
      </div>
    </div>
  );
}

export default ItemCard;