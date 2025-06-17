import React, { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import './GoblinToken.scss'
import GoblinCard from './GoblinCard'

function GoblinToken({ goblin }) {
  const [hover, setHover] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const tokenRef = useRef(null)
  const overlayRef = useRef(null)

  const showCard = () => {
    const rect = tokenRef.current.getBoundingClientRect()
    setPos({ top: rect.top + window.scrollY, left: rect.right + 8 + window.scrollX })
    setHover(true)
  }

  const hideCard = e => {
    if (overlayRef.current && overlayRef.current.contains(e.relatedTarget)) return
    setHover(false)
  }

  const hideFromOverlay = e => {
    if (tokenRef.current && tokenRef.current.contains(e.relatedTarget)) return
    setHover(false)
  }

  return (
    <>
      <div
      className="goblin-token"
      ref={tokenRef}
      onMouseEnter={showCard}
      onMouseLeave={hideCard}
    >
      <img className="token-image" src={goblin.image} alt={goblin.name} />
      <div className="hp-hearts">
        {Array.from({ length: goblin.hp }, (_, i) => (
          <img key={i} src="/heart.png" alt="hp" />
        ))}
      </div>
      {goblin.defence > 0 && (
        <div className="defence-badge">
          <img src="/shield.png" alt="defence" />
          <span>{goblin.defence}</span>
        </div>
      )}
      </div>
      {hover &&
        createPortal(
          <div
            className="hover-card-overlay"
            ref={overlayRef}
            onMouseLeave={hideFromOverlay}
            onMouseEnter={() => setHover(true)}
            style={{ top: pos.top, left: pos.left }}
          >
            <GoblinCard goblin={goblin} />
          </div>,
          document.body
        )}
    </>
  )
}

export default GoblinToken
