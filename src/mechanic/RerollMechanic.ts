import {Randomizer} from "../randomizer/Randomizer";
import {DiceRollError} from "../util/DiceRollError";
import {Mechanic} from "./Mechanic";

/**
 * Implements the reroll mechanic, allowing specified values to be rerolled up to a maximum count.
 *
 * @remarks
 * Useful for minimizing the impact of undesirable outcomes (e.g., rerolling 1s).
 *
 * @example
 * ```ts
 * const mechanic = new RerollMechanic({ target: [1], maxRerollCount: 1 });
 * const result = mechanic.do(1, 20, randomizer);
 * ```
 *
 * @public
 */
export class RerollMechanic extends Mechanic {
  /**
   * Constructs a RerollMechanic with the specified options.
   *
   * @param options - Configuration for target values and maximum reroll count.
   * @throws DiceRollError if options are invalid.
   */
  constructor(public readonly options: RerollMechanic.Options) {
    super();
    this.options.maxRerollCount = options.maxRerollCount ?? 1;
    this.validateOptions(options);
  }

  /**
   * Rolls and rerolls if the result matches any target value, up to the maximum reroll count.
   *
   * @param min - The minimum integer value (inclusive).
   * @param max - The maximum integer value (inclusive).
   * @param randomizer - The randomizer instance to use for generating random values.
   * @returns An object containing the final result and all rolls (including rerolls).
   */
  do(min: number, max: number, randomizer: Randomizer) {
    const rolls: number[] = [];
    let result: number = randomizer.generate(min, max);
    let remainingRerolls = this.options.maxRerollCount ?? 0;
    rolls.push(result);

    while (this.options.target.includes(result) && remainingRerolls > 0) {
      result = randomizer.generate(min, max);
      rolls.push(result);
      remainingRerolls--;
    }

    return {result, rolls};
  }

  private validateOptions({target: target, maxRerollCount: times}: RerollMechanic.Options): void {
    if (target.length === 0) {
      throw new DiceRollError("Target can not be an empty array.");
    }
    if (target.some((target) => typeof target !== "number")) {
      throw new DiceRollError("All values in the target array must be numbers.");
    }
    if (typeof times !== "number" || !Number.isInteger(times) || times <= 0) {
      throw new DiceRollError("Times must be a positive integer.");
    }
  }
}

/**
 * Options for configuring the RerollMechanic.
 *
 * @property target - Array of values that should trigger a reroll.
 * @property maxRerollCount - Maximum number of rerolls allowed (default: 1).
 *
 * @public
 */
export namespace RerollMechanic {
  export interface Options {
    target: number[];
    maxRerollCount?: number;
  }
}
