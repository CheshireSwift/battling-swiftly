import * as React from 'react'
import { mount, render } from 'enzyme'

import Drawing from './Drawing'

describe('the drawing layer', () => {
  it('allows rangefinding', () => {
    const drawingLayer = mount(
      <Drawing dimensions={{ width: 20, height: 10 }} dpi={1} />,
    )

    drawingLayer.simulate('click', { button: 0, pageX: 1, pageY: 2 })
    drawingLayer.simulate('click', { button: 0, pageX: 4, pageY: 6 })

    expect(drawingLayer.find('line').prop('x1')).toBe(1)
    expect(drawingLayer.find('line').prop('y1')).toBe(2)

    expect(drawingLayer.find('line').prop('x2')).toBe(4)
    expect(drawingLayer.find('line').prop('y2')).toBe(6)

    expect(drawingLayer.text()).toContain('5.0"')
  })
})
