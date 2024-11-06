export * from "./randomizer/Randomizer";
export * from "./randomizer/SimpleRandomizer";

export * from "./mechanic/Mechanic";
export * from "./mechanic/SingleRollMechanic";
export * from "./mechanic/AdvantageMechanic";
export * from "./mechanic/DisadvantageMechanic";

export * from "./roll/Roll";

// import { advantageMechanic } from "./mechanic/mechanic";
// // Basic example
// import { Roll } from "./roll/roll";

// const modifier = 2;
// const atk = new Roll(1, 20); // 1d20
// const { natural, modified } = atk.roll({ modifier });
// console.log(`Attack roll: ${modified} (${natural} + ${modifier})`);

// // Modifying mechanic for all rolls
// const atk = new Roll({
//   min: 1,
//   max: 20,
//   mechanic: advantageMechanic
// }); // 1d20
// const { natural, modified } = atk.roll({ modifier });
// console.log(`Attack roll: ${modified} (${natural} + ${modifier})`);
