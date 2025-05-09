export class DiceRollError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DiceRollError";
    Object.setPrototypeOf(this, DiceRollError.prototype);
  }
}
