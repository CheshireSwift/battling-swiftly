import { useState, useEffect } from 'react'

export function useEventValue<E extends Event, T>(
  eventType: string,
  valueForEvent: (e: E) => T,
) {
  const [value, setValue] = useState<T>(null)

  function handleEvent(e: E) {
    setValue(valueForEvent(e))
  }

  useEffect(() => {
    window.addEventListener(eventType, handleEvent)
    return () => {
      window.removeEventListener(eventType, handleEvent)
    }
  })

  return value
}
