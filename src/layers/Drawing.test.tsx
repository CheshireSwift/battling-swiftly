import * as React from 'react'
import { mount, render } from 'enzyme'

import Drawing from './Drawing'

describe('the drawing layer', () => {
  it('allows rangefinding', () => {
    const drawingLayer = mount(
      <Drawing dimensions={{ width: 200, height: 100 }} dpi={10} />,
    )

    drawingLayer.simulate('click', { button: 0, pageX: 10, pageY: 20 })
    drawingLayer.simulate('click', { button: 0, pageX: 40, pageY: 60 })

    expect(drawingLayer.find('line').prop('x1')).toBe(10)
    expect(drawingLayer.find('line').prop('y1')).toBe(20)

    expect(drawingLayer.find('line').prop('x2')).toBe(40)
    expect(drawingLayer.find('line').prop('y2')).toBe(60)

    expect(drawingLayer.text()).toContain('5.0"')
  })

  it('shows the menu on right click', () => {
    const drawingLayer = mount(
      <Drawing dimensions={{ width: 20, height: 10 }} dpi={1} />,
    )

    drawingLayer.simulate('contextmenu', { pageX: 10, pagetY: 20 })

    expect(drawingLayer.text()).toContain('Measure')
  })

  it('renders its children', () => {
    const drawingLayer = render(
      <Drawing dimensions={{ width: 200, height: 100 }} dpi={1}>
        <div>Pickle</div>
        <div>Waffle</div>
      </Drawing>,
    )

    expect(drawingLayer.text()).toContain('Waffle')
    expect(drawingLayer.text()).toContain('Pickle')
  })
})
