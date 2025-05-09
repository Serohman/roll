import {Randomizer} from "./Randomizer";

/**
 * Configuration options for the KarmicRandomizer.
 *
 * @public
 */
export interface KarmicRandomizerConfig {
  /** Threshold above which a roll is considered "high" (default: 0.8). */
  highRollThreshold?: number;
  /** Threshold below which a roll is considered "low" (default: 0.2). */
  lowRollThreshold?: number;
  /** Strength of the bias applied to subsequent rolls (default: 0.2). */
  biasFactor?: number;
  /** Number of recent rolls to consider for bias calculation (default: 10). */
  historyLimit?: number;
}

enum HistoryEntry {
  HIGH,
  LOW,
  NEUTRAL,
}

/**
 * Implements a karmic randomization strategy that biases results based on recent roll history.
 *
 * @remarks
 * Reduces streaks by making high rolls less likely after a streak of highs, and vice versa for lows.
 *
 * @example
 * ```ts
 * const randomizer = new KarmicRandomizer({ biasFactor: 0.2 });
 * const value = randomizer.generate(1, 20);
 * ```
 *
 * @public
 */
export class KarmicRandomizer extends Randomizer {
  static readonly HistoryEntry = HistoryEntry;
  private historyQueue: HistoryEntry[] = [];
  historyLimit: number;
  highRollThreshold: number;
  lowRollThreshold: number;
  biasFactor: number;

  /**
   * Constructs a KarmicRandomizer with the specified configuration.
   *
   * @param config - Optional configuration for bias thresholds, factor, and history limit.
   */
  constructor({highRollThreshold, lowRollThreshold, biasFactor, historyLimit}: KarmicRandomizerConfig = {}) {
    //validate high roll / low roll
    super();
    this.historyLimit = historyLimit || 10;
    this.highRollThreshold = highRollThreshold || 0.8;
    this.lowRollThreshold = lowRollThreshold || 0.2;
    this.biasFactor = biasFactor || 0.2;
    this.historyLimit = historyLimit || 10;
  }

  /**
   * Generates a biased random value based on recent roll history.
   *
   * @returns A floating-point number in the range [0, 1), biased according to recent outcomes.
   */
  protected generator(): number {
    const rawRoll = this.generateRawRoll();
    const biasedRoll = this.applyBias(this.biasFactor, rawRoll);
    const rollType = this.evaluateRoll(biasedRoll);

    // Update history and maintain the limit
    this.historyQueue.push(rollType);
    if (this.historyQueue.length > this.historyLimit) {
      this.historyQueue.shift();
    }

    return biasedRoll;
  }

  private applyBias(biasFactor: number, rawRoll: number): number {
    if (this.recentLowRolls > this.recentHighRolls) {
      return Math.min(1, rawRoll + biasFactor); // Skew slightly toward high
    } else if (this.recentHighRolls > this.recentLowRolls) {
      return Math.max(0, rawRoll - biasFactor); // Skew slightly toward low
    }
    return rawRoll;
  }

  /**
   * Returns the number of recent high rolls in the history queue.
   */
  get recentHighRolls() {
    return this.historyQueue.filter((entry) => entry === HistoryEntry.HIGH).length;
  }

  /**
   * Returns the number of recent low rolls in the history queue.
   */
  get recentLowRolls() {
    return this.historyQueue.filter((entry) => entry === HistoryEntry.LOW).length;
  }

  private evaluateRoll(rawRoll: number): HistoryEntry {
    if (rawRoll >= this.highRollThreshold) return HistoryEntry.HIGH;
    if (rawRoll <= this.lowRollThreshold) return HistoryEntry.LOW;
    return HistoryEntry.NEUTRAL;
  }

  private generateRawRoll(): number {
    return Math.random();
  }
}
