import React, { useEffect, useRef, useState } from 'react';
import './HeroPanel.scss';

function renderDice(count, alt) {
  return Array.from({ length: count }, (_, i) => (
    <img key={i} src="/dice.png" alt={alt} />
  ));
}

function renderSkillDesc(desc) {
  const apPattern = /^(\d+)\s*AP:?\s*(.*)/i;
  const match = desc.match(apPattern);
  if (match) {
    const count = parseInt(match[1], 10);
    const rest = match[2];
    return (
      <>
        <span className="ap-icons">
          {Array.from({ length: count }, (_, i) => (
            <img key={i} src="/flash.png" alt="ap" className="inline-ap" />
          ))}
        </span>
        {rest}
      </>
    );
  }
  return desc;
}

function HeroPanel({ hero, damaged, hpDamage = null, shieldBroken = false }) {
  const [movePulse, setMovePulse] = useState(false);
  const prevMoveRef = useRef(hero?.movement ?? 0);
  const [apPulse, setApPulse] = useState(false);
  const prevApRef = useRef(hero?.ap ?? 0);
  const [actionPulse, setActionPulse] = useState(false);
  const prevActionRef = useRef(hero?.heroAction ?? 0);

  useEffect(() => {
    if (hero && prevMoveRef.current !== hero.movement) {
      setMovePulse(true);
      const t = setTimeout(() => setMovePulse(false), 300);
      prevMoveRef.current = hero.movement;
      return () => clearTimeout(t);
    }
  }, [hero]);

  useEffect(() => {
    if (hero && prevApRef.current !== hero.ap) {
      setApPulse(true);
      const t = setTimeout(() => setApPulse(false), 300);
      prevApRef.current = hero.ap;
      return () => clearTimeout(t);
    }
  }, [hero]);

  useEffect(() => {
    if (hero && prevActionRef.current !== hero.heroAction) {
      setActionPulse(true);
      const t = setTimeout(() => setActionPulse(false), 300);
      prevActionRef.current = hero.heroAction;
      return () => clearTimeout(t);
    }
  }, [hero]);

  if (!hero) return null;

  return (
    <div className={`hero-panel${damaged ? ' shake' : ''}`}>
      <div className="name-bar">
        <span className="hero-name">{hero.name}</span>
        {hero.title && <span className="hero-title"> - {hero.title}</span>}
      </div>
      <img className="card-image" src={hero.image} alt={hero.name} />
      <div className={`movement-display${movePulse ? ' change' : ''}`}>
        <img className="foot-icon" src="/icon/footprint.png" alt="movement" />
        <img className="cross-icon" src="/icon/cross.png" alt="x" />
        <span className="move-count">{hero.movement}</span>
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
        {hpDamage != null && <span className="hp-damage">-{hpDamage}</span>}
      </div>
      <div className={`hero-action-badge${actionPulse ? ' change' : ''}`}>
        <img
          src={
            hero.heroAction > 0
              ? '/icon/hero-action.png'
              : '/icon/hero-action-used.png'
          }
          alt="hero action"
        />
      </div>
      {(hero.defence > 0 || shieldBroken) && (
        <div className={`defence-badge${shieldBroken ? ' broken' : ''}`}>
          {hero.defence > 0 && (
            <>
              <img src="/shield.png" alt="defence" />
              <span>{hero.defence}</span>
            </>
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
      <div className={`ap-flashes${apPulse ? ' change' : ''}`}>
        {Array.from({ length: hero.maxAp }, (_, i) => (
          <img
            key={i}
            src="/flash.png"
            className={i < hero.ap ? undefined : 'used'}
            alt="ap"
          />
        ))}
      </div>
      <div className="description">
        {typeof hero.skill === 'object' && (
          <div className="skill-line">
            <span className="skill-title">{hero.skill.title}</span>
            {hero.skill.description && (
              <span className="skill-desc">
                {renderSkillDesc(hero.skill.description)}
              </span>
            )}
          </div>
        )}
        {hero.skill2 && (
          <div className="skill-line">
            <span className="skill-title">{hero.skill2.title}</span>
            {hero.skill2.description && (
              <span className="skill-desc">
                {renderSkillDesc(hero.skill2.description)}
              </span>
            )}
          </div>
        )}
        {hero.quote && <p className="quote">~~~ {hero.quote} ~~~</p>}
      </div>
    </div>
  );
}

export default HeroPanel;
