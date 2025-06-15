import React from 'react'
import './EventLog.scss'

function EventLog({ log, className = '' }) {
  return (
    <div className={`event-log${className ? ` ${className}` : ''}`}>
      {log.map((entry, idx) => (
        <div key={idx} className="log-entry">
          {entry}
        </div>
      ))}
    </div>
  )
}

export default EventLog
