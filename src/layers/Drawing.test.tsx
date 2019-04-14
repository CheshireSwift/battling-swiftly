import * as React from 'react'
import { mount, render, ReactWrapper } from 'enzyme'

import Drawing from './Drawing'
import Tool from '../data/Tool'

function selectTool(drawingLayer: ReactWrapper, tool: Tool) {
  drawingLayer.simulate('contextmenu')
  drawingLayer.find('#popup-menu-item-' + tool).simulate('click')
}

let entropy = 0
const character = (name: string) => ({
  name,
  key: '' + entropy++,
  position: { x: entropy++, y: entropy++ },
})

describe('the drawing layer', () => {
  it('matches the snapshot', () => {
    expect(
      render(
        <Drawing
          dimensions={{ width: 200, height: 100 }}
          dpi={10}
          characters={[
            { name: 'Bob', key: '123xyz', position: { x: 1, y: 2 } },
          ]}
          update={jest.fn}
        />,
      ),
    ).toMatchSnapshot()
  })

  it('allows rangefinding', () => {
    const drawingLayer = mount(
      <Drawing
        dimensions={{ width: 200, height: 100 }}
        dpi={10}
        characters={[]}
        update={jest.fn}
      />,
    )

    drawingLayer.simulate('click', { button: 0, pageX: 10, pageY: 20 })
    drawingLayer.simulate('click', { button: 0, pageX: 40, pageY: 60 })

    expect(drawingLayer.find('line').prop('x1')).toBe(10)
    expect(drawingLayer.find('line').prop('y1')).toBe(20)

    expect(drawingLayer.find('line').prop('x2')).toBe(40)
    expect(drawingLayer.find('line').prop('y2')).toBe(60)

    expect(drawingLayer.text()).toContain('5.0"')
    expect(drawingLayer.text()).toContain('4,6')
  })

  it('shows the menu on right click', () => {
    const drawingLayer = mount(
      <Drawing
        dimensions={{ width: 20, height: 10 }}
        dpi={1}
        characters={[]}
        update={jest.fn()}
      />,
    )

    drawingLayer.simulate('contextmenu', { pageX: 10, pagetY: 20 })

    expect(drawingLayer.text()).toContain('Measure')
  })

  it('renders its characters', () => {
    const drawingLayer = render(
      <Drawing
        dimensions={{ width: 200, height: 100 }}
        dpi={1}
        characters={[character('Waffle'), character('Pickle')]}
        update={jest.fn()}
      />,
    )

    expect(drawingLayer.text()).toContain('Waffle')
    expect(drawingLayer.text()).toContain('Pickle')
  })

  it('removes the movement tool when no character is being controlled', () => {
    const drawingLayer = mount(
      <Drawing
        dimensions={{ width: 200, height: 100 }}
        dpi={1}
        characters={[]}
        update={jest.fn()}
      />,
    )
    drawingLayer.simulate('contextmenu')
    expect(drawingLayer.text()).not.toContain('Move')
  })

  it('highlights the character that matches the controlled key when the movement tool is selected', () => {
    const hero = character('Zero')
    const other = character('X')
    const drawingLayer = mount(
      <Drawing
        dimensions={{ width: 200, height: 100 }}
        dpi={1}
        controlledCharacterKey={hero.key}
        characters={[hero, other]}
        update={jest.fn()}
      />,
    )

    selectTool(drawingLayer, Tool.Move)

    expect(
      drawingLayer.findWhere(e => e.key() === hero.key).prop('highlight'),
    ).toBeTruthy()

    expect(
      drawingLayer.findWhere(e => e.key() === other.key).prop('highlight'),
    ).toBeFalsy()
  })

  it('fires an update when the controlled character is moved', () => {
    const hero = { key: '1234', name: 'Zero', position: { x: 3, y: 4 } }
    const update = jest.fn()
    const drawingLayer = mount(
      <Drawing
        dimensions={{ width: 20, height: 20 }}
        dpi={1}
        controlledCharacterKey={hero.key}
        characters={[hero]}
        update={update}
      />,
    )

    selectTool(drawingLayer, Tool.Move)

    drawingLayer.simulate('click', { button: 0, pageX: 5, pageY: 6 })

    expect(update).toHaveBeenCalledWith(hero.key, { position: { x: 5, y: 6 } })
  })

  it('caps the update with the movement limit (6")', () => {
    const hero = { key: '1234', name: 'Zero', position: { x: 3, y: 4 } }
    const update = jest.fn()
    const drawingLayer = mount(
      <Drawing
        dimensions={{ width: 20, height: 20 }}
        dpi={1}
        controlledCharacterKey={hero.key}
        characters={[hero]}
        update={update}
      />,
    )

    selectTool(drawingLayer, Tool.Move)

    drawingLayer.simulate('click', { button: 0, pageX: 3, pageY: 20 })

    expect(update).toHaveBeenCalledWith(hero.key, {
      position: { x: 3, y: 4 + 6 },
    })
  })
})
