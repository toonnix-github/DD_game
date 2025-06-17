function Goblin({ goblin, damaged, style }) {
    <div className={`goblin${damaged ? ' shake' : ''}`} style={style}>

function Goblin({ goblin, damaged }) {
  return (
    <div className={`goblin${damaged ? ' shake' : ''}`}>
      <img src='/icon/icon-goblin.png' alt={goblin.name} />
    </div>
  );
}

export default Goblin;
