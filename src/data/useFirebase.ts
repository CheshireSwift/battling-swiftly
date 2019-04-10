import * as React from 'react'

export const useFirebase = <T extends any>(collectionRef: {
  get: () => Promise<T>
  onSnapshot: (handler: (snapshot: T) => void) => () => void
}): T | undefined => {
  const [snapshot, setSnapshot] = React.useState<T>()
  React.useEffect(() => {
    collectionRef.get().then(setSnapshot)
    const cancelListener = collectionRef.onSnapshot(setSnapshot)
    return cancelListener
  }, [collectionRef])

  return snapshot
}

export default useFirebase
