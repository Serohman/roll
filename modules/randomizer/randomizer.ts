export abstract class Randomizer {
  protected abstract generator(min: number, max: number): number;

  generate(min: number, max: number): number {
    this.validateMinMax(min, max);
    return this.generator(min, max);
  }

  validateMinMax(min: number, max: number): void {
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
      throw new Error(
        `Invalid range: Both minimum (${min}) and maximum (${max}) values must be integers.`
      );
    }
    if (min < 1 || max < 1) {
      throw new Error(
        `Invalid range: Both minimum (${min}) and maximum (${max}) values must be positive integers greater than zero.`
      );
    }
    if (min > max) {
      throw new Error(
        `Invalid range: The minimum value (${min}) cannot be greater than the maximum value (${max}).`
      );
    }
  }
}
