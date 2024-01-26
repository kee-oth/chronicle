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

* Error tracing
* Logging
* Performance profiling


## Project goals

Chronicle should be
* Robust – Chronicle should be reliable and never cause you issues
* Predictable – Chronicle shouldn't do anything unexpected
* Intuitive & ergonomic – Chronicle should be easy to use


## Quick examples

### Basic usage
```ts
// Create a Chronicle of your custom Event type (`string` in this example)
const myChronicle = createChronicle<string>("First event");

// Add some records to your Chronicle
myChronicle.addRecord("Second event")
myChronicle.addRecord("Third event")

// Access the most recently added Event
myChronicle.currentEvent // "First event"

// Access past Events
myChronicle.pastEvents // [ "Second event", "Third event" ]

// Access all Events
myChronicle.allEvents // [ "Second event", "Third event" ]
```

You don't need to specify the generic if you don't want to – TypeScript will infer the correct type itself.
```ts
const myChronicle = createChronicle("First event"); // TypeScript will infer Chronicle<string>
```


### Chronicling errors via a custom Failure type
```ts
type Failure = {
  name: string;
  reason?: string;
};

const failureChronicle = createChronicle<Failure>({
  name: 'FAILURE_A',
  reason: 'Cannot divide by 0.',
});

failureChronicle.addEvent({
  name: 'FAILURE_B',
});
failureChronicle.addEvent({
  name: 'FAILURE_C',
});

failureChronicle.allEvents 

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

Transform a Chronicle's Events
```ts
const deepCopyOfEvents = failureChronicle.transformEvents((failure) => ({
  ...failure,
  name: `TRANSFORMED_${failure.name}`,
}));
```
Note that tranforming a Chronicle's Events _will_ set the Chronicle's Events to the tranformed Events. `transformEvents` will return a deep clone of the transformed Events.

If all you want to do is transform a Chronicle's Events and _not_ actually update them within the Chronicle, you can use `getEvents`. 
```ts
const retrievedEvents = failureChronicle.getEvents((failures) => {
  return failures.map((failure) => failure.name).join(', ');
});

retrievedEvents
```
