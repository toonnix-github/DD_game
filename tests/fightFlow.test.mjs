import assert from 'assert';
import {
  computeAttackBreakdown,
  heroAttack,
  computeCounterAttack,
  fightGoblin
} from '../frontend/src/fightUtils.js';

function testComputeAttackBreakdown() {
  const weapon = { attack: 2 };
  const rolls = [5, 1, 2];
  const res = computeAttackBreakdown({}, weapon, rolls, 0, [1, 2], 1);
  assert.deepStrictEqual(res, { total: 11, hero: 1, weapon: 2, base: 5, extra: 3 });
}

function testHeroAttack() {
  const hero = { hp: 10, defence: 1, weapons: [{ name: 'Sword', attack: 2, defence: 0 }] };
  const goblin = { hp: 2, defence: 3 };
  const res = heroAttack(hero, goblin, hero.weapons[0], [5], 0);
  assert.strictEqual(res.goblin.hp, -2);
  assert.strictEqual(res.heroDmg, 4);
  assert.ok(res.brokeShield);
  assert.strictEqual(res.message, 'Hero smashes the shield and deals 4 damage.');
}

function testComputeCounterAttack() {
  const hero = { defence: 2 };
  const weapon = { defence: 1 };
  const goblin = { attack: 3 };
  const res = computeCounterAttack(hero, weapon, goblin, 'shieldBreak', 1);
  assert.strictEqual(res.effect, 'shieldBreak');
  assert.strictEqual(res.damage, 4);
  assert.strictEqual(res.heroDefenceAfter, 0);
  assert.ok(res.brokeShield);
}

function testFightGoblin() {
  const hero = { hp: 10, defence: 2, weapons: [{ name: 'Sword', attack: 3, defence: 1 }] };
  const goblin = { hp: 6, defence: 5, attack: 2 };
  const originalRandom = Math.random;
  Math.random = () => 0; // forces 'torchDown'
  const res = fightGoblin(hero, goblin, hero.weapons[0], [6], 0);
  Math.random = originalRandom;
  assert.strictEqual(res.goblin.hp, 2);
  assert.strictEqual(res.counter.effect, 'torchDown');
  assert.strictEqual(res.message, 'Hero smashes the shield and deals 4 damage.');
  assert.strictEqual(res.hero.hp, 10);
}

function run() {
  testComputeAttackBreakdown();
  testHeroAttack();
  testComputeCounterAttack();
  testFightGoblin();
  console.log('All fight flow tests passed');
}

run();
