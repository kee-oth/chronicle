import { describe, expect, it, vi } from 'vitest'
import { ChronicleError } from './'

describe('the ChronicleError class', () => {
  it('should create an initial Event on Chronicle creation', () => {
    // Setup
    const initialEvent = 'Initial event'

    // Test
    const chronicleError = new ChronicleError(initialEvent, 'Error!')

    // Assert
    expect(chronicleError.getCurrentEvent()).toEqual(initialEvent)
  })

  it('should allow adding a new Event and use it as the current Event', () => {
    // Setup
    const initialEvent = 'Initial event'
    const eventToAdd = 'Event to add'
    const chronicleError = new ChronicleError(initialEvent, 'Error!')

    // Test
    chronicleError.addEvent(eventToAdd)
    // Assert
    expect(chronicleError.getCurrentEvent()).toEqual(eventToAdd)
  })

  it('should allow adding a new Event and move the original Event to past Events', () => {
    // Setup
    const initialEvent = 'Initial event'
    const eventToAdd = 'Event to add'
    const chronicleError = new ChronicleError(initialEvent, 'Error!')

    // Test
    chronicleError.addEvent(eventToAdd)

    // Assert
    const isInitialEventInPastEvents = chronicleError.getPastEvents().includes(initialEvent)
    expect(isInitialEventInPastEvents).toBe(true)
  })

  it('should allow getting all Events', () => {
    // Setup
    const firstEvent = 'First event'
    const secondEvent = 'Second event'
    const thirdEvent = 'Third event'
    const chronicleError = new ChronicleError(firstEvent, 'Error!')

    // Test
    chronicleError.addEvent(secondEvent)
    chronicleError.addEvent(thirdEvent)

    // Assert
    const isFirstlEventInAllEvents = chronicleError.getAllEvents().includes(firstEvent)
    const isSecondEventInAllEvents = chronicleError.getAllEvents().includes(secondEvent)
    const isThirdEventInAllEvents = chronicleError.getAllEvents().includes(thirdEvent)
    const areBothEventsInAllEvents = isFirstlEventInAllEvents && isSecondEventInAllEvents && isThirdEventInAllEvents
    expect(areBothEventsInAllEvents).toBe(true)
  })

  it('should order past Events from new to old', () => {
    // Setup
    const currentEvent = 'Current event'
    const events = [
      'Third event',
      'Second event',
      'First event',
    ]
    const chronicleError = new ChronicleError(events[2], 'Error!')
    chronicleError.addEvent(events[1])
    chronicleError.addEvent(events[0])
    chronicleError.addEvent(currentEvent)
    const pastEvents = chronicleError.getPastEvents()

    // Test
    const isPastEventsInOrderFromNewToOld = pastEvents.reduce((_, pastEvent, currentIndex) => {
      return pastEvent === events[currentIndex]
    }, false)

    // Assert
    expect(isPastEventsInOrderFromNewToOld).toBe(true)
  })

  it('should order all Events from new to old', () => {
    // Setup
    const events = [
      'Third event',
      'Second event',
      'First event',
    ]
    const chronicleError = new ChronicleError(events[2], 'Error!')
    chronicleError.addEvent(events[1])
    chronicleError.addEvent(events[0])
    const allEvents = chronicleError.getAllEvents()

    // Test
    const isAllEventsInOrderFromNewToOld = allEvents.reduce((_, event, currentIndex) => {
      return event === events[currentIndex]
    }, false)

    // Assert
    expect(isAllEventsInOrderFromNewToOld).toBe(true)
  })

  it('should run Chronicle onAddEvent callback when adding an event', () => {
    // Setup
    const onAddEvent = vi.fn()

    // Test
    const chronicleError = new ChronicleError<string>('First event', 'Error!', { onAddEvent })
    chronicleError.addEvent('Second event')

    // Assert
    expect(onAddEvent).toHaveBeenCalledTimes(2)
    expect(onAddEvent).toHaveBeenCalledWith('First event')
    expect(onAddEvent).toHaveBeenCalledWith('Second event')
  })

  it('should run local onAddEvent callback when adding an event', () => {
    // Setup
    const onAddEvent = vi.fn()

    // Test
    const chronicleError = new ChronicleError<string>('First event', 'Error!')
    chronicleError.addEvent('Second event', onAddEvent)

    // Assert
    expect(onAddEvent).toHaveBeenCalledTimes(1)
    expect(onAddEvent).toHaveBeenCalledWith('Second event')
  })

  it('should identify as an Error', () => {
    // Setup
    const chronicleError = new ChronicleError('First event', 'Error!')

    // Assert
    expect(chronicleError instanceof Error).toBe(true)
  })
})
