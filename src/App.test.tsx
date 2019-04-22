import * as React from 'react'
import { render, mount } from 'enzyme'

import App from './App'
import { act } from 'react-dom/test-utils'

describe('the app', () => {
  const docs = [
    {
      id: 'hero',
      data: () => ({
        color: 'lime',
        name: 'Waffle',
        position: {
          x: 257.99202542018276,
          y: 636.24685445642828,
        },
      }),
    },
    {
      id: 'villain',
      data: () => ({
        color: 'orange',
        name: 'Pickle',
        position: {
          x: 457.99202542018276,
          y: 236.24685445642828,
        },
      }),
    },
  ]

  const buildStore = (promise = Promise.resolve({ docs })) => ({
    collection: () => ({
      get: () => promise,
      onSnapshot: jest.fn(),
      doc: jest.fn(),
    }),
  })

  it('matches the snapshot', async () => {
    jsdom.reconfigure({
      url:
        'http://example.com/?bg=some_image.png&dpi=30&collection=test-collection&char=hero',
    })

    const promise = Promise.resolve({ docs })
    const store = buildStore(promise)
    const app = mount(
      <div>
        <App store={store} />
      </div>,
    )
    await act((async () => {
      await promise
      app.update()
    }) as any)

    expect(app.html()).toMatchSnapshot()
  })

  it('matches the snapshot with bg missing', () => {
    jsdom.reconfigure({
      url: 'http://example.com/?dpi=30&collection=test-collection&char=hero',
    })

    expect(render(<App store={buildStore()} />)).toMatchSnapshot()
  })

  it('matches the snapshot with dpi missing', () => {
    jsdom.reconfigure({
      url:
        'http://example.com/?bg=some_image.png&collection=test-collection&char=hero',
    })

    expect(render(<App store={buildStore()} />)).toMatchSnapshot()
  })

  it('matches the snapshot with collection missing', () => {
    jsdom.reconfigure({
      url: 'http://example.com/?bg=some_image.png&dpi=30&char=hero',
    })

    expect(render(<App store={buildStore()} />)).toMatchSnapshot()
  })

  it('matches the snapshot with multiple controlled characters', async () => {
    jsdom.reconfigure({
      url:
        'http://example.com/?bg=some_image.png&dpi=30&collection=test-collection' +
        '&char=hero' +
        '&char=villain',
    })

    const promise = Promise.resolve({ docs })
    const store = buildStore(promise)
    const app = mount(
      <div>
        <App store={store} />
      </div>,
    )
    await act((async () => {
      await promise
      app.update()
    }) as any)

    expect(app.html()).toMatchSnapshot()
  })
})
