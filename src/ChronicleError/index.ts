import { Chronicle, type CreateChronicleOptions } from '../Chronicle'

type ErrorConstructorParameters = ConstructorParameters<typeof Error>
type ErrorMessage = ErrorConstructorParameters[0]
type ErrorOptions = ErrorConstructorParameters[1]

type CreateChronicleErrorOptions<Event, CompareEventsWith> = {
  errorOptions?: ErrorOptions
} & CreateChronicleOptions<Event, CompareEventsWith>

export class ChronicleError<Event, CompareEventsWith = Event> extends Error {
  declare chronicle: Chronicle<Event, CompareEventsWith>

  constructor(initialEvent: Event, errorMessage: ErrorMessage, options?: CreateChronicleErrorOptions<Event, CompareEventsWith>) {
    super(errorMessage, options?.errorOptions)

    this.chronicle = new Chronicle<Event, CompareEventsWith>(initialEvent, {
      comparator: options?.comparator,
      onAddEvent: options?.onAddEvent,
    })
  }

  addEvent(newEvent: Event, onAddEvent?: (addedEvent: Event, chronicleId: string) => void) {
    return this.chronicle.addEvent(newEvent, onAddEvent)
  }

  getCurrentEvent() {
    return this.chronicle.getCurrentEvent()
  }

  getPastEvents() {
    return this.chronicle.getPastEvents()
  }

  getAllEvents() {
    return [this.chronicle.getCurrentEvent(), ...this.chronicle.getPastEvents()]
  }

  getId() {
    return this.chronicle.getId()
  }

  includes(event: Event): boolean {
    return this.chronicle.includes(event)
  }

  transformInternalEvents(eventTransformer: (event: Event) => Event): Event[] {
    return this.chronicle.transformInternalEvents(eventTransformer)
  }

  timerStart(label: string) {
    this.chronicle.timerStart(label)
  }

  timerLog(label: string, ...args: unknown[]) {
    this.chronicle.timerLog(label, ...args)
  }

  timerEnd(label: string) {
    this.chronicle.timerEnd(label)
  }
}
