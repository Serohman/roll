import {KarmicRandomizer} from "./KarmicRandomizer";

describe("KarmicRandomizer", () => {
  let randomizer = new KarmicRandomizer();

  beforeEach(() => {
    randomizer["historyQueue"] = [];
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

  describe("generator", () => {
    test("Test if positive bias is applied when condition right", () => {
      randomizer.biasFactor = 0.3;
      randomizer["historyQueue"] = [
        KarmicRandomizer["HistoryEntry"].LOW,
        KarmicRandomizer["HistoryEntry"].LOW,
        KarmicRandomizer["HistoryEntry"].LOW,
      ];
      jest.spyOn(randomizer, "generateRawRoll" as any).mockReturnValue(0.2);
      const result = randomizer["generator"]();
      expect(result).toBe(0.5);
    });
    test("Test if negative bias is applied when condition right", () => {
      randomizer.biasFactor = 0.3;
      randomizer["historyQueue"] = [
        KarmicRandomizer["HistoryEntry"].HIGH,
        KarmicRandomizer["HistoryEntry"].HIGH,
        KarmicRandomizer["HistoryEntry"].HIGH,
      ];
      jest.spyOn(randomizer, "generateRawRoll" as any).mockReturnValue(0.3);
      const result = randomizer["generator"]();
      expect(result).toBe(0);
    });
    test("Test if bias is omitted when condition right", () => {
      randomizer.biasFactor = 0.3;
      randomizer["historyQueue"] = [];
      jest.spyOn(randomizer, "generateRawRoll" as any).mockReturnValue(0.5);
      const result = randomizer["generator"]();
      expect(result).toBe(0.5);
    });
  });
});

describe("KarmicRandomizer Configuration & Integration", () => {
  test("constructor applies custom config", () => {
    const randomizer = new KarmicRandomizer({
      highRollThreshold: 0.7,
      lowRollThreshold: 0.3,
      biasFactor: 0.5,
      historyLimit: 5,
    });
    expect(randomizer.highRollThreshold).toBe(0.7);
    expect(randomizer.lowRollThreshold).toBe(0.3);
    expect(randomizer.biasFactor).toBe(0.5);
    expect(randomizer.historyLimit).toBe(5);
  });

  test("historyQueue does not exceed historyLimit", () => {
    const randomizer = new KarmicRandomizer({historyLimit: 3});
    // Simulate 6 rolls
    for (let i = 0; i < 6; i++) {
      jest.spyOn(randomizer as any, "generateRawRoll").mockReturnValue(0.9); // Always HIGH
      randomizer["generator"]();
    }
    expect(randomizer["historyQueue"].length).toBeLessThanOrEqual(3);
  });

  test("integration: bias effect over multiple rolls", () => {
    // Use a fixed biasFactor and thresholds for predictability
    const randomizer = new KarmicRandomizer({
      biasFactor: 0.5,
      highRollThreshold: 0.8,
      lowRollThreshold: 0.2,
      historyLimit: 10,
    });
    // Force history to be all LOW, so bias should push result up
    randomizer["historyQueue"] = Array(10).fill(KarmicRandomizer["HistoryEntry"].LOW);
    jest.spyOn(randomizer as any, "generateRawRoll").mockReturnValue(0.2);
    const result = randomizer["generator"]();
    expect(result).toBeCloseTo(0.7, 10); // 0.2 + 0.5 bias
    // Now force history to be all HIGH, so bias should push result down
    randomizer["historyQueue"] = Array(10).fill(KarmicRandomizer["HistoryEntry"].HIGH);
    jest.spyOn(randomizer as any, "generateRawRoll").mockReturnValue(0.8);
    const result2 = randomizer["generator"]();
    expect(result2).toBeCloseTo(0.3, 10); // 0.8 - 0.5 bias
  });
});
