import {Randomizer} from "../randomizer/Randomizer";
import {Mechanic} from "./Mechanic";

/**
 * Implements the exploding dice mechanic, allowing additional rolls when the maximum value is rolled.
 *
 * @remarks
 * Each time the maximum value is rolled, another roll is added to the total. This process repeats as long as the maximum is rolled.
 *
 * @example
 * ```ts
 * const mechanic = new ExplodingMechanic();
 * const result = mechanic.do(1, 6, randomizer);
 * ```
 *
 * @public
 */
export class ExplodingMechanic extends Mechanic {
  /**
   * Rolls and continues rolling as long as the maximum value is rolled, summing all results.
   *
   * @param min - The minimum integer value (inclusive).
   * @param max - The maximum integer value (inclusive).
   * @param randomizer - The randomizer instance to use for generating random values.
   * @returns An object containing the total result and all individual rolls.
   */
  do(min: number, max: number, randomizer: Randomizer) {
    if (min === max) return {result: min, rolls: [min]};

    let result = 0;
    let roll;
    const rolls: number[] = [];

    do {
      roll = randomizer.generate(min, max);
      rolls.push(roll);
      result += roll;
    } while (roll === max); // Continue rolling if max value is hit

    return {result, rolls};
  }
}
