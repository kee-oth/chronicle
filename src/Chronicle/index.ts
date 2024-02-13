export type CreateChronicleOptions<Event> = {
  onAddEvent?: (event: Event, chronicleId: string) => void
}

// Export from package as type, only export  "createChronicle" function
export class Chronicle<Event> {
  declare private currentEvent: Event
  declare private pastEvents: Event[]
  declare private onAddEvent: ((event: Event, chronicleId: string) => void) | undefined

  private id = crypto.randomUUID()

  constructor(initialEvent: Event, options?: CreateChronicleOptions<Event>) {
    this.currentEvent = initialEvent
    this.pastEvents = []
    this.onAddEvent = options?.onAddEvent

    options?.onAddEvent?.(initialEvent, this.id)
  }

  // (newEvent: Event, onAddEvent?: (addedEvent: Event) => void) => void
  addEvent(newEvent: Event, onAddEvent?: (addedEvent: Event, chronicleId: string) => void) {
    this.pastEvents = [this.currentEvent, ...this.pastEvents]
    // Important to not mutate currentEvent until after setting pastEvents
    this.currentEvent = newEvent

    // Chronicle callback
    this.onAddEvent?.(newEvent, this.id)

    // Local callback
    onAddEvent?.(newEvent, this.id)
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

  getId() {
    return this.id
  }

  // this will transform the internal Events
  transformInternalEvents(eventTransformer: (event: Event) => Event): Event[] {
    // Transform the Events
    const transformedEvents = this.getAllEvents().map(eventTransformer)

    // Update Chronicle Event properties with the transformed Events
    const [transformedCurrentEvent, ...transformedPastEvents] = transformedEvents
    this.currentEvent = transformedCurrentEvent
    this.pastEvents = transformedPastEvents

    return transformedEvents
  }

  timerStart(label: string) {
    // eslint-disable-next-line no-console
    console.time(label)
  }

  timerLog(label: string, ...args: unknown[]) {
    // eslint-disable-next-line no-console
    console.timeLog(label, ...args)
  }

  timerEnd(label: string) {
    // eslint-disable-next-line no-console
    console.timeEnd(label)
  }
}

export const createChronicle = <Event>(initialEvent: Event, options?: CreateChronicleOptions<Event>) => new Chronicle(initialEvent, options)
