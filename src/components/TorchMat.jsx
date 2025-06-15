import React from 'react'
import './TorchMat.scss'

function TorchMat({ step, max = 20 }) {
  const cells = Array.from({ length: max + 1 }, (_, i) => (
    <div
      key={i}
      className={`torch-cell${i === step ? ' current' : i < step ? ' spent' : ''}`}
    >
      {i === step && <img src="/icon/torch.svg" alt="torch" />}
    </div>
  ))
  return <div className="torch-mat">{cells}</div>
}

export default TorchMat
