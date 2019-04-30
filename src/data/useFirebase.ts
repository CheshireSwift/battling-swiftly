import * as React from 'react'

import { Snapshot, Store, CollectionRef } from '../data/Store'

export const useFirebase = (
  store: Store,
  collectionName: string,
): { snapshot: Snapshot | undefined; collection: CollectionRef } => {
  const [snapshot, setSnapshot] = React.useState<Snapshot>()
  const collection = store.collection(collectionName)
  React.useEffect(() => {
    collection.get().then(setSnapshot)
    return collection.onSnapshot(setSnapshot)
  }, [collectionName])

  return { snapshot, collection }
}

export default useFirebase
