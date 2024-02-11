export type Chronicle<Event> = {
  addEvent: (newEvent: Event, onAddEvent?: (addedEvent: Event) => void) => void
  getAllEvents: () => Event[]
  getCurrentEvent: () => Event
  getPastEvents: () => Event[]
  transformInternalEvents: (eventTransformer: (event: Event) => Event) => Event[] // this will transform the internal Events
}

type CreateChronicleOptions<Event> = {
  onAddEvent?: (entry: Event) => void
}

export function createChronicle<Event>(initialEvent: Event, options?: CreateChronicleOptions<Event>): Chronicle<Event> {
  let currentEvent: Event
  let pastEvents: Event[]

  const initialize = () => {
    currentEvent = structuredClone(initialEvent)
    pastEvents = []

    options?.onAddEvent?.(structuredClone(initialEvent))
  }

  initialize()

  return {
    addEvent(newEvent: Event, onAddEvent) {
      pastEvents = [currentEvent, ...pastEvents]
      // Important to not mutate currentEvent until after setting pastEvents
      currentEvent = structuredClone(newEvent)

      // Chronicle callback
      options?.onAddEvent?.(structuredClone(newEvent))

      // Local callback
      onAddEvent?.(newEvent)
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
