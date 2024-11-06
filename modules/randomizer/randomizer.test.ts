import { Randomizer } from "./Randomizer"; // Adjust the import based on your file structure

describe("Randomizer", () => {
  let randomizer: MockReturn10Randomizer;

  beforeEach(() => {
    randomizer = new MockReturn10Randomizer();
  });

  describe("validateMinMax", () => {
    test("should not throw for valid min and max", () => {
      expect(() => randomizer.validateMinMax(1, 10)).not.toThrow(Error);
      expect(() => randomizer.validateMinMax(1, 1)).not.toThrow(Error);
    });

    test("should throw if min is greater than max", () => {
      expect(() => randomizer.validateMinMax(10, 1)).toThrow(Error);
      expect(() => randomizer.validateMinMax(5, 3)).toThrow(
        "Invalid range: The minimum value (5) cannot be greater than the maximum value (3)."
      );
    });

    test("should throw if min or max is not positive", () => {
      expect(() => randomizer.validateMinMax(-1, 10)).toThrow(Error);
      expect(() => randomizer.validateMinMax(1, -10)).toThrow(Error);
      expect(() => randomizer.validateMinMax(0, 10)).toThrow(Error);
      expect(() => randomizer.validateMinMax(1, 0)).toThrow(Error);
      expect(() => randomizer.validateMinMax(0, -1)).toThrow(
        "Invalid range: Both minimum (0) and maximum (-1) values must be positive integers greater than zero."
      );
    });

    test("should throw if min or max is not an integer", () => {
      expect(() => randomizer.validateMinMax(1.5, 10)).toThrow(Error);
      expect(() => randomizer.validateMinMax(1, 10.5)).toThrow(Error);
      expect(() => randomizer.validateMinMax(1.5, 10.5)).toThrow(
        `Invalid range: Both minimum (1.5) and maximum (10.5) values must be integers.`
      );
    });
  });

  describe("generate", () => {
    test("should call 'validateMinMax' with the provided min and max", () => {
      const validateSpy = jest.spyOn(randomizer, "validateMinMax");
      randomizer.generate(1, 10);
      expect(validateSpy).toHaveBeenCalledWith(1, 10);
      validateSpy.mockRestore();
    });

    test("should return a value that falls within the specified range", () => {
      const result = randomizer.generate(1, 10);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
    });
  });
});

export class MockReturn10Randomizer extends Randomizer {
  protected generator(min: number, max: number): number {
    return 10;
  }
}

export class MockThrowRandomizer extends Randomizer {
  protected generator(min: number, max: number): number {
    throw new Error("Randomizer Error");
  }
}

export class MockSequenceRandomizer extends Randomizer {
  counter = -1;

  constructor(private sequence: number[]) {
    super();
  }

  protected generator(min: number, max: number): number {
    this.counter++;
    return this.sequence[this.counter];
  }
}
