import {DiceRollError} from "../util/DiceRollError";
import {Randomizer} from "./Randomizer";

/**
 * Implements a weighted randomization strategy, allowing custom probability distributions for outcomes.
 *
 * @remarks
 * Each outcome is assigned a probability weight. The sum of all weights must equal 1.
 *
 * @example
 * ```ts
 * const randomizer = new WeightedRandomizer({
 *   1: 0.1,
 *   2: 0.1,
 *   3: 0.1,
 *   4: 0.1,
 *   5: 0.1,
 *   6: 0.5,
 * });
 * ```
 *
 * @public
 */
export class WeightedRandomizer extends Randomizer {
  private weights: number[];
  private cumulativeWeights: number[];

  /**
   * Constructs a WeightedRandomizer with the specified weights.
   *
   * @param weights - An object mapping outcome numbers to their probability weights. Keys must be consecutive positive integers starting from 1. The sum of all weights must be 1.
   * @throws DiceRollError if weights are invalid.
   */
  constructor(weights: Record<number, number>) {
    super();
    this.validateWeights(weights);
    this.weights = Object.values(weights);
    this.cumulativeWeights = this.convertToCumulativeWeights(this.weights);
  }

  /**
   * Generates a weighted random outcome based on the provided weights.
   *
   * @returns The selected outcome as a number, based on the weighted distribution.
   */
  generator(): number {
    return this.mapToWeightedValue(Math.random(), this.cumulativeWeights);
  }

  private validateWeights(weights: Record<number, number>): void {
    const entries = Object.entries(weights);
    let maxFace = 0;
    let weightSum = 0;

    for (const [key, value] of entries) {
      const face = Number(key);

      // Validate key
      if (key === "" || !Number.isInteger(face) || face <= 0) {
        throw new DiceRollError(`[DiceRollError] Invalid key "${key}": All keys must be positive integers.`);
      }

      // Validate value
      if (typeof value !== "number" || value > 1 || value < 0 || isNaN(value)) {
        throw new DiceRollError(
          `[DiceRollError] Invalid value for key "${key}": All values must be a number between 0 and 1 (inclusive). Received "${value}".`
        );
      }
      if (face > maxFace) {
        maxFace = face;
      }
      weightSum += value;
    }

    if (maxFace !== entries.length) {
      throw new DiceRollError(
        `[DiceRollError] Incorrect number of weight entries: Expected entries from 1 to ${maxFace}, but received ${entries.length} entries total.`
      );
    }

    if (weightSum != 1) {
      throw new DiceRollError(
        `[DiceRollError] Incorrect weights provided, the total of all weights expected to be 1. Got ${weightSum}`
      );
    }
  }

  private convertToCumulativeWeights(weights: number[]): number[] {
    const cumulativeWeights = [];
    let cumulativeSum = 0;

    for (let i = 0; i < weights.length; i++) {
      cumulativeSum += weights[i];
      cumulativeWeights.push(cumulativeSum);
    }

    return cumulativeWeights;
  }

  private mapToWeightedValue(randomValue: number, cumulativeWeights: number[]): number {
    for (let i = 0; i < cumulativeWeights.length; i++) {
      if (randomValue < cumulativeWeights[i]) {
        return i + 1;
      }
    }

    // Should not reach here if weights are valid
    throw new DiceRollError("[DiceRollError] Invalid weights or random value.");
  }

  protected override scaleToRange(weightedRoll: number): number {
    return weightedRoll;
  }
}
