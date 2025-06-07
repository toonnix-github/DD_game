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
      <h2>Hero Attributes</h2>
      <canvas
        width="100"
        height="100"
        ref={c => drawHeroPicture(c)}
        style={{ display: 'block', margin: '0 auto 10px' }}
      />
      <p>Icon: {hero.icon}</p>
      <p>Position: ({hero.row}, {hero.col})</p>
      <p>Movement: {hero.movement}</p>
      <p>HP: {hero.hp}</p>
      <p>AP: {hero.ap}</p>
      <p>Attack: {hero.attack}</p>
      <p>Defence: {hero.defence}</p>
    </div>
  )
}

export default HeroPanel
