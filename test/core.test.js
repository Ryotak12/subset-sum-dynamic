import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { hasSubsetSum } from "../src/index.js";

describe("hasSubsetSum", () => {
  it("returns true for target 0 (empty subset)", () => {
    assert.equal(hasSubsetSum([], 0), true);
    assert.equal(hasSubsetSum([1, 2, 3], 0), true);
  });

  it("returns false for a positive target with no values", () => {
    assert.equal(hasSubsetSum([], 5), false);
  });

  it("solves the classic {3, 34, 4, 12, 5, 2} / 9 case", () => {
    // 4 + 5 = 9
    assert.equal(hasSubsetSum([3, 34, 4, 12, 5, 2], 9), true);
  });

  it("returns false when no subset reaches the target", () => {
    assert.equal(hasSubsetSum([3, 34, 4, 12, 5, 2], 1), false);
    assert.equal(hasSubsetSum([2, 4, 6], 11), false);
  });

  it("handles the full-array subset (target == sum of all values)", () => {
    assert.equal(hasSubsetSum([2, 4, 6], 12), true);
  });

  it("handles a single value equal to the target", () => {
    assert.equal(hasSubsetSum([7], 7), true);
    assert.equal(hasSubsetSum([7], 8), false);
  });

  it("handles duplicate values", () => {
    // 3 + 3 = 6; also 2 + 2 + 2 = 6
    assert.equal(hasSubsetSum([3, 3, 2, 2, 2], 6), true);
    // Only two 3s and three 2s: can we make 7? 3 + 2 + 2 = 7, yes.
    assert.equal(hasSubsetSum([3, 3, 2, 2, 2], 7), true);
    // Can we make 13? Max is 3+3+2+2+2 = 12, no.
    assert.equal(hasSubsetSum([3, 3, 2, 2, 2], 13), false);
  });

  it("short-circuits when the total of all values is below the target", () => {
    assert.equal(hasSubsetSum([1, 2], 100), false);
  });

  it("short-circuits mid-iteration once the target bit is reachable", () => {
    // [1, 2, 3, 4] with target 3 — reachable after processing 1 and 2.
    assert.equal(hasSubsetSum([1, 2, 3, 4], 3), true);
  });

  it("throws on a negative target", () => {
    assert.throws(() => hasSubsetSum([1, 2], -1), RangeError);
  });

  it("throws on a non-integer target", () => {
    assert.throws(() => hasSubsetSum([1, 2], 3.5), TypeError);
  });

  it("throws on a non-positive value", () => {
    assert.throws(() => hasSubsetSum([1, 0, 2], 3), RangeError);
    assert.throws(() => hasSubsetSum([1, -2, 3], 2), RangeError);
  });

  it("throws on a non-integer value", () => {
    assert.throws(() => hasSubsetSum([1, 2.5, 3], 5), RangeError);
  });

  it("throws when values is not an array", () => {
    assert.throws(() => hasSubsetSum("123", 6), TypeError);
    assert.throws(() => hasSubsetSum(null, 0), TypeError);
  });

  it("handles a larger random-ish case correctly", () => {
    const values = [11, 23, 5, 17, 2, 29, 8, 13, 41, 3];
    // 23 + 5 + 17 + 2 + 8 + 3 = 58
    assert.equal(hasSubsetSum(values, 58), true);
    // 41 + 29 = 70
    assert.equal(hasSubsetSum(values, 70), true);
    // sum of all = 152, so 151 should be false unless we can drop 1 — we
    // can't, smallest value is 2.
    assert.equal(hasSubsetSum(values, 151), false);
  });
});
