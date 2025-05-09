import {Randomizer} from "../randomizer/Randomizer";
import {Mechanic} from "./Mechanic";

/**
 * Implements the advantage mechanic, rolling twice and selecting the highest result.
 *
 * @remarks
 * Commonly used in tabletop RPGs to favor higher outcomes in uncertain situations.
 *
 * @example
 * ```ts
 * const mechanic = new AdvantageMechanic();
 * const result = mechanic.do(1, 20, randomizer);
 * ```
 *
 * @public
 */
export class AdvantageMechanic extends Mechanic {
  /**
   * Rolls twice and returns the higher result.
   *
   * @param min - The minimum integer value (inclusive).
   * @param max - The maximum integer value (inclusive).
   * @param randomizer - The randomizer instance to use for generating random values.
   * @returns An object containing the highest result and both rolls.
   */
  do(min: number, max: number, randomizer: Randomizer) {
    const a = randomizer.generate(min, max);
    const b = randomizer.generate(min, max);
    return {result: Math.max(a, b), rolls: [a, b]};
  }
}
