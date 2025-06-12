import React from 'react'
import './EncounterModal.scss'

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="encounter-overlay">
      <div className="encounter-window">
        <p>{message}</p>
        <div className="buttons">
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
