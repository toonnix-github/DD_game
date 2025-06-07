import React from 'react'
import './EncounterModal.css'

function EncounterModal({ goblin, onFight, onFlee }) {
  return (
    <div className="encounter-overlay">
      <div className="encounter-window">
        <h2>{goblin.name}</h2>
        <img src={goblin.image} alt={goblin.name} width="100" height="100" />
        <div className="stats">
          <div className="label">HP</div>
          <div>{goblin.hp}</div>
          <div className="label">Atk</div>
          <div>{goblin.attack}</div>
          <div className="label">Def</div>
          <div>{goblin.defence}</div>
        </div>
        <div className="buttons">
          <button onClick={onFight}>Fight</button>
          <button onClick={onFlee}>Flee</button>
        </div>
      </div>
    </div>
  )
}

export default EncounterModal
