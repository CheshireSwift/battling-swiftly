import * as React from 'react'
import * as _ from 'lodash'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import useFirebase from './useFirebase'

describe('firebase hook', () => {
  const mockDoc = { id: '1', data: () => 'hi!', update: jest.fn() }
  const mockSnapshot = { docs: [mockDoc] }
  const collectionValue = Promise.resolve(mockSnapshot)
  const mockCollectionRef = {
    get: () => collectionValue,
    onSnapshot: jest.fn(),
    doc: () => mockDoc,
  }

  const mockStore = {
    collection: () => mockCollectionRef,
  }

  it('gets collection data and sends it to the component', async () => {
    const MyComponent = () => {
      const { snapshot } = useFirebase(mockStore, 'some-collection')
      return <div>{snapshot && (snapshot.docs[0].data() as string)}</div>
    }

    const wrapper = mount(<MyComponent />)
    await act((async () => {
      await mockCollectionRef.get()
    }) as any)

    expect(wrapper.text()).toContain(mockDoc.data())
  })

  it('updates the snapshot in realtime', async () => {
    const MyComponent = () => {
      const { snapshot } = useFirebase(mockStore, 'some-collection')
      return <div>{snapshot && (snapshot.docs[0].data() as string)}</div>
    }

    const wrapper = mount(<MyComponent />)
    await act((async () => {
      await mockCollectionRef.get()
      const [snapshotHandler] = _.last(mockCollectionRef.onSnapshot.mock.calls)
      snapshotHandler(mockSnapshot)
      wrapper.update()
    }) as any)

    expect(wrapper.text()).toContain(mockDoc.data())
  })
})
