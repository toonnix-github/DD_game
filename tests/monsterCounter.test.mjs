import assert from 'assert';
import { chooseMonsterAttack, monsterCounter } from '../src/fightUtils.js';

function testChooseAttackOutOfRange() {
  const goblin = { attacks: [{ type: 'melee', attack: 2 }] };
  assert.strictEqual(chooseMonsterAttack(goblin, 1), null);
}

function testChooseAttackRange() {
  const goblin = { attacks: [ { type: 'melee', attack: 1 }, { type: 'range', attack: 3, range: 3 } ] };
  const atk = chooseMonsterAttack(goblin, 2);
  assert.ok(atk && atk.type === 'range');
}

function testChooseMeleeAtZero() {
  const goblin = { attacks: [ { type: 'melee', attack: 1 }, { type: 'range', attack: 3, range: 3 } ] };
  const atk = chooseMonsterAttack(goblin, 0);
  assert.ok(atk && atk.type === 'melee');
}

function testRangeCantHitAtZero() {
  const goblin = { attacks: [{ type: 'range', attack: 3, range: 3 }] };
  const atk = chooseMonsterAttack(goblin, 0);
  assert.strictEqual(atk, null);
}

function testNoCounterWhenOutOfRange() {
  const hero = { defence: 1 };
  const weapon = { defence: 0 };
  const goblin = { attacks: [{ type: 'melee', attack: 2 }], attack:2, attackType:'melee', hp:1 };
  const res = monsterCounter(hero, weapon, goblin, 2);
  assert.strictEqual(res, null);
}

function run() {
  testChooseAttackOutOfRange();
  testChooseAttackRange();
  testChooseMeleeAtZero();
  testRangeCantHitAtZero();
  testNoCounterWhenOutOfRange();
  console.log('All monster counter tests passed');
}

run();
