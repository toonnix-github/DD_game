import React from 'react';
import './GoblinCard.css';

function GoblinCard({ goblin, damaged, defeated, shieldDamage, shieldBroken }) {
  return (
    <div className={`goblin-card${damaged ? ' attack-slide' : ''}`}>
      <div className="name-bar">{goblin.name}</div>
      <img className={`card-image${defeated ? ' defeated' : ''}`} src={goblin.image} alt={goblin.name} />
      {defeated && <img src="/skull.png" alt="defeated" className="death-effect red" />}
      <div className="hp-hearts">
        {Array.from({ length: goblin.hp }, (_, i) => (
          <img key={i} src="/heart.png" alt="hp" />
        ))}
      </div>
      <div className="stats-bar">
        <span className="stat">
          <img src="/fist.png" alt="attack" />{goblin.attack}
        </span>
      </div>
      <div
        className={`defence-badge${shieldDamage ? ' shake' : ''}${
          goblin.defence <= 0 ? ' broken' : ''
        }`}
      >
        {goblin.defence > 0 && (
          <>
            <img src="/shield.png" alt="defence" />
            <span>{goblin.defence}</span>
          </>
        )}
        {shieldDamage != null && (
          <span className="shield-damage">-{shieldDamage}</span>
        )}
        {shieldBroken && (
          <img
            src="/icon/starburst.png"
            alt="shield broken"
            className="shield-break"
          />
        )}
      </div>
      <div className="monster-icon">
        <img src="/icon/icon-goblin.png" alt="goblin" />
      </div>
    </div>
  );
}

export default GoblinCard;
