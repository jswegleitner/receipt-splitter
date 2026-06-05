// Money-math guard: the per-person totals must always reconcile to the bill.
// This is the permanent regression test for the partial-claim class of bug.
// Run with: npm test   (Node's built-in runner, no extra deps)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  computeBill,
  getPersonTotal,
  getPersonSubtotal,
  claimedQtyByItem,
  getUnclaimedQuantity,
} from '../src/calc.js';

const EPS = 0.01; // reconcile within one cent (matches the app's dev invariant)

const sumTotals = (s) => s.people.reduce((acc, p) => acc + getPersonTotal(s, p), 0);

function assertReconciles(state, label) {
  const { totalBill } = computeBill(state);
  const sum = sumTotals(state);
  assert.ok(
    Math.abs(sum - totalBill) <= EPS,
    `${label}: Σ person totals ($${sum.toFixed(2)}) != bill ($${totalBill.toFixed(2)})`
  );
}

// Convenient state builder with sensible defaults.
const mk = (over = {}) => ({
  items: [],
  people: [],
  claims: {},
  claimQuantities: {},
  tax: 0,
  tip: 0,
  tipType: 'percent',
  tipBase: 'subtotalPlusTax',
  ...over,
});

test('fully claimed items reconcile (with tax + % tip)', () => {
  const state = mk({
    items: [
      { id: 'a', name: 'Burger', price: 10, qty: 1 },
      { id: 'b', name: 'Salad', price: 20, qty: 1 },
    ],
    people: ['Alice', 'Bob'],
    claims: { Alice: ['a'], Bob: ['b'] },
    claimQuantities: { Alice: { a: 1 }, Bob: { b: 1 } },
    tax: 3,
    tip: 15,
    tipType: 'percent',
  });
  assertReconciles(state, 'full claim');
});

test('the 12-beer partial-claim case totals exactly $60', () => {
  // 12 beers @ $5, 3 people claim 4 / 4 / 3 (1 left over, split among everyone).
  const state = mk({
    items: [{ id: 'beer', name: 'Beer', price: 5, qty: 12 }],
    people: ['A', 'B', 'C'],
    claims: { A: ['beer'], B: ['beer'], C: ['beer'] },
    claimQuantities: { A: { beer: 4 }, B: { beer: 4 }, C: { beer: 3 } },
  });
  assertReconciles(state, '12 beers');
  assert.equal(computeBill(state).totalBill, 60);

  // Intended split: A 21.67, B 21.67, C 16.67.
  assert.ok(Math.abs(getPersonTotal(state, 'A') - 21.6667) < 0.001);
  assert.ok(Math.abs(getPersonTotal(state, 'B') - 21.6667) < 0.001);
  assert.ok(Math.abs(getPersonTotal(state, 'C') - 16.6667) < 0.001);
});

test('shared item (split between two of three people) reconciles', () => {
  const state = mk({
    items: [{ id: 'pizza', name: 'Pizza', price: 15, qty: 2 }],
    people: ['A', 'B', 'C'],
    claims: { A: ['pizza'], B: ['pizza'] },
    claimQuantities: { A: { pizza: 1 }, B: { pizza: 1 } },
    tax: 4,
    tip: 12,
  });
  assertReconciles(state, 'shared');
});

test('unclaimed leftovers split among everyone reconcile', () => {
  // $10 item, qty 3; A claims 1, the other 2 are unclaimed and split A/B.
  const state = mk({
    items: [{ id: 'x', name: 'Nachos', price: 10, qty: 3 }],
    people: ['A', 'B'],
    claims: { A: ['x'] },
    claimQuantities: { A: { x: 1 } },
    tax: 2,
    tip: 10,
    tipType: 'amount',
  });
  assertReconciles(state, 'leftovers');
  assert.equal(getUnclaimedQuantity(state.items, claimedQtyByItem(state.items, state.claims, state.claimQuantities), 'x'), 2);
});

test('nothing claimed: whole bill splits evenly and reconciles', () => {
  const state = mk({
    items: [
      { id: 'a', name: 'A', price: 12.5, qty: 1 },
      { id: 'b', name: 'B', price: 7.5, qty: 2 },
    ],
    people: ['A', 'B', 'C'],
    tax: 2.5,
    tip: 18,
  });
  assertReconciles(state, 'unclaimed all');
});

test('zero tax and zero tip reconciles', () => {
  const state = mk({
    items: [{ id: 'a', name: 'A', price: 9.99, qty: 3 }],
    people: ['A', 'B'],
    claims: { A: ['a'], B: ['a'] },
    claimQuantities: { A: { a: 2 }, B: { a: 1 } },
  });
  assertReconciles(state, 'zero tax/tip');
});

test('tip on subtotal vs subtotal+tax both reconcile', () => {
  const base = {
    items: [{ id: 'a', name: 'A', price: 40, qty: 1 }],
    people: ['A', 'B'],
    claims: { A: ['a'] },
    claimQuantities: { A: { a: 1 } },
    tax: 5,
    tip: 20,
    tipType: 'percent',
  };
  assertReconciles(mk({ ...base, tipBase: 'subtotal' }), 'tip on subtotal');
  assertReconciles(mk({ ...base, tipBase: 'subtotalPlusTax' }), 'tip on subtotal+tax');

  // The tip base actually differs.
  const onSub = computeBill(mk({ ...base, tipBase: 'subtotal' }));
  const onSubTax = computeBill(mk({ ...base, tipBase: 'subtotalPlusTax' }));
  assert.equal(onSub.tipAmount, 8); // 20% of 40
  assert.equal(onSubTax.tipAmount, 9); // 20% of 45
});

test('edge cases do not throw or produce NaN/Infinity', () => {
  // No people (the app guards people.length > 0 before dividing).
  const noPeople = mk({ items: [{ id: 'a', name: 'A', price: 10, qty: 1 }] });
  assert.equal(Number.isFinite(computeBill(noPeople).totalBill), true);
  assert.doesNotThrow(() => getPersonSubtotal(noPeople, 'Nobody'));

  // No items.
  const noItems = mk({ people: ['A', 'B'] });
  assert.equal(computeBill(noItems).totalBill, 0);
  assert.equal(getPersonTotal(noItems, 'A'), 0);

  // Claim referencing a deleted item id is ignored (no throw).
  const stale = mk({
    items: [{ id: 'a', name: 'A', price: 10, qty: 1 }],
    people: ['A'],
    claims: { A: ['a', 'ghost'] },
    claimQuantities: { A: { a: 1, ghost: 1 } },
  });
  assert.doesNotThrow(() => getPersonTotal(stale, 'A'));
  assertReconciles(stale, 'stale claim id');
});
