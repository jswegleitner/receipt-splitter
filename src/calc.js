// Pure money math — no React, no component state. The single source of truth
// for "who owes what", unit-tested in test/calc.test.js (the Σ(person totals)
// == bill invariant). app.jsx delegates to these via thin wrappers.
//
// A "bill state" is: { items, people, claims, claimQuantities, tax, tip, tipType, tipBase }
//   items: [{ id, name, price, qty }]
//   claims: { [person]: itemId[] }
//   claimQuantities: { [person]: { [itemId]: number } }
// All money/qty fields are numbers. `claimedMap` may be passed in to reuse a
// memoized result; otherwise it is computed on demand.

// Quantity a person claimed of an item (defaults to 1 when unset, matching the UI).
export function getClaimQuantity(claimQuantities, person, itemId) {
  const qty = claimQuantities[person]?.[itemId];
  return qty !== undefined ? qty : 1;
}

// Per-item total claimed quantity (Σ over everyone who claimed it), rounded to cents.
export function claimedQtyByItem(items, claims, claimQuantities) {
  const map = {};
  items.forEach((item) => {
    let total = 0;
    Object.keys(claims).forEach((person) => {
      if (claims[person]?.includes(item.id)) {
        const qty = claimQuantities[person]?.[item.id];
        total += qty !== undefined ? qty : 1;
      }
    });
    map[item.id] = Math.round(total * 100) / 100;
  });
  return map;
}

// Unclaimed quantity remaining on an item (qty − claimed), rounded to cents.
export function getUnclaimedQuantity(items, claimedMap, itemId) {
  const item = items.find((i) => i.id === itemId);
  if (!item) return 0;
  const unclaimed = item.qty - (claimedMap[itemId] || 0);
  return Math.round(unclaimed * 100) / 100;
}

// Bill-level totals: subtotal, +tax, the tip base, the tip amount, and grand total.
export function computeBill({ items, tax, tip, tipType, tipBase }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const subtotalPlusTax = subtotal + tax;
  const tipCalculationBase = tipBase === 'subtotal' ? subtotal : subtotalPlusTax;
  const tipAmount = tipType === 'percent' ? (tipCalculationBase * tip) / 100 : tip;
  const totalBill = subtotalPlusTax + tipAmount;
  return { subtotal, subtotalPlusTax, tipCalculationBase, tipAmount, totalBill };
}

// A person's pre-tax/tip share: exactly what they claimed (unit price × claimed
// qty) plus an even split of any unclaimed remainder among everyone. This makes
// each item reconcile exactly to item.price * item.qty.
export function getPersonSubtotal(state, person) {
  const { items, people, claims, claimQuantities } = state;
  const claimedMap = state.claimedMap || claimedQtyByItem(items, claims, claimQuantities);
  const personClaims = claims[person] || [];
  let total = 0;

  personClaims.forEach((itemId) => {
    const item = items.find((i) => i.id === itemId);
    if (item) {
      total += item.price * getClaimQuantity(claimQuantities, person, itemId);
    }
  });

  items.forEach((item) => {
    const unclaimedQty = getUnclaimedQuantity(items, claimedMap, item.id);
    if (unclaimedQty > 0 && people.length > 0) {
      total += (item.price * unclaimedQty) / people.length;
    }
  });

  return total;
}

// A person's grand total: their subtotal + their proportional share of tax & tip.
export function getPersonTotal(state, person) {
  const { people, tax } = state;
  const { subtotal, tipAmount } = computeBill(state);
  const personSubtotal = getPersonSubtotal(state, person);
  const personProportion =
    subtotal > 0 ? personSubtotal / subtotal : people.length > 0 ? 1 / people.length : 0;
  return personSubtotal + tax * personProportion + tipAmount * personProportion;
}
