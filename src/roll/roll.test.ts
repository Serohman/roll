import {AdvantageMechanic} from "../mechanic/AdvantageMechanic";
import {DisadvantageMechanic} from "../mechanic/DisadvantageMechanic";
import {Mechanic} from "../mechanic/Mechanic";
import {Randomizer} from "../randomizer/Randomizer";
import {MockReturn10Randomizer, MockSequenceRandomizer} from "../randomizer/Randomizer.test";
import {Roll} from "./Roll";

describe("Roll", () => {
  let roll: Roll;
  let randomizer: Randomizer;

  beforeEach(() => {
    randomizer = new MockReturn10Randomizer();
    roll = new Roll(1, 20, {randomizer});
  });

  describe("roll", () => {
    test("should return correct natural and modified values with default mechanic", () => {
      const result = roll.roll();
      expect(result.natural).toBe(10); // Based on the mock implementation
      expect(result.modified).toBe(10);
      expect(result.rolls).toEqual([10]);
    });

    test("should apply modifier correctly", () => {
      const resultA = roll.roll(3);
      const resultB = roll.roll(-3);
      expect(resultA.natural).toBe(10);
      expect(resultA.modified).toBe(13);
      expect(resultB.natural).toBe(10);
      expect(resultB.modified).toBe(7);
    });

    test("should allow mechanic to be overridden", () => {
      const mockMechanic: Mechanic = {
        do: jest.fn().mockReturnValue(7), // Always returns 7
      };
      roll.roll(0, {mechanic: mockMechanic});
      expect(mockMechanic.do).toHaveBeenCalledWith(1, 20, randomizer);
    });

    test("should allow randomizer to be overridden", () => {
      randomizer = new MockSequenceRandomizer([1, 2, 3]);
      const randomizerSpy = jest.spyOn(randomizer, "generate");
      roll.roll(0, {randomizer});
      expect(randomizerSpy).toHaveBeenCalledWith(1, 20);
    });
  });

  describe("rollAdvantage", () => {
    test("should call roll with advantage mechanic", () => {
      const rollSpy = jest.spyOn(roll, "roll").mockImplementation(() => ({
        natural: 10,
        modified: 10,
        rolls: [10, 10],
      }));
      roll.rollAdvantage(2);

      // Check that the roll method was called with the correct parameters
      expect(rollSpy).toHaveBeenCalledWith(
        2,
        expect.objectContaining({
          mechanic: expect.any(AdvantageMechanic),
        })
      );
    });
  });

  describe("rollDisadvantage", () => {
    test("should call roll with disadvantage mechanic", () => {
      const rollSpy = jest.spyOn(roll, "roll").mockImplementation(() => ({
        natural: 10,
        modified: 10,
        rolls: [10, 10],
      }));
      roll.rollDisadvantage(2);

      // Check that the roll method was called with the correct parameters
      expect(rollSpy).toHaveBeenCalledWith(
        2,
        expect.objectContaining({
          mechanic: expect.any(DisadvantageMechanic),
        })
      );
    });
  });
});

describe("Roll edge cases and config", () => {
  test("should return min when min = max", () => {
    const roll = new Roll(7, 7);
    const result = roll.roll();
    expect(result.natural).toBe(7);
    expect(result.rolls).toEqual([7]);
  });

  test("should throw for min > max", () => {
    expect(() => new Roll(10, 1).roll()).toThrow();
  });

  test("should throw for negative min or max", () => {
    expect(() => new Roll(-1, 10).roll()).toThrow();
    expect(() => new Roll(1, -10).roll()).toThrow();
  });

  test("should throw for float min or max", () => {
    expect(() => new Roll(1.5, 10).roll()).toThrow();
    expect(() => new Roll(1, 10.5).roll()).toThrow();
  });

  test("should work with default construction (no config)", () => {
    const roll = new Roll(1, 6);
    const result = roll.roll();
    expect(result.natural).toBeGreaterThanOrEqual(1);
    expect(result.natural).toBeLessThanOrEqual(6);
  });

  test("should allow both mechanic and randomizer override", () => {
    const roll = new Roll(1, 20);
    const mockMechanic = {do: jest.fn().mockReturnValue({result: 5, rolls: [5]})};
    const mockRandomizer = {generate: jest.fn(() => 5)} as any;
    const result = roll.roll(0, {mechanic: mockMechanic, randomizer: mockRandomizer});
    expect(result.natural).toBe(5);
    expect(mockMechanic.do).toHaveBeenCalledWith(1, 20, mockRandomizer);
  });

  test("rollAdvantage should allow overrideDefaults", () => {
    const roll = new Roll(1, 20);
    const mockRandomizer = {generate: jest.fn(() => 5)} as any;
    const result = roll.rollAdvantage(0, {randomizer: mockRandomizer});
    expect(result.rolls.length).toBe(2);
  });

  test("rollDisadvantage should allow overrideDefaults", () => {
    const roll = new Roll(1, 20);
    const mockRandomizer = {generate: jest.fn(() => 5)} as any;
    const result = roll.rollDisadvantage(0, {randomizer: mockRandomizer});
    expect(result.rolls.length).toBe(2);
  });

  test("should handle undefined or NaN modifier as 0", () => {
    const roll = new Roll(1, 20, {randomizer: new MockReturn10Randomizer()});
    expect(roll.roll(undefined as any).modified).toBe(10);
    expect(roll.roll(NaN).modified).toBe(10);
  });

  test("should support mechanic that returns custom rolls array", () => {
    const roll = new Roll(1, 20);
    const customMechanic = {do: jest.fn().mockReturnValue({result: 42, rolls: [1, 2, 3]})};
    const result = roll.roll(0, {mechanic: customMechanic});
    expect(result.natural).toBe(42);
    expect(result.rolls).toEqual([1, 2, 3]);
  });
});
