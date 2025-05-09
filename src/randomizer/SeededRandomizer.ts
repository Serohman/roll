import {DiceRollError} from "../util/DiceRollError";
import {Randomizer} from "./Randomizer";

/**
 * Implements a seeded randomization strategy using a linear congruential generator (LCG).
 *
 * @remarks
 * Produces deterministic random sequences based on the provided seed. Useful for reproducible results.
 *
 * @example
 * ```ts
 * const randomizer = new SeededRandomizer(12345);
 * const value = randomizer.generate(1, 20);
 * ```
 *
 * @public
 */
export class SeededRandomizer extends Randomizer {
  private static readonly LCG_MULTIPLIER = 1664525;
  private static readonly LCG_INCREMENT = 1013904223;
  private static readonly LCG_MODULUS = 2 ** 32;

  /**
   * Constructs a SeededRandomizer with the specified seed.
   *
   * @param seed - The initial seed value (32-bit unsigned integer).
   * @throws DiceRollError if the seed is invalid.
   */
  constructor(public seed: number) {
    super();
    this.validateSeed(seed);
  }

  /**
   * Generates a deterministic random value in the range [0, 1) using the LCG algorithm.
   *
   * @returns A floating-point number in the range [0, 1).
   */
  protected generator(): number {
    return this.lcg(this.seed);
  }

  // Linear Congruential Generator (LCG) implementation
  private lcg(seed: number): number {
    this.seed =
      (SeededRandomizer.LCG_MULTIPLIER * seed + SeededRandomizer.LCG_INCREMENT) % SeededRandomizer.LCG_MODULUS;
    return this.seed / SeededRandomizer.LCG_MODULUS;
  }

  private validateSeed(seed: number): void {
    if (!Number.isInteger(seed)) {
      throw new DiceRollError("[DiceRollError] Seed must be an integer.");
    }

    if (seed < 0 || seed >= 2 ** 32) {
      throw new DiceRollError("[DiceRollError] Seed must be a 32-bit unsigned integer (0 <= seed < 2^32).");
    }
  }
}
