import React from 'react'
import './HeroPanel.css'

function drawHeroPicture(canvas) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#222'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = '#f0c060'
  ctx.beginPath()
  ctx.arc(50, 30, 20, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#c04040'
  ctx.fillRect(35, 60, 30, 30)
}

function HeroPanel({ hero }) {
  return (
    <div className="hero-panel">
      <h2>Hero</h2>
      <canvas
        width="100"
        height="100"
        ref={c => drawHeroPicture(c)}
        style={{ display: 'block', margin: '0 auto 8px' }}
      />
      <div className="stats">
        <div className="label">Icon</div>
        <div>{hero.icon}</div>
        <div className="label">Move</div>
        <div>{hero.movement}</div>
        <div className="label">HP</div>
        <div>{hero.hp}</div>
        <div className="label">AP</div>
        <div>{hero.ap}</div>
        <div className="label">Atk</div>
        <div>{hero.attack}</div>
        <div className="label">Def</div>
        <div>{hero.defence}</div>
      </div>
    </div>
  )
}

export default HeroPanel
