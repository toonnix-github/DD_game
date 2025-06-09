import React from 'react'
import './ItemCard.css'

function renderIcons(count, icon, alt) {
  return Array.from({ length: count }, (_, i) => (
    <img key={i} src={icon} alt={alt} className="stat-icon" />
  ))
}

function ItemCard({ item }) {
  const typeIcons = {
    melee: '/fist.svg',
    magic: '/lightning.png',
    range: '/arrows.png',
  }
  const typeIcon = typeIcons[item.attackType || 'melee']
  return (
    <div className="item-card">
      <div className="item-name">{item.name}</div>
      <img className="item-image" src={item.image} alt={item.name} />
      <div className="item-stats">
        <div className="attack-icons">{renderIcons(item.attack, '/fist.svg', 'attack')}</div>
        <div className="defence-icons">{renderIcons(item.defence, '/shield.svg', 'defence')}</div>
        <span>{item.dice}</span>
      </div>
      <div className="weapon-type">
        <img src={typeIcon} alt={item.attackType || 'melee'} />
      </div>
    </div>
  )
}

export default ItemCard
