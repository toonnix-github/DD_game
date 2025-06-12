import React, { useEffect, useState } from 'react';
import './GoblinCard.scss';

function GoblinCard({
  goblin,
  damaged,
  defeated,
  shieldDamage,
  shieldBroken,
  hpDamage,
}) {
  const [maxHp, setMaxHp] = useState(goblin.hp);

  useEffect(() => {
    setMaxHp(m => Math.max(m, goblin.hp));
  }, [goblin.hp]);
  const typeIcons = {
    melee: '/fist.png',
    range: '/arrows.png',
    magic: '/lightning.png',
  };
  const attacks = goblin.attacks || [
    { type: goblin.attackType, attack: goblin.attack, range: goblin.range },
  ];
  return (
    <div className={`goblin-card${defeated ? ' shake' : ''}`}>
      <div className="name-bar">{goblin.name}</div>
      <img className={`card-image${defeated ? ' defeated' : ''}`} src={goblin.image} alt={goblin.name} />
      <div className={`hp-hearts${damaged ? ' shake' : ''}`}>
        {Array.from({ length: maxHp }, (_, i) => (
          <img
            key={i}
            src="/heart.png"
            className={i < goblin.hp ? undefined : 'lost'}
            alt="hp"
          />
        ))}
        {hpDamage != null && <span className="hp-damage">-{hpDamage}</span>}
      </div>
      <div className="stats-bar">
        {attacks.map((a, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="sep"></span>}
            <span className="stat">
              <img src={typeIcons[a.type]} alt={a.type} />+{a.attack}
              {a.range ? ` (${a.range} tiles)` : ''}
            </span>
          </React.Fragment>
        ))}
      </div>
      {(goblin.defence > 0 || shieldDamage != null || shieldBroken) && (
        <div
          className={`defence-badge${shieldDamage ? ' shake' : ''}${goblin.defence <= 0 ? ' broken' : ''
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
      )}
      <div className="monster-icon">
        <img src="/icon/icon-goblin.png" alt="goblin" />
      </div>
      {['knife', 'king'].includes(goblin.type) && (
        <div className="description">
          Counterattack bonus equals {goblin.extra || 0} plus the number of other goblins alive.
        </div>
      )}
      {defeated && <img src="/skull.png" alt="defeated" className="death-effect red" />}
    </div>
  );
}

export default GoblinCard;
