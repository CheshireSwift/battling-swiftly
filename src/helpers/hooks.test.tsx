import * as React from 'react'
import * as _ from 'lodash'
import { render, mount } from 'enzyme'

import { useKeyboardToggle, useEventValue } from './hooks'
import { act } from 'react-dom/test-utils'

describe('utility hooks', () => {
  const listeners: { [type: string]: EventListener[] } = {}
  const fireEvent = (type: string, data: any) => {
    act(() => {
      listeners[type] && listeners[type].forEach(listener => listener(data))
    })
  }

  beforeEach(() => {
    jest
      .spyOn(window, 'addEventListener')
      .mockImplementation((type, listener: EventListener) => {
        if (!listeners[type]) {
          listeners[type] = []
        }

        listeners[type].push(listener)
      })

    jest
      .spyOn(window, 'removeEventListener')
      .mockImplementation((type, listener) => {
        _.remove(listeners[type], l => l === listener)
      })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('#useKeyboardToggle', () => {
    const MyComponent = ({ dv }: { dv: boolean }) => {
      const show = useKeyboardToggle('x', dv)
      return <div>{show ? 'yes' : 'no'}</div>
    }

    it('returns the default value by default', () => {
      expect(render(<MyComponent dv={true} />).text()).toContain('yes')
      expect(render(<MyComponent dv={false} />).text()).toContain('no')
    })

    it('toggles the value when the key is pressed', () => {
      const keyboardComponent = mount(<MyComponent dv={false} />)
      expect(keyboardComponent.text()).toContain('no')
      fireEvent('keydown', { key: 'x' })
      expect(keyboardComponent.text()).toContain('yes')
    })
  })

  describe('#useEventValue', () => {
    const MyComponent = ({ initial }: { initial?: number }) => {
      const pageX = useEventValue('waffle', (e: MouseEvent) => e.pageX, initial)
      return <div>{'' + pageX}</div>
    }

    it('defaults to the initial value if provided', () => {
      expect(render(<MyComponent initial={123} />).text()).toContain('123')
    })

    it('defaults to null if no initial value is provided', () => {
      expect(render(<MyComponent />).text()).toContain('null')
    })

    it('returns the event-derived value that was last seen', () => {
      const listenerComponent = mount(<MyComponent />)
      fireEvent('waffle', { pageX: 123 })
      expect(listenerComponent.text()).toContain('123')
      fireEvent('waffle', { pageX: 456 })
      expect(listenerComponent.text()).toContain('456')
    })
  })
})
