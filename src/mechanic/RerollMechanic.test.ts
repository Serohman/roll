import {Randomizer} from "../randomizer/Randomizer";
import {RerollMechanic} from "./RerollMechanic";

describe("RerollMechanic", () => {
  describe("Constructor", () => {
    test("should not throw an error for valid options", () => {
      expect(() => {
        new RerollMechanic({target: [1, 20], maxRerollCount: 1});
      }).not.toThrow();
    });

    test("should throw an error if 'target' contains non-number values", () => {
      expect(() => {
        new RerollMechanic({target: [1, "string" as any, 20], maxRerollCount: 1});
      }).toThrow("All values in the target array must be numbers.");
      expect(() => {
        new RerollMechanic({target: [1, null as any, 20], maxRerollCount: 1});
      }).toThrow("All values in the target array must be numbers.");
    });

    test("should throw an error if 'target' is empty", () => {
      expect(() => {
        new RerollMechanic({target: [], maxRerollCount: 1});
      }).toThrow("Target can not be an empty array.");
    });

    test("should throw an error if maxRerollCount is not a number", () => {
      expect(() => {
        new RerollMechanic({target: [1, 2], maxRerollCount: "not-a-number" as any});
      }).toThrow("Times must be a positive integer.");
    });

    test("should throw an error if maxRerollCount is zero or negative", () => {
      expect(() => {
        new RerollMechanic({target: [1, 2], maxRerollCount: 0});
      }).toThrow("Times must be a positive integer.");
      expect(() => {
        new RerollMechanic({target: [1, 2], maxRerollCount: -1});
      }).toThrow("Times must be a positive integer.");
    });
  });

  describe("do", () => {
    const mockRandomizer = (values: number[]): Randomizer =>
      ({
        generate: jest.fn(() => values.shift() || 0),
      }) as any;

    test("should accept the first roll if not in target", () => {
      const mechanic = new RerollMechanic({target: [1, 2], maxRerollCount: 3});
      const randomizer = mockRandomizer([3]);
      const result = mechanic.do(1, 6, randomizer);

      expect(result).toEqual({result: 3, rolls: [3]});
    });

    it("should reroll until success", () => {
      const mechanic = new RerollMechanic({target: [1, 2], maxRerollCount: 3});
      const randomizer = mockRandomizer([1, 2, 5]);
      const result = mechanic.do(1, 6, randomizer);

      expect(result).toEqual({result: 5, rolls: [1, 2, 5]});
    });

    it("should exhaust all rerolls if all rolls are in target", () => {
      const mechanic = new RerollMechanic({target: [1, 2, 3], maxRerollCount: 3});
      const randomizer = mockRandomizer([1, 2, 3, 4]);
      const result = mechanic.do(1, 6, randomizer);

      expect(result).toEqual({result: 4, rolls: [1, 2, 3, 4]}); // 1 initial roll + 3 rerolls
    });

    it("should not reroll if target contains no values in range", () => {
      const mechanic = new RerollMechanic({target: [7, 8], maxRerollCount: 3});
      const randomizer = mockRandomizer([4]);
      const result = mechanic.do(1, 6, randomizer);

      expect(result).toEqual({result: 4, rolls: [4]});
    });

    it("should allow only one reroll when maxRerollCount is 1", () => {
      const mechanic = new RerollMechanic({target: [1], maxRerollCount: 1});
      const randomizer = mockRandomizer([1, 2, 3]);
      const result = mechanic.do(1, 6, randomizer);

      expect(result).toEqual({result: 2, rolls: [1, 2]});
    });
  });

  // it("should do a reroll if target number is hit");
  // it("should reroll correct number of times if target number is hit");
  // it("should return a list of rolled values (including the rerolled values)");
  // it("should return a valid value");
});

describe("RerollMechanic edge cases", () => {
  const randomizer = {
    generate: jest.fn((min) => min),
  } as any;

  test("should return min when min = max", () => {
    const mechanic = new RerollMechanic({target: [1], maxRerollCount: 2});
    const minMax = 7;
    const {result, rolls} = mechanic.do(minMax, minMax, randomizer);
    expect(result).toBe(minMax);
    expect(rolls).toEqual([minMax]); // Only one roll possible
  });

  test("should handle negative min and max", () => {
    const mechanic = new RerollMechanic({target: [-5], maxRerollCount: 2});
    const {result, rolls} = mechanic.do(-5, -1, randomizer);
    expect(result).toBe(-5);
    expect(rolls).toEqual([-5, -5, -5]); // 1 initial + 2 rerolls
  });

  test("should handle float min and max", () => {
    const mechanic = new RerollMechanic({target: [1.5], maxRerollCount: 2});
    const {result, rolls} = mechanic.do(1.5, 2.5, randomizer);
    expect(result).toBe(1.5);
    expect(rolls).toEqual([1.5, 1.5, 1.5]); // 1 initial + 2 rerolls
  });

  test("should not reroll if target is outside min/max range", () => {
    const mechanic = new RerollMechanic({target: [100], maxRerollCount: 2});
    const {result, rolls} = mechanic.do(1, 6, randomizer);
    expect(result).toBe(1);
    expect(rolls).toEqual([1]);
  });

  test("should default maxRerollCount to 1 if undefined", () => {
    const mechanic = new RerollMechanic({target: [1]});
    const randomizer = {generate: jest.fn(() => 1)} as any;
    const {rolls} = mechanic.do(1, 6, randomizer);
    expect(rolls.length).toBe(2); // 1 initial + 1 reroll
  });
});
