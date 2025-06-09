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
      <div className="movement-icons">
        {Array.from({ length: hero.movement }, (_, i) => (
          <img key={i} src="/icon/footprint.png" alt="movement" />
        ))}
      </div>
      <div className="stats-bar">
        <span className="stat"><img src="/fist.png" alt="strength" />{renderDice(hero.strengthDice, 'strength die')}·</span>
        <span className="stat"><img src="/arrows.png" alt="agility" />{renderDice(hero.agilityDice, 'agility die')}·</span>
        <span className="stat"><img src="/lightning.png" alt="magic" />{renderDice(hero.magicDice, 'magic die')}</span>
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
