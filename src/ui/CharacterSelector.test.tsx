import * as React from 'react'
import { render, mount } from 'enzyme'
import CharacterSelector, { CharacterSelectorProps } from './CharacterSelector'

describe('the character selector', () => {
  const characterSelector = (props?: Partial<CharacterSelectorProps>) => (
    <CharacterSelector
      characters={[
        { key: 'hero', name: 'Waffle', position: { x: 0, y: 0 } },
        { key: 'villain', name: 'Pickle', position: { x: 1, y: 1 } },
        { key: 'misc', name: 'Blep', position: { x: 2, y: 2 } },
      ]}
      availableKeys={['hero', 'villain']}
      selected={'villain'}
      onSelect={jest.fn()}
      {...props}
    />
  )

  it('matches the snapshot', () => {
    expect(render(characterSelector())).toMatchSnapshot()
  })

  it('displays the character for each key that is available to select', () => {
    const selectorText = render(characterSelector()).text()
    expect(selectorText).toContain('Waffle')
    expect(selectorText).toContain('Pickle')
    expect(selectorText).not.toContain('Blep')
  })

  it('highlights the selected character', () => {
    const selector = render(characterSelector())
    const heroOptionStyle = selector
      .find('#character-selector-option-hero')
      .attr('style')
    const villainOptionStyle = selector
      .find('#character-selector-option-villain')
      .attr('style')

    expect(villainOptionStyle).not.toEqual(heroOptionStyle)
  })

  it('fires onSelect when a new character is selected', () => {
    const onSelect = jest.fn()
    const selector = mount(characterSelector({ onSelect }))
    selector.find('#character-selector-option-hero').simulate('click')
    expect(onSelect).toHaveBeenCalledWith('hero')
  })
})
