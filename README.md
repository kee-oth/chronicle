# Chronicle

## 🚧 Work in progress! 🚧

Chronicle's API is subject to change. (We have a lot of ideas! 😁)

Please check back later to see the improvements. And note that this Readme currently acts as the official and only set of documentation.

Please open an issue if you want to

* request a feature
* request documentation clarification
* report a bug

## What is Chronicle?

Chronicle is a tracing library that lets you trace arbitrary code execution flows within you JavaScript or TypeScript application.

Chronicle has 0 dependencies and is very small (less than 1kb!).

### What is Chronicle useful for?

Glad you asked! Here are some common use cases:

* Context passing for control flow decisions
* Error tracing
* Logging
* Performance profiling
* Debugging

## Project goals

Chronicle should be
* Robust – Chronicle should be reliable and never cause you issues
* Predictable – Chronicle shouldn't do anything unexpected
* Intuitive & ergonomic – Chronicle should be easy to use

## Installation
```bash
npm add @keeoth/chronicle
yarn add @keeoth/chronicle
pnpm add @keeoth/chronicle
```

## Quick examples

### Basic usage
```ts
// Create a Chronicle of your custom Event type (`string` in this example)
const myChronicle = createChronicle<string>('First event')

// Add some Events to your Chronicle
myChronicle.addEvent('Second event')
myChronicle.addEvent('Third event')

// Access the most recently added Event
myChronicle.getCurrentEvent() // "Third event"

// Access past Events
myChronicle.getPastEvents() // [ "Second event", "First event" ]

// Access all Events
myChronicle.getAllEvents() // [ "Third event", "Second event", "First event" ]
```

You don't need to specify the generic if you don't want to – TypeScript will infer the correct type itself.
```ts
const myChronicle = createChronicle('First event') // TypeScript will infer Chronicle<string>
```

### Chronicling errors via a custom Failure type
```ts
interface Failure {
  name: string
  reason?: string
}

const failureChronicle = createChronicle<Failure>({
  name: 'FAILURE_A',
  reason: 'Cannot divide by 0.',
})

failureChronicle.addEvent({
  name: 'FAILURE_B',
})
failureChronicle.addEvent({
  name: 'FAILURE_C',
})

failureChronicle.getAllEvents()

/*
Results in
[
  {
    name: 'FAILURE_C',
  },
  {
    name: 'FAILURE_B',
  },
  {
    name: 'FAILURE_A',
    reason: 'Cannot divide by 0.',
  }
]
*/
```

Transform a Chronicle's internal Events
```ts
const someChronicle = createChronicle('Initial event')

const deepCopyOfEvents = someChronicle.transformInternalEvents((event) => {
  return `Transformed ${event}`
})

deepCopyOfEvents // ["Transformed Initial event"]
someChronical.getAllEvents() // ["Transformed Initial event"]

deepCopyOfEvents === someChronical.getAllEvents() // false
```
Note that tranforming a Chronicle's Events _will_ set the Chronicle's Events to the tranformed Events. `transformInternalEvents` will return a deep clone of the transformed Events. The return value of the
passed in transformation function must match the Chronicle's Event type.
