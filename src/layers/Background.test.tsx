import * as React from 'react'
import { mount, render } from 'enzyme'

import Background from './Background'

describe('the background layer', () => {
  it('matches the snapshot', () => {
    expect(
      render(
        <Background
          url="http://example.com/example.png"
          onLoadDimensions={jest.fn()}
        />,
      ),
    ).toMatchSnapshot()
  })

  it('renders an image with the given URL', () => {
    const url = 'http://example.com/example.png'
    const bg = render(<Background url={url} onLoadDimensions={jest.fn()} />)
    expect(bg.attr('src')).toEqual(url)
  })

  it('reports the dimensions of the loaded image', () => {
    const url = 'http://example.com/example.png'
    const dimensions = { width: 1, height: 2 }
    const reportDimensions = jest.fn()
    const bg = mount(
      <Background url={url} onLoadDimensions={reportDimensions} />,
    )
    bg.simulate('load', { target: { ...dimensions, foo: 'bar' } })
    expect(reportDimensions).toHaveBeenCalledWith(dimensions)
  })
})
