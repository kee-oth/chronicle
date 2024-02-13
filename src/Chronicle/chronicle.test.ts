import { describe, expect, it, vi } from 'vitest'
import { createChronicle } from '..'

describe('createChronicle', () => {
  it('should create an initial Event on Chronicle creation', () => {
    // Setup
    const initialEvent = 'Initial event'

    // Test
    const chronicle = createChronicle(initialEvent)

    // Assert
    expect(chronicle.getCurrentEvent()).toEqual(initialEvent)
  })

  it('should allow adding a new Event and use it as the current Event', () => {
    // Setup
    const initialEvent = 'Initial event'
    const eventToAdd = 'Event to add'
    const chronicle = createChronicle(initialEvent)

    // Test
    chronicle.addEvent(eventToAdd)
    // Assert
    expect(chronicle.getCurrentEvent()).toEqual(eventToAdd)
  })

  it('should allow adding a new Event and move the original Event to past Events', () => {
    // Setup
    const initialEvent = 'Initial event'
    const eventToAdd = 'Event to add'
    const chronicle = createChronicle(initialEvent)

    // Test
    chronicle.addEvent(eventToAdd)

    // Assert
    const isInitialEventInPastEvents = chronicle.getPastEvents().includes(initialEvent)
    expect(isInitialEventInPastEvents).toBe(true)
  })

  it('should allow getting all Events', () => {
    // Setup
    const firstEvent = 'First event'
    const secondEvent = 'Second event'
    const thirdEvent = 'Third event'
    const chronicle = createChronicle(firstEvent)

    // Test
    chronicle.addEvent(secondEvent)
    chronicle.addEvent(thirdEvent)

    // Assert
    const isFirstlEventInAllEvents = chronicle.getAllEvents().includes(firstEvent)
    const isSecondEventInAllEvents = chronicle.getAllEvents().includes(secondEvent)
    const isThirdEventInAllEvents = chronicle.getAllEvents().includes(thirdEvent)
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
    const chronicle = createChronicle(events[2])
    chronicle.addEvent(events[1])
    chronicle.addEvent(events[0])
    chronicle.addEvent(currentEvent)
    const pastEvents = chronicle.getPastEvents()

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
    const chronicle = createChronicle(events[2])
    chronicle.addEvent(events[1])
    chronicle.addEvent(events[0])
    const allEvents = chronicle.getAllEvents()

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
    const chronicle = createChronicle<string>('First event', { onAddEvent })
    chronicle.addEvent('Second event')

    // Assert
    expect(onAddEvent).toHaveBeenCalledTimes(2)
    expect(onAddEvent).toHaveBeenCalledWith('First event')
    expect(onAddEvent).toHaveBeenCalledWith('Second event')
  })

  it('should run local onAddEvent callback when adding an event', () => {
    // Setup
    const onAddEvent = vi.fn()

    // Test
    const chronicle = createChronicle<string>('First event')
    chronicle.addEvent('Second event', onAddEvent)

    // Assert
    expect(onAddEvent).toHaveBeenCalledTimes(1)
    expect(onAddEvent).toHaveBeenCalledWith('Second event')
  })

  it('should run a timer', () => {
    // Setup
    vi.useFakeTimers()
    const consoleTimeMock = vi.spyOn(console, 'time').mockImplementation(() => undefined)
    const consoleTimeLogMock = vi.spyOn(console, 'timeLog').mockImplementation(() => undefined)
    const consoleTimeEndMock = vi.spyOn(console, 'timeEnd').mockImplementation(() => undefined)
    const chronicle = createChronicle('First event')
    const timerLabel = 'label'

    // Test
    chronicle.timerStart(timerLabel)

    setTimeout(() => {
      chronicle.timerLog(timerLabel)
    }, 1000)

    setTimeout(() => {
      chronicle.timerEnd(timerLabel)
    }, 2000)

    vi.runAllTimers()
    // Assert
    expect(consoleTimeMock).toHaveBeenCalledOnce()
    expect(consoleTimeLogMock).toHaveBeenCalledOnce()
    expect(consoleTimeEndMock).toHaveBeenCalledOnce()

    // Cleanup
    consoleTimeMock.mockReset()
    consoleTimeLogMock.mockReset()
    consoleTimeEndMock.mockReset()
  })
})
