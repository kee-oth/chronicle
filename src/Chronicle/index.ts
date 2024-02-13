export type CreateChronicleOptions<Event, CompareWith> = {
  comparator?: (eventToCompare: Event, compareWith: CompareWith) => boolean
  onAddEvent?: (event: Event, chronicleId: string) => void
}

// Export from package as type, only export  "createChronicle" function
export class Chronicle<Event, CompareEventsWith = Event> {
  declare private currentEvent: Event
  declare private pastEvents: Event[]
  declare private onAddEvent: ((event: Event, chronicleId: string) => void) | undefined

  private comparator = (eventToCompare: Event, compareWith: CompareEventsWith) => {
    return eventToCompare === (compareWith as unknown as Event)
  }

  private id = crypto.randomUUID()

  constructor(initialEvent: Event, options?: CreateChronicleOptions<Event, CompareEventsWith>) {
    this.currentEvent = initialEvent
    this.pastEvents = []
    this.onAddEvent = options?.onAddEvent
    this.comparator = options?.comparator || this.comparator

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

  includes<T = CompareEventsWith>(itemToCompare: T): boolean {
    return Boolean(this.getAllEvents().find((existingEvent) => this.comparator(existingEvent, itemToCompare)))
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

export const createChronicle = <Event, Comparator>(initialEvent: Event, options?: CreateChronicleOptions<Event, Comparator>) => new Chronicle<Event, Comparator>(initialEvent, options)
