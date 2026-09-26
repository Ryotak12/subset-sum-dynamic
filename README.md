# Subset Sum Dynamic

Decides whether some subset of a given array of positive integers sums to exactly a target, using a bitset-based dynamic-programming scheme. Returns a boolean; it does not return the subset itself.

## Usage

```js
import { hasSubsetSum } from "subset-sum-dynamic";

hasSubsetSum([3, 34, 4, 12, 5, 2], 9); // true  (4 + 5)
hasSubsetSum([3, 34, 4, 12, 5, 2], 1); // false
hasSubsetSum([], 0);                   // true  (empty subset)
hasSubsetSum([], 5);                   // false
```

The single exported name is `hasSubsetSum(values, target)`, an ESM named export from `src/index.js`.

## Why

The subset-sum decision problem is NP-complete, but the pseudo-polynomial DP is fine when the target is modest. The classic formulation uses a `target + 1` boolean array and does `dp[i] |= dp[i - v]` for each value. This library keeps the same algorithm but represents the DP row as a single `BigInt`, so each step is one left-shift plus one OR. On a target of a few thousand the bitset is a handful of native words and the inner loop collapses to a couple of word-parallel ops per value rather than `target` boolean writes. The asymptotic bound is unchanged — it is still O(n · target) in the size of the BigInts being shifted — but the constant is much smaller.

The deliberate trade-off: only positive integers and a non-negative integer target are supported. Negative values would require a two-ended bitset indexed off an offset, and the bookkeeping is a different library. Floating-point or fractional targets are rejected up front; subset-sum over the reals is a different problem.

## Edge cases you will hit

- `target` of `0` returns `true` for any input, including an empty array, because the empty subset sums to zero by definition.
- Duplicates are fine: each occurrence is a separate candidate element, so `[2, 2, 2]` can make `6` but `[2]` alone cannot make `4`.
- Non-integer values or target, zero or negative values, and a negative target all throw (`TypeError` for type mismatches, `RangeError` for bad numeric ranges). Validate upstream if your data is untrusted.
- The check short-circuits the moment the target bit becomes reachable, so ordering values small-to-large can make it noticeably faster on yes-instances.
