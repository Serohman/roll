import {Randomizer} from "../randomizer/Randomizer";
import {MockReturn10Randomizer, MockSequenceRandomizer, MockThrowRandomizer} from "../randomizer/Randomizer.test";
import {AdvantageMechanic} from "./AdvantageMechanic";

describe("AdvantageBehahviour", () => {
  let mechanic = new AdvantageMechanic();
  let randomizer: Randomizer;

  describe("do", () => {
    test("should call randomizer.generate with correct parameters", () => {
      randomizer = new MockReturn10Randomizer();
      const spy = jest.spyOn(randomizer, "generate");
      mechanic.do(1, 2, randomizer);
      expect(spy).toHaveBeenCalledWith(1, 2);
    });

    test("should call randomizer.generate twice", () => {
      randomizer = new MockReturn10Randomizer();
      const spy = jest.spyOn(randomizer, "generate");
      mechanic.do(3, 4, randomizer);
      expect(spy).toHaveBeenNthCalledWith(1, 3, 4);
      expect(spy).toHaveBeenNthCalledWith(2, 3, 4);
    });

    test("should return the higher number of two rolls", () => {
      const randomizerLowerFirst = new MockSequenceRandomizer([5, 6]);
      const randomizerLowerSecond = new MockSequenceRandomizer([6, 5]);
      const {result: resultA} = mechanic.do(1, 10, randomizerLowerFirst);
      const {result: resultB} = mechanic.do(1, 10, randomizerLowerSecond);
      expect(resultA).toBe(6);
      expect(resultB).toBe(6);
    });

    test("should return the rolls history", () => {
      const randomizer = new MockSequenceRandomizer([5, 6]);
      const {result, rolls} = mechanic.do(1, 10, randomizer);
      expect(result).toBe(6);
      expect(rolls).toEqual([5, 6]);
    });

    test("should throw an error if randomizer.generate throws an error", () => {
      const errorMock = new MockThrowRandomizer();
      expect(() => {
        mechanic.do(1, 10, errorMock);
      }).toThrow(Error);
    });
  });
});

describe("AdvantageMechanic edge cases", () => {
  const mechanic = new AdvantageMechanic();
  const randomizer = {
    generate: jest.fn((min) => min),
  } as any;

  test("should return min when min = max", () => {
    const minMax = 7;
    const {result, rolls} = mechanic.do(minMax, minMax, randomizer);
    expect(result).toBe(minMax);
    expect(rolls).toEqual([minMax, minMax]);
  });

  test("should handle negative min and max", () => {
    const {result, rolls} = mechanic.do(-5, -1, randomizer);
    expect(result).toBe(-5);
    expect(rolls).toEqual([-5, -5]);
  });

  test("should handle float min and max", () => {
    const {result, rolls} = mechanic.do(1.5, 2.5, randomizer);
    expect(result).toBe(1.5);
    expect(rolls).toEqual([1.5, 1.5]);
  });
});
