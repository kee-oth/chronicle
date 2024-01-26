import { describe, expect, it } from 'vitest'
import { createChronicle } from '../src'

describe('createChronicle', () => {
  it('should create an initial Event on Chronicle creation', () => {
    const initialEvent = "Initial event"; 

    const chronicle = createChronicle(initialEvent);

    expect(chronicle.currentEvent).toEqual(initialEvent)
  })
})
