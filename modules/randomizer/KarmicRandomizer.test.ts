import { KarmicRandomizer } from "./KarmicRandomizer";

describe("KarmicRandomizer", () => {
  let randomizer = new KarmicRandomizer();

  beforeEach(() => {
    randomizer["historyQueue"] = [];
  });

  describe("mapRollToRange", () => {
    let min = 1,
      max = 20,
      rawRoll = 0,
      result;

    beforeEach(() => {
      min = 1;
      max = 20;
    });

    afterEach(() => {
      result = undefined;
    });

    test("should return the minimum value when rawRoll is 0 or lower", () => {
      rawRoll = 0;
      result = randomizer["mapRollToRange"](rawRoll, min, max);
      expect(result).toBe(min);

      rawRoll = -0.1;
      result = randomizer["mapRollToRange"](rawRoll, min, max);
      expect(result).toBe(min);
    });

    test("should return the maximum value when rawRoll is higher than 0.99", () => {
      rawRoll = 1;
      result = randomizer["mapRollToRange"](rawRoll, min, max);
      expect(result).toBe(max); // Expecting 10 as the maximum value
    });

    test("should return a value within the range when rawRoll is between 0 and 1", () => {
      rawRoll = 0.5;
      result = randomizer["mapRollToRange"](rawRoll, min, max);
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
    });

    test("should return correct value for rawRoll between 0 and 1", () => {
      rawRoll = 0.2; // Some random fraction between 0 and 1
      result = randomizer["mapRollToRange"](rawRoll, min, max);
      expect(result).toBe(5); // Expect a value close to the 20% mark in the range [1,20], which is 5
    });

    test("should return correct value when min and max are equal", () => {
      min = max = 5; // Edge case: single number range [5,5]

      rawRoll = 0; // Low roll (though it should be irrelevant)
      result = randomizer["mapRollToRange"](rawRoll, min, max);
      expect(result).toBe(5); // Only possible outcome is 5

      rawRoll = 0.5; // Midpoint
      result = randomizer["mapRollToRange"](rawRoll, min, max);
      expect(result).toBe(5);

      rawRoll = 1; // High roll
      result = randomizer["mapRollToRange"](rawRoll, min, max);
      expect(result).toBe(5);
    });

    test("should correctly handle negative values for min and max", () => {
      min = -5;
      max = -1;
      rawRoll = 0.5;
      result = randomizer["mapRollToRange"](rawRoll, min, max);
      expect(result).toBe(-3); // Expect midpoint of the range [-5, -1] which is -3
    });

    test("should work with a large range", () => {
      min = 1;
      max = 1000;
      rawRoll = 0.999;
      result = randomizer["mapRollToRange"](rawRoll, min, max);
      expect(result).toBe(1000); // Should be the highest value in the range
    });
  });

  describe("evaluateRoll", () => {
    test("should return HIGH when rawRoll is greater than or equal to highRollThreshold", () => {
      const rawRoll = 0.8; // Same as highRollThreshold
      randomizer.highRollThreshold = 0.8;
      const result = randomizer["evaluateRoll"](rawRoll);
      expect(result).toBe(KarmicRandomizer["HistoryEntry"].HIGH);
    });

    test("should return HIGH when rawRoll is greater than highRollThreshold", () => {
      randomizer.highRollThreshold = 0.8;
      const result = randomizer["evaluateRoll"](0.9);
      expect(result).toBe(KarmicRandomizer["HistoryEntry"].HIGH);
    });

    test("should return LOW when rawRoll is less than or equal to lowRollThreshold", () => {
      randomizer.lowRollThreshold = 0.2;
      const result = randomizer["evaluateRoll"](0.2);
      expect(result).toBe(KarmicRandomizer["HistoryEntry"].LOW);
    });

    test("should return LOW when rawRoll is less than lowRollThreshold", () => {
      randomizer.lowRollThreshold = 0.2;
      const result = randomizer["evaluateRoll"](0.1);
      expect(result).toBe(KarmicRandomizer["HistoryEntry"].LOW);
    });

    test("should return NEUTRAL when rawRoll is between lowRollThreshold and highRollThreshold", () => {
      const rawRoll = 0.5; // In the neutral range
      const result = randomizer["evaluateRoll"](rawRoll);
      expect(result).toBe(KarmicRandomizer["HistoryEntry"].NEUTRAL);
    });
  });

  describe("get recentHighRolls", () => {
    test("should return 0 when historyQueue is empty", () => {
      randomizer["historyQueue"] = [];
      const result = randomizer.recentHighRolls;
      expect(result).toBe(0);
    });

    test("should return 0 when there are no HIGH entries", () => {
      randomizer["historyQueue"] = [
        KarmicRandomizer["HistoryEntry"].LOW,
        KarmicRandomizer["HistoryEntry"].NEUTRAL,
        KarmicRandomizer["HistoryEntry"].LOW,
      ];
      const result = randomizer.recentHighRolls;
      expect(result).toBe(0);
    });

    test("should return 1 when there is a single HIGH entry", () => {
      randomizer["historyQueue"] = [KarmicRandomizer["HistoryEntry"].HIGH];
      const result = randomizer.recentHighRolls;
      expect(result).toBe(1);
    });
    test("should count only HIGH entries and ignore LOW/NEUTRAL", () => {
      randomizer["historyQueue"] = [
        KarmicRandomizer["HistoryEntry"].HIGH,
        KarmicRandomizer["HistoryEntry"].LOW,
        KarmicRandomizer["HistoryEntry"].NEUTRAL,
        KarmicRandomizer["HistoryEntry"].HIGH,
        KarmicRandomizer["HistoryEntry"].HIGH,
      ];
      const result = randomizer.recentHighRolls;
      expect(result).toBe(3);
    });
  });

  describe("get recentLowRolls", () => {
    test("should return 0 when historyQueue is empty", () => {
      randomizer["historyQueue"] = [];
      const result = randomizer.recentLowRolls;
      expect(result).toBe(0);
    });

    test("should return 0 when there are no HIGH entries", () => {
      randomizer["historyQueue"] = [
        KarmicRandomizer["HistoryEntry"].HIGH,
        KarmicRandomizer["HistoryEntry"].NEUTRAL,
        KarmicRandomizer["HistoryEntry"].HIGH,
      ];
      const result = randomizer.recentLowRolls;
      expect(result).toBe(0);
    });

    test("should return 1 when there is a single HIGH entry", () => {
      randomizer["historyQueue"] = [KarmicRandomizer["HistoryEntry"].LOW];
      const result = randomizer.recentLowRolls;
      expect(result).toBe(1);
    });
    test("should count only HIGH entries and ignore LOW/NEUTRAL", () => {
      randomizer["historyQueue"] = [
        KarmicRandomizer["HistoryEntry"].LOW,
        KarmicRandomizer["HistoryEntry"].LOW,
        KarmicRandomizer["HistoryEntry"].NEUTRAL,
        KarmicRandomizer["HistoryEntry"].HIGH,
        KarmicRandomizer["HistoryEntry"].LOW,
      ];
      const result = randomizer.recentLowRolls;
      expect(result).toBe(3);
    });
  });

  describe("applyBias", () => {
    test("should return rawRoll when recentLowRolls and recentHighRolls are equal", () => {
      randomizer["historyQueue"] = [
        KarmicRandomizer["HistoryEntry"].LOW,
        KarmicRandomizer["HistoryEntry"].NEUTRAL,
        KarmicRandomizer["HistoryEntry"].HIGH,
        KarmicRandomizer["HistoryEntry"].LOW,
        KarmicRandomizer["HistoryEntry"].NEUTRAL,
        KarmicRandomizer["HistoryEntry"].HIGH,
      ];
      const result = randomizer["applyBias"](0.3, 0.5);
      expect(result).toBe(0.5);
    });

    test("Bias Toward High (Recent Low Rolls > Recent High Rolls)", () => {
      randomizer["historyQueue"] = [
        KarmicRandomizer["HistoryEntry"].LOW,
        KarmicRandomizer["HistoryEntry"].NEUTRAL,
        KarmicRandomizer["HistoryEntry"].LOW,
        KarmicRandomizer["HistoryEntry"].LOW,
        KarmicRandomizer["HistoryEntry"].NEUTRAL,
        KarmicRandomizer["HistoryEntry"].HIGH,
      ];
      const result = randomizer["applyBias"](0.3, 0.5);
      expect(result).toBe(0.8);
    });
    test("Bias Toward Low (Recent High Rolls > Recent Low Rolls)", () => {
      randomizer["historyQueue"] = [
        KarmicRandomizer["HistoryEntry"].HIGH,
        KarmicRandomizer["HistoryEntry"].NEUTRAL,
        KarmicRandomizer["HistoryEntry"].HIGH,
        KarmicRandomizer["HistoryEntry"].HIGH,
        KarmicRandomizer["HistoryEntry"].NEUTRAL,
        KarmicRandomizer["HistoryEntry"].LOW,
      ];
      const result = randomizer["applyBias"](0.3, 0.5);
      expect(result).toBe(0.2);
    });
    test("Cap at Upper Limit (rawRoll + biasFactor > 1)", () => {
      randomizer["historyQueue"] = [
        KarmicRandomizer["HistoryEntry"].LOW,
        KarmicRandomizer["HistoryEntry"].LOW,
        KarmicRandomizer["HistoryEntry"].LOW,
      ];
      const result = randomizer["applyBias"](0.6, 0.5);
      expect(result).toBe(1);
    });
    test("Cap at Lower Limit (rawRoll - biasFactor < 0))", () => {
      randomizer["historyQueue"] = [
        KarmicRandomizer["HistoryEntry"].HIGH,
        KarmicRandomizer["HistoryEntry"].HIGH,
        KarmicRandomizer["HistoryEntry"].HIGH,
      ];
      const result = randomizer["applyBias"](0.6, 0.5);
      expect(result).toBe(0);
    });
  });

  describe("generate", () => {
    test("Number within range is returned", () => {
      const min = 1;
      const max = 20;
      const result = randomizer["generator"](min, max);
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
    });
    test("Test if + bias is applied when condition right", () => {
      randomizer.biasFactor = 0.3;
      randomizer["historyQueue"] = [
        KarmicRandomizer["HistoryEntry"].LOW,
        KarmicRandomizer["HistoryEntry"].LOW,
        KarmicRandomizer["HistoryEntry"].LOW,
      ];
      jest.spyOn(randomizer, "generateRawRoll" as any).mockReturnValue(0.2);
      const result = randomizer["generator"](1, 20);
      expect(result).toBe(11);
    });
    test("Test if - bias is applied when condition right", () => {
      randomizer.biasFactor = 0.3;
      randomizer["historyQueue"] = [
        KarmicRandomizer["HistoryEntry"].HIGH,
        KarmicRandomizer["HistoryEntry"].HIGH,
        KarmicRandomizer["HistoryEntry"].HIGH,
      ];
      jest.spyOn(randomizer, "generateRawRoll" as any).mockReturnValue(0.3);
      const result = randomizer["generator"](1, 20);
      expect(result).toBe(1);
    });
    test("Test if bias is dropped when condition right", () => {
      randomizer.biasFactor = 0.3;
      randomizer["historyQueue"] = [];
      jest.spyOn(randomizer, "generateRawRoll" as any).mockReturnValue(0.5);
      const result = randomizer["generator"](1, 20);
      expect(result).toBe(11);
    });
  });
});
