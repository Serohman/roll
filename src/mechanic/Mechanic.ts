import {Randomizer} from "../randomizer/Randomizer";

/**
 * Abstract base class for all roll mechanics.
 *
 * @remarks
 * Mechanics define how dice rolls are processed, enabling custom rules such as advantage, reroll, or exploding dice.
 * Subclasses must implement the {@link Mechanic.do} method.
 *
 * @public
 */
export abstract class Mechanic {
  /**
   * Executes the mechanic's roll logic.
   *
   * @param min - The minimum integer value (inclusive).
   * @param max - The maximum integer value (inclusive).
   * @param randomizer - The randomizer instance to use for generating random values.
   * @returns An object containing the final result and an array of all individual rolls.
   */
  abstract do(min: number, max: number, randomizer: Randomizer): {result: number; rolls: number[]};
}
