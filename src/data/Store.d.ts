interface Document {
  id: string
  data: () => unknown
}

interface DocRef {
  update: (data: any) => void
}

interface Snapshot {
  docs: Document[]
}

interface CollectionRef {
  get: () => Promise<Snapshot>
  onSnapshot: (handler: (snapshot: Snapshot) => void) => () => void
  doc: (path: string) => DocRef
}

export interface Store {
  collection: (path: string) => CollectionRef
}

export default Store
