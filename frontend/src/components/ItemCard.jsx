import React from 'react'
import './ItemCard.css'

function renderIcons(count, icon, alt) {
  return Array.from({ length: count }, (_, i) => (
    <img key={i} src={icon} alt={alt} className="stat-icon" />
  ))
}

function ItemCard({ item }) {
  return (
    <div className="item-card">
      <img className="item-image" src={item.image} alt={item.name} width="40" height="40" />
      <div className="item-name">{item.name}</div>
      <div className="item-stats">
        <div className="attack-icons">{renderIcons(item.attack, '/fist.svg', 'attack')}</div>
        <div className="defence-icons">{renderIcons(item.defence, '/shield.svg', 'defence')}</div>
        <span>{item.dice}</span>
      </div>
    </div>
  )
}

export default ItemCard
