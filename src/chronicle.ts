interface Chronicle<Event> {
  getCurrentEvent: () => Event
  getPastEvents: () => Event[]
  getAllEvents: () => Event[]
  addEvent: (newEvent: Event) => ThisType<Event> // This mutates the Chronicle and returns it (as `this`)
  transformInternalEvents: (eventTransformer: (event: Event) => Event) => Event[] // this will transform the internal Events
}

export function createChronicle<Event>(initialEvent: Event): Chronicle<Event> {
  let currentEvent: Event = initialEvent
  let pastEvents: Event[] = []

  return {
    addEvent(newEvent) {
      pastEvents = [currentEvent, ...pastEvents]
      // Important to not mutate currentEvent until after setting pastEvents
      currentEvent = newEvent
      return this
    },
    getCurrentEvent: () => structuredClone(currentEvent),
    getPastEvents: () => structuredClone(pastEvents),
    getAllEvents: () => structuredClone([currentEvent, ...pastEvents]),
    transformInternalEvents(eventTransformer): Event[] {
      // TODO: handle errors

      // Transform the Events
      const transformedEvents = this.getAllEvents().map((event) =>
        eventTransformer(event),
      )

      // Update Chronicle Event properties with the transformed Events
      const [transformedCurrentEvent, ...transformedPastEvents]
        = transformedEvents
      currentEvent = transformedCurrentEvent
      pastEvents = transformedPastEvents

      // Return a clone of the `transformedEvents` so nothing can accidentally change a Chronicle's Events
      return structuredClone(transformedEvents)
    },
  }
}
