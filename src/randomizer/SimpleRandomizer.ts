import {Randomizer} from "./Randomizer";

/**
 * Implements the default randomization strategy using JavaScript's Math.random().
 *
 * @remarks
 * This randomizer provides uniformly distributed random values for dice rolls.
 *
 * @public
 */
export class SimpleRandomizer extends Randomizer {
  /**
   * Generates a random floating-point value in the range [0, 1) using Math.random().
   *
   * @returns A floating-point number in the range [0, 1).
   */
  protected generator(): number {
    return Math.random();
  }
}
