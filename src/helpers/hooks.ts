import { useState, useEffect } from 'react'

export function useEventValue<T>(
  eventType: string,
  valueForEvent: (e: Event) => T,
) {
  const [value, setValue] = useState<T>(null)

  function handleEvent(e: Event) {
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
