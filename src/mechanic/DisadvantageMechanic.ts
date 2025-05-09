import {Randomizer} from "../randomizer/Randomizer";
import {Mechanic} from "./Mechanic";

/**
 * Implements the disadvantage mechanic, rolling twice and selecting the lowest result.
 *
 * @remarks
 * Commonly used in tabletop RPGs to favor lower outcomes in challenging situations.
 *
 * @example
 * ```ts
 * const mechanic = new DisadvantageMechanic();
 * const result = mechanic.do(1, 20, randomizer);
 * ```
 *
 * @public
 */
export class DisadvantageMechanic extends Mechanic {
  /**
   * Rolls twice and returns the lower result.
   *
   * @param min - The minimum integer value (inclusive).
   * @param max - The maximum integer value (inclusive).
   * @param randomizer - The randomizer instance to use for generating random values.
   * @returns An object containing the lowest result and both rolls.
   */
  do(min: number, max: number, randomizer: Randomizer) {
    const a = randomizer.generate(min, max);
    const b = randomizer.generate(min, max);
    return {result: Math.min(a, b), rolls: [a, b]};
  }
}
