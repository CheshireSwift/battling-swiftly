import * as _ from 'lodash'
import * as React from 'react'
import Character from '../data/Character'
import { cMenuBg, cPrimary } from '../styling/constants'

export type CharacterSelectorProps = {
  characters: Character[]
  availableKeys: string[]
  selected: string
  onSelect: (key: string) => void
}

export const CharacterSelector = ({
  characters,
  availableKeys,
  selected,
  onSelect,
}: CharacterSelectorProps) => (
  <div
    style={{
      position: 'fixed',
      background: cMenuBg,
      color: cPrimary,
      bottom: 0,
      right: 0,
    }}
  >
    {availableKeys.map(key => (
      <div
        id={'character-selector-option-' + key}
        key={key}
        style={{
          padding: '0.5rem',
          textDecoration: key === selected ? 'underline' : undefined,
          // border: key === selected ? '1px solid black' : '1px solid wheat',
        }}
        onClick={() => onSelect(key)}
      >
        {_.get(_.find(characters, { key }), 'name')}
      </div>
    ))}
  </div>
)

export default CharacterSelector
