import {DiceRollError} from "../util/DiceRollError";

/**
 * Abstract base class for all randomizer strategies.
 * Provides the interface and common logic for generating random numbers within a specified range.
 *
 * @remarks
 * Subclasses must implement the {@link Randomizer.generator} method to define their randomization logic.
 *
 * @public
 */
export abstract class Randomizer {
  /**
   * Generates a raw random value in the range [0, 1).
   * Subclasses must implement this method to provide their own randomization logic.
   *
   * @returns A floating-point number in the range [0, 1).
   */
  protected abstract generator(): number;

  /**
   * Generates a random integer within the specified range [min, max].
   *
   * @param min - The minimum integer value (inclusive).
   * @param max - The maximum integer value (inclusive).
   * @returns A random integer between min and max, inclusive.
   * @throws DiceRollError if the range is invalid.
   */
  generate(min: number, max: number): number {
    this.validateMinMax(min, max);
    return this.scaleToRange(this.generator(), min, max);
  }

  /**
   * Scales a raw random value to the specified integer range.
   *
   * @param rawRoll - The raw random value in [0, 1).
   * @param min - The minimum integer value (inclusive).
   * @param max - The maximum integer value (inclusive).
   * @returns An integer in the range [min, max].
   */
  protected scaleToRange(rawRoll: number, min: number, max: number): number {
    if (rawRoll >= 0.99) return max;
    if (rawRoll <= 0) return min;

    return Math.floor(rawRoll * (max - min + 1)) + min;
  }

  /**
   * Validates the provided min and max values for range correctness.
   *
   * @param min - The minimum integer value.
   * @param max - The maximum integer value.
   * @throws DiceRollError if the range is invalid.
   */
  protected validateMinMax(min: number, max: number): void {
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
      throw new DiceRollError(
        `[DiceRollError] Invalid range: Both minimum (${min}) and maximum (${max}) values must be integers.`
      );
    }
    if (min < 1 || max < 1) {
      throw new DiceRollError(
        `[DiceRollError] Invalid range: Both minimum (${min}) and maximum (${max}) values must be positive integers greater than zero.`
      );
    }
    if (min > max) {
      throw new DiceRollError(
        `[DiceRollError] Invalid range: The minimum value (${min}) cannot be greater than the maximum value (${max}).`
      );
    }
  }
}
