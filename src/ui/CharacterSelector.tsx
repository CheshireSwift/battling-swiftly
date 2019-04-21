import * as React from 'react'
import * as _ from 'lodash'

import Character from '../data/Character'

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
      background: 'black',
      color: 'lime',
      top: 0,
      right: 0,
    }}
  >
    {availableKeys.map(key => (
      <div
        id={'character-selector-option-' + key}
        key={key}
        style={{
          padding: '0.5rem',
          border: key === selected ? '1px solid lime' : '1px solid black',
        }}
        onClick={() => onSelect(key)}
      >
        {_.get(_.find(characters, { key }), 'name')}
      </div>
    ))}
  </div>
)

export default CharacterSelector
