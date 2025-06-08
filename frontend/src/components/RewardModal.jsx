import React from 'react'
import ItemCard from './ItemCard'
import './EncounterModal.css'

function RewardModal({ item, onConfirm }) {
  return (
    <div className="encounter-overlay">
      <div className="encounter-window">
        <h2>New Treasure</h2>
        <ItemCard item={item} />
        <div className="buttons">
          <button onClick={onConfirm}>OK</button>
        </div>
      </div>
    </div>
  )
}

export default RewardModal
