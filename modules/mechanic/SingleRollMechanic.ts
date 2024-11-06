import { Randomizer } from "../randomizer/Randomizer";
import { Mechanic } from "./Mechanic";

export class SingleRollMechanic extends Mechanic {
  do(min: number, max: number, randomizer: Randomizer) {
    return randomizer.generate(min, max);
  }
}
