import React from 'react'
import './TorchMat.scss'
import { TORCH_EVENTS } from '../torch'

function TorchMat({ step }) {
  return (
    <div className="torch-mat">
      {TORCH_EVENTS.map((ev, idx) => (
        <div key={idx} className={`torch-step${idx + 1 === step ? ' active' : ''}`}>
          <span className="num">{idx + 1}</span>
          {ev === 'spawn' && <span className="icon">👹</span>}
          {ev === 'monster' && <span className="icon">⚔️</span>}
          {ev === 'gameover' && <span className="icon">💀</span>}
        </div>
      ))}
    </div>
  )
}

export default TorchMat
