# Dice Rolling Library

This library provides a flexible and extensible system for rolling dice in tabletop RPGs, simulations, or any other applications requiring randomized results.

## Table of content

- [Installation](#installation)
- [Quick Start](#usage)
- [Extending](#extending)
  - [Mechanic](#mechanic)
  - [Randomizer](#randomizer)

## Installation

Install the library via npm:

```
npm install @seroh/roll
```

## Quick Start

Basic example showing how to create a roll.

```
import { Roll } from '@seroh/roll';

const atk = new Roll(1, 20); // 1d20
const result = attack.roll();
console.log(`Natural Roll: ${result.natural});
```

Add modifier:

```
...
const result = attack.roll({modifier: -1});
console.log(`Natural Roll: ${natural}, modified: ${modified}`);
```

Roll advantage/disadvantage:

```
...
const advantageResult = attack.rollAdvantage();
const disadvantageResult = attack.rollDisadvantage();
```

[See the list of built-in mechanics](#tba)

## Extending

### Mechanic

Implementing mechanic allows you to control the rules by which the dice is ruled

```
immport { Roll, Randomizer } from "@seroh/roll"

class KarmicRandomizer extends Randomizer {
  protected func(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

const atk = new Roll(1,20, new RandomizerDefault()); // 1d20
const result = atk.roll(); // This roll is now affected by KarmicRandomizer

```

### Randomizer

Developers can implement a custom randomizer to control the dice’s randomness. Below is an example of a KarmicRandomizer:

```
immport { Roll, Randomizer } from "@seroh/roll"

class KarmicRandomizer extends Randomizer {
  protected func(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

const atk = new Roll(1,20, new RandomizerDefault()); // 1d20
const result = atk.roll(); // This roll is now affected by KarmicRandomizer

```
