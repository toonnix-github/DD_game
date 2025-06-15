import React from 'react'
import './NarrativeBox.scss'

function NarrativeBox({ messages }) {
  if (!messages || messages.length === 0) return null
  return (
    <div className="narrative-box">
      {messages.map((m, idx) => (
        <p key={idx}>{m}</p>
      ))}
    </div>
  )
}

export default NarrativeBox
