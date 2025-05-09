import {Randomizer} from "../randomizer/Randomizer";

/**
 * Implements a basic single-roll mechanic, returning the result of a single random roll.
 *
 * @remarks
 * This mechanic does not apply any special rules or modifications to the roll.
 *
 * @example
 * ```ts
 * const mechanic = new SingleRollMechanic();
 * const result = mechanic.do(1, 20, randomizer);
 * ```
 *
 * @public
 */
export class SingleRollMechanic {
  /**
   * Rolls once and returns the result.
   *
   * @param min - The minimum integer value (inclusive).
   * @param max - The maximum integer value (inclusive).
   * @param randomizer - The randomizer instance to use for generating random values.
   * @returns An object containing the result and the single roll.
   */
  do(min: number, max: number, randomizer: Randomizer) {
    const result = randomizer.generate(min, max);
    return {result, rolls: [result]};
  }
}
