export type CreateChronicleOptions<Event> = {
  onAddEvent?: (entry: Event) => void
}

// Export from package as type, only export  "createChronicle" function
export class Chronicle<Event> {
  declare private currentEvent: Event
  declare private pastEvents: Event[]
  declare private onAddEvent: ((entry: Event) => void) | undefined

  constructor(initialEvent: Event, options?: CreateChronicleOptions<Event>) {
    this.currentEvent = initialEvent
    this.pastEvents = []
    this.onAddEvent = options?.onAddEvent

    options?.onAddEvent?.(initialEvent)
  }

  // (newEvent: Event, onAddEvent?: (addedEvent: Event) => void) => void
  addEvent(newEvent: Event, onAddEvent?: (addedEvent: Event) => void) {
    this.pastEvents = [this.currentEvent, ...this.pastEvents]
    // Important to not mutate currentEvent until after setting pastEvents
    this.currentEvent = newEvent

    // Chronicle callback
    this.onAddEvent?.(newEvent)

    // Local callback
    onAddEvent?.(newEvent)
  }

  getCurrentEvent() {
    return this.currentEvent
  }

  getPastEvents() {
    return this.pastEvents
  }

  getAllEvents() {
    return [this.currentEvent, ...this.pastEvents]
  }

  // (eventTransformer: (event: Event) => Event) => Event[] // this will transform the internal Events
  transformInternalEvents(eventTransformer: (event: Event) => Event): Event[] {
    // Transform the Events
    const transformedEvents = this.getAllEvents().map(eventTransformer)

    // Update Chronicle Event properties with the transformed Events
    const [transformedCurrentEvent, ...transformedPastEvents] = transformedEvents
    this.currentEvent = transformedCurrentEvent
    this.pastEvents = transformedPastEvents

    return transformedEvents
  }
}

export const createChronicle = (initialEvent: Event, options?: CreateChronicleOptions<Event>) => new Chronicle(initialEvent, options)

// Consider Set or Map
// instanciatchronicale in another file and import to relevant ones? Connectsl them together? Able to follow a "flow"? Won't be specific tp an individual request though, right? use ids somehow?
