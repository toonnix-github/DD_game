import './App.css'

function App() {
  const rows = Array.from({ length: 7 }, (_, r) =>
    Array.from({ length: 7 }, (_, c) => `${r},${c}`)
  )

  return (
    <>
      <h1>Dungeon Board</h1>
      <div className="board">
        {rows.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <div key={`${rIdx}-${cIdx}`} className="tile">
              {cell}
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default App
