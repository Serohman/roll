import {Randomizer} from "../randomizer/Randomizer";
import {MockReturn10Randomizer, MockThrowRandomizer} from "../randomizer/Randomizer.test";
import {SingleRollMechanic} from "./SingleRollMechanic";

describe("SingleRoll", () => {
  let mechanic = new SingleRollMechanic();
  let randomizer: Randomizer = new MockReturn10Randomizer();

  describe("do", () => {
    test("should call randomizer.generate with correct parameters", () => {
      const spy = jest.spyOn(randomizer, "generate");
      const min = 3;
      const max = 7;
      mechanic.do(min, max, randomizer);
      expect(spy).toHaveBeenCalledWith(min, max);
    });

    test("should return value from randomizer.generate for valid min and max", () => {
      const min = 1;
      const max = 10;
      const {result, rolls} = mechanic.do(min, max, randomizer);
      expect(result).toBe(10);
      expect(rolls).toEqual([10]);
    });

    test("should throw an error if randomizer.generate throws an error", () => {
      const errorMock = new MockThrowRandomizer();
      expect(() => {
        mechanic.do(1, 10, errorMock);
      }).toThrow(Error);
    });
  });
});

describe("SingleRollMechanic edge cases", () => {
  const mechanic = new SingleRollMechanic();
  const randomizer = {
    generate: jest.fn((min) => min),
  } as any;

  test("should return min when min = max", () => {
    const minMax = 7;
    const {result, rolls} = mechanic.do(minMax, minMax, randomizer);
    expect(result).toBe(minMax);
    expect(rolls).toEqual([minMax]);
  });

  test("should handle negative min and max", () => {
    const {result, rolls} = mechanic.do(-5, -1, randomizer);
    expect(result).toBe(-5);
    expect(rolls).toEqual([-5]);
  });

  test("should handle float min and max", () => {
    const {result, rolls} = mechanic.do(1.5, 2.5, randomizer);
    expect(result).toBe(1.5);
    expect(rolls).toEqual([1.5]);
  });
});
