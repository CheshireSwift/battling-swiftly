import * as React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import useFirebase from './useFirebase'

describe('firebase hook', () => {
  const mockSnapshot = 'hi!'

  it('gets collection data and sends it to the component', async () => {
    const collectionValue = Promise.resolve(mockSnapshot)
    const mockCollectionRef = {
      get: () => collectionValue,
      onSnapshot: jest.fn(),
    }

    const MyComponent = () => {
      const { snapshot } = useFirebase(mockCollectionRef)
      return <div>{snapshot}</div>
    }

    const wrapper = mount(<MyComponent />)
    await act((async () => {
      await mockCollectionRef.get()
    }) as any)

    expect(wrapper.text()).toContain(mockSnapshot)
  })

  it('updates the snapshot in realtime', async () => {
    let collectionValue = Promise.resolve('')
    let snapshotHandler = (snapshot: string) => {}
    const mockCollectionRef = {
      get: () => collectionValue,
      onSnapshot: (handler: (snapshot: string) => void) => {
        snapshotHandler = handler
        return () => {}
      },
    }

    const MyComponent = () => {
      const { snapshot } = useFirebase(mockCollectionRef)
      return <div>{snapshot}</div>
    }

    const wrapper = mount(<MyComponent />)
    await act((async () => {
      await mockCollectionRef.get()
      snapshotHandler(mockSnapshot)
      wrapper.update()
    }) as any)

    expect(wrapper.text()).toContain(mockSnapshot)
  })
})
