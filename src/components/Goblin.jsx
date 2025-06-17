import './Goblin.scss';

function Goblin({ goblin, damaged, style }) {
  return (
    <div className={`goblin${damaged ? ' shake' : ''}`} style={style}>
      <img src='/icon/icon-goblin.png' alt={goblin.name} />
    </div>
  );
}

export default Goblin;