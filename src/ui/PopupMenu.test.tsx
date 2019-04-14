import * as React from 'react'
import { mount, render } from 'enzyme'

import PopupMenu from './PopupMenu'
import Vector from '../helpers/Vector'

describe('the popup menu', () => {
  it('matches the snapshot', () => {
    expect(
      <PopupMenu
        position={{ top: 10, left: 20 }}
        menuItems={[['a', 'foo'], ['b', 'bar']]}
      />,
    ).toMatchSnapshot()
  })

  it('hides itself when not given a position', () => {
    const popupMenu = render(<PopupMenu position={null} menuItems={[]} />)
    expect(popupMenu.html()).toBeNull()
  })

  it('displays the provided items', () => {
    const popupMenu = render(
      <PopupMenu
        position={{ top: 0, left: 0 }}
        menuItems={[['a', 'foo'], ['b', 'bar']]}
      />,
    )
    expect(popupMenu.text()).toContain('foo')
    expect(popupMenu.text()).toContain('bar')
  })

  it('highlights the selected item', () => {
    const popupMenu = render(
      <PopupMenu
        position={{ top: 0, left: 0 }}
        menuItems={[['a', 'foo'], ['b', 'bar'], ['c', 'baz']]}
        selectedItem="a"
      />,
    )

    const aElem = popupMenu.find('*:contains("foo")')
    const bElem = popupMenu.find('*:contains("bar")')
    const cElem = popupMenu.find('*:contains("baz")')

    expect(bElem.attr('style')).not.toEqual(aElem.attr('style'))
    expect(bElem.attr('style')).toEqual(cElem.attr('style'))
  })

  it('fires the selection handler when an item is clicked', () => {
    const onSelectItem = jest.fn()
    const popupMenu = mount(
      <PopupMenu
        position={{ top: 0, left: 0 }}
        menuItems={[['a', 'foo'], ['b', 'bar']]}
        onSelectItem={onSelectItem}
      />,
    )

    popupMenu.findWhere(e => !!e.type() && e.text() === 'foo').simulate('click')

    expect(onSelectItem).toHaveBeenCalledWith('a')
  })

  it('draws itself at the specified position', () => {
    const popupMenu = render(
      <PopupMenu position={new Vector(123, 456).toStyle()} menuItems={[]} />,
    )

    const style = popupMenu.attr('style')
    expect(style).toContain('left:123')
    expect(style).toContain('top:456')
  })

  it('ignores falsy items', () => {
    const popupMenu = render(
      <PopupMenu
        position={new Vector(0, 0).toStyle()}
        menuItems={[[1, 'a'], null, [2, 'b'], '', false, [3, 'c']]}
      />,
    )

    expect(popupMenu.children().length).toBe(3)
  })
})
