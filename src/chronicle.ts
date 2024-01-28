type Chronicle<Event> = {
  addEvent: (newEvent: Event) => ThisType<Event> // This mutates the Chronicle and returns it (as `this`)
  getAllEvents: () => Event[]
  getCurrentEvent: () => Event
  getPastEvents: () => Event[]
  transformInternalEvents: (eventTransformer: (event: Event) => Event) => Event[] // this will transform the internal Events
}

type CreateChronicleOptions<Event> = {
  onAddEntry?: (entry: Event) => void
}

export function createChronicle<Event>(initialEvent: Event, options?: CreateChronicleOptions<Event>): Chronicle<Event> {
  let currentEvent: Event
  let pastEvents: Event[]

  const initialize = () => {
    currentEvent = structuredClone(initialEvent)
    pastEvents = []

    options?.onAddEntry?.(structuredClone(initialEvent))
  }

  initialize()

  return {
    addEvent(newEvent) {
      pastEvents = [currentEvent, ...pastEvents]
      // Important to not mutate currentEvent until after setting pastEvents
      currentEvent = structuredClone(newEvent)
      options?.onAddEntry?.(structuredClone(newEvent))
      return this
    },
    getCurrentEvent: () => structuredClone(currentEvent),
    getPastEvents: () => structuredClone(pastEvents),
    getAllEvents: () => structuredClone([currentEvent, ...pastEvents]),
    transformInternalEvents(eventTransformer): Event[] {
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
