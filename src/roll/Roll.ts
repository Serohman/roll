import {AdvantageMechanic} from "../mechanic/AdvantageMechanic";
import {DisadvantageMechanic} from "../mechanic/DisadvantageMechanic";
import {Mechanic} from "../mechanic/Mechanic";
import {SingleRollMechanic} from "../mechanic/SingleRollMechanic";
import {Randomizer} from "../randomizer/Randomizer";
import {SimpleRandomizer} from "../randomizer/SimpleRandomizer";

/**
 * Configuration options for the Roll class.
 *
 * @property randomizer - The randomizer strategy to use for generating random values.
 * @property mechanic - The roll mechanic to apply (e.g., advantage, reroll).
 *
 * @public
 */
export interface RollConfig {
  randomizer?: Randomizer;
  mechanic?: Mechanic;
}

/**
 * Represents a dice roll with configurable mechanics and randomization strategies.
 *
 * @remarks
 * Supports standard, advantage, and disadvantage rolls, with optional modifiers and override configurations.
 *
 * @example
 * ```ts
 * const roll = new Roll(1, 20);
 * const result = roll.roll();
 * const advResult = roll.rollAdvantage();
 * ```
 *
 * @public
 */
export class Roll {
  public randomizer: Randomizer;
  public mechanic: Mechanic;

  /**
   * Constructs a new Roll instance.
   *
   * @param min - The minimum integer value (inclusive).
   * @param max - The maximum integer value (inclusive).
   * @param defaults - Optional default configuration for randomizer and mechanic.
   */
  constructor(
    public min: number,
    public max: number,
    defaults: RollConfig = {}
  ) {
    this.randomizer = defaults.randomizer || new SimpleRandomizer();
    this.mechanic = defaults.mechanic instanceof Mechanic ? defaults.mechanic : new SingleRollMechanic();
  }

  /**
   * Executes a roll using the configured mechanic and randomizer.
   *
   * @param modifier - Optional value to add to the natural roll result.
   * @param overrideDefaults - Optional configuration to override the default mechanic or randomizer for this roll.
   * @returns An object containing the natural result, modified result, and all individual rolls.
   */
  roll(
    modifier: number = 0,
    overrideDefaults: RollConfig = {}
  ): {
    natural: number;
    modified: number;
    rolls: number[];
  } {
    const mechanic = overrideDefaults.mechanic || this.mechanic;
    const randomizer = overrideDefaults.randomizer || this.randomizer;

    const {result: natural, rolls} = mechanic.do(this.min, this.max, randomizer);
    const modified = natural + (modifier || 0);

    return {
      natural,
      modified,
      rolls,
    };
  }

  /**
   * Executes a roll with advantage (rolls twice and takes the higher result).
   *
   * @param modifier - Optional value to add to the natural roll result.
   * @param overrideDefaults - Optional configuration to override the default randomizer for this roll.
   * @returns An object containing the natural result, modified result, and all individual rolls.
   */
  rollAdvantage(modifier?: number, overrideDefaults: Omit<RollConfig, "mechanic"> = {}) {
    return this.roll(modifier, {
      ...overrideDefaults,
      mechanic: new AdvantageMechanic(),
    });
  }

  /**
   * Executes a roll with disadvantage (rolls twice and takes the lower result).
   *
   * @param modifier - Optional value to add to the natural roll result.
   * @param overrideDefaults - Optional configuration to override the default randomizer for this roll.
   * @returns An object containing the natural result, modified result, and all individual rolls.
   */
  rollDisadvantage(modifier: number, overrideDefaults: Omit<RollConfig, "mechanic"> = {}) {
    return this.roll(modifier, {
      ...overrideDefaults,
      mechanic: new DisadvantageMechanic(),
    });
  }
}
