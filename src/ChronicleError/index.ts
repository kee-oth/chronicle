import { Chronicle, type CreateChronicleOptions } from '../Chronicle'

type ErrorConstructorParameters = ConstructorParameters<typeof Error>
type ErrorMessage = ErrorConstructorParameters[0]
type ErrorOptions = ErrorConstructorParameters[1]

type CreateChronicleErrorOptions<Event> = {
  errorOptions?: ErrorOptions
} & CreateChronicleOptions<Event>

export class ChronicleError<Event> extends Error {
  declare chronicle: Chronicle<Event>

  constructor(initialEvent: Event, errorMessage: ErrorMessage, options?: CreateChronicleErrorOptions<Event>) {
    super(errorMessage, options?.errorOptions)

    this.chronicle = new Chronicle(initialEvent, {
      onAddEvent: options?.onAddEvent,
    })
  }

  addEvent(newEvent: Event, onAddEvent?: (addedEvent: Event) => void) {
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
}
