import React from 'react'
import './ItemCard.css'

function ItemCard({ item }) {
  return (
    <div className="item-card">
      <img src={item.image} alt={item.name} width="40" height="40" />
      <div className="item-name">{item.name}</div>
      <div className="item-stats">
        <span>A{item.attack}</span>
        <span>D{item.defence}</span>
        <span>{item.dice}</span>
      </div>
    </div>
  )
}

export default ItemCard
