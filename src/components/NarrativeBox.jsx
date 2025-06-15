import React from 'react'
import './NarrativeBox.scss'

function NarrativeBox({ message }) {
  if (!message) return null
  return <div className="narrative-box">{message}</div>
}

export default NarrativeBox
