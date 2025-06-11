import React from 'react'
import './EventLog.scss'

function EventLog({ log }) {
  return (
    <div className="event-log">
      {log.map((entry, idx) => (
        <div key={idx} className="log-entry">
          {entry}
        </div>
      ))}
    </div>
  )
}

export default EventLog
