import { useState, useEffect } from 'react'

export function useEventValue<E extends Event, T>(
  eventType: string,
  valueForEvent: (e: E) => T,
  initial: T | null = null,
) {
  const [value, setValue] = useState<T | null>(initial)

  function handleEvent(e: E) {
    setValue(valueForEvent(e))
  }

  useEffect(() => {
    window.addEventListener(eventType, handleEvent)
    return () => {
      window.removeEventListener(eventType, handleEvent)
    }
  }, [eventType, valueForEvent])

  return value
}

export function useKeyboardToggle(key: string, defaultValue: boolean) {
  const comparisonKey = key.toLowerCase()
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    const handleEvent = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === comparisonKey) {
        setValue(!value)
      }
    }

    window.addEventListener('keydown', handleEvent)

    return () => {
      window.removeEventListener('keydown', handleEvent)
    }
  })
  return value
}

export function useLocalStorage(key: string) {
  const [storageValue, setStorageValue] = useState(window.localStorage[key])

  function onChange({ detail }: CustomEvent) {
    if (detail.key === key) {
      setStorageValue(detail.value)
    }
  }

  useEffect(() => {
    window.addEventListener('onLocalStorageChange', onChange)
    return () => window.removeEventListener('onLocalStorageChange', onChange)
  }, [key])

  return [
    storageValue,
    (value: string) => {
      window.localStorage.setItem(key, value)

      window.dispatchEvent(
        new CustomEvent('onLocalStorageChange', { detail: { key, value } }),
      )
    },
  ]
}
