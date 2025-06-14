import React from 'react'
import './InfoModal.scss'

function InfoModal({ message, onConfirm }) {
  return (
    <div className="info-overlay">
      <div className="info-box">
        <p>{message}</p>
        <div className="buttons">
          <button onClick={onConfirm}>OK</button>
        </div>
      </div>
    </div>
  )
}

export default InfoModal
