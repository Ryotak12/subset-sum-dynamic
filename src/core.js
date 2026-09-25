/**
 * Bitset-based subset-sum decision.
 *
 * Returns true when some subset of `values` sums to exactly `target`, false
 * otherwise. Only positive integers are supported — the bitset scheme relies
 * on every value being a positive shift amount, and negative values would
 * require a totally different DP shape (two-ended growth), which this library
 * does not attempt. `target` may be zero (the empty subset always works) but
 * must not be negative.
 *
 * Approach: keep a big integer as a bitset where bit `i` means "a subset
 * summing to `i` is reachable". Start with only bit 0 set (the empty subset).
 * For each value `v`, OR the bitset with itself left-shifted by `v` — every
 * previously reachable sum `i` now also makes `i + v` reachable. After all
 * values, test the `target` bit.
 *
 * This is O(n) BigInt operations on integers up to `target` bits wide, which
 * is the same asymptotic work as the boolean-array DP but typically faster
 * and far less memory because BigInt shifts/OR run on packed native words.
 *
 * @param {number[]} values — positive integers to draw subsets from.
 * @param {number} target — non-negative integer sum to test for.
 * @returns {boolean} true if some subset sums exactly to `target`.
 */
export function hasSubsetSum(values, target) {
  if (!Array.isArray(values)) {
    throw new TypeError("values must be an array of positive integers");
  }
  if (typeof target !== "number" || !Number.isInteger(target)) {
    throw new TypeError("target must be an integer");
  }
  if (target < 0) {
    throw new RangeError("target must be non-negative; negative targets are unsupported");
  }

  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (typeof v !== "number" || !Number.isInteger(v) || v <= 0) {
      throw new RangeError(`values[${i}] must be a positive integer (got ${String(v)})`);
    }
  }

  // Empty subset sums to 0, so a zero target is reachable by definition.
  if (target === 0) return true;

  // If the total cannot reach the target, no subset can either.
  let total = 0;
  for (const v of values) total += v;
  if (total < target) return false;

  // Bit 0 = empty subset. Only shift up to `target`; bits above it are
  // irrelevant (they can never contribute to a `target`-sized sum later,
  // since all values are positive).
  let reachable = 1n; // bit 0 set
  const targetBit = 1n << BigInt(target);
  const mask = targetBit - 1n; // keep bits 0..target-1 plus we OR in `targetBit` after each step

  for (const v of values) {
    reachable = reachable | (reachable << BigInt(v));
    // Keep only bits up to and including `target`; higher bits are dead weight.
    reachable &= mask | targetBit;
    if ((reachable & targetBit) !== 0n) return true;
  }

  return (reachable & targetBit) !== 0n;
}
