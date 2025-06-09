import React from 'react';
import './HeroPanel.css';

function renderDice(count, alt) {
  return Array.from({ length: count }, (_, i) => (
    <img key={i} src="/dice-red.png" alt={alt} />
  ));
}

function HeroPanel({ hero, damaged }) {
  if (!hero) return null;

  return (
    <div className={`hero-panel${damaged ? ' shake' : ''}`}>
      <div className="name-bar">{hero.name}</div>
      <img className="card-image" src={hero.image} alt={hero.name} />
      <div className="stats-bar">
        <div className="stat">
          <img src="/boot.png" alt="move" />{hero.movement}
        </div>
        <div className="stat">
          <img src="/icon/starburst.png" alt="ap" />{hero.ap}
        </div>
        <div className="stat">
          <img src="/fist.png" alt="strength" />{hero.attack}
        </div>
        <div className="stat">
          <img src="/speed.png" alt="agility" />{hero.agility}
        </div>
        <div className="stat"><img src="/fist.png" alt="agility" />{renderDice(hero.strengthDice, 'strength die')}</div>
        <div className="stat">{renderDice(hero.agilityDice, 'agility die')}</div>
        <div className="stat">{renderDice(hero.magicDice, 'magic die')}</div>
      </div>
      <div className="hp-hearts">
        {Array.from({ length: hero.maxHp }, (_, i) => (
          <img
            key={i}
            src="/heart.png"
            className={i < hero.hp ? undefined : 'lost'}
            alt="hp"
          />
        ))}
      </div>
      <div className="defence-badge">
        <img src="/shield.png" alt="defence" />
        <span>{hero.defence}</span>
      </div>
      <div className="description">{hero.skill}</div>
    </div>
  );
}

export default HeroPanel;
