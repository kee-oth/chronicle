type Chronicle<Event> = {
  currentEvent: Event;
  pastEvents: Event[];
  allEvents: Event[];
  addEvent: (newEvent: Event) => ThisType<Event>; // This mutates the Chronicle and returns it (as `this`)
  transformEvents: (eventTransformer: (event: Event) => Event) => Event[]; // this will transform the internal Events
  getEvents: <TransformationReturnValue>(
    eventsTransformer: (events: Event[]) => TransformationReturnValue
  ) => TransformationReturnValue; // this will NOT transform the internal Events, but will return your the Events transformed by your function
};

export function createChronicle<Event>(initialEvent: Event): Chronicle<Event> {
  return {
    // Properties
    currentEvent: initialEvent,
    pastEvents: [],

    // Getters
    get allEvents() {
      return [this.currentEvent, ...this.pastEvents];
    },

    // Functions
    addEvent: function (newEvent) {
      this.pastEvents = [this.currentEvent, ...this.pastEvents];
      // Important to not mutate currentEvent until after setting pastEvents
      this.currentEvent = newEvent;
      return this;
    },
    transformEvents: function (eventTransformer): Event[] {
      // TODO: handle errors, validate transformation with Zod?

      // Transform the Events
      const transformedEvents = this.allEvents.map((event) =>
        eventTransformer(event)
      );

      // Update Chronicle Event properties with the transformed Events
      // Cloning in case the user-provided `transformer` function grabbed references to the Events
      const [transformedCurrentEvent, ...transformedPastEvents] =
        structuredClone(transformedEvents);
      this.currentEvent = transformedCurrentEvent;
      this.pastEvents = transformedPastEvents;

      // Return a clone of the `transformedEvents` so nothing can accidentally change a Chronicle's Events
      return structuredClone(transformedEvents);
    },
    getEvents: function (eventsTransformer) {
      return eventsTransformer(structuredClone(this.allEvents));
    },
  };
}
