import * as React from 'react'
import { Vector } from '../helpers/Vector'

export type Character = {
  name: string
  position: { x: number; y: number }
  color?: string
}

export const CharacterMarker = ({
  character,
  dpi,
}: {
  character: Character
  dpi: number
}) => {
  const [radii, setRadii] = React.useState(false)
  const hoverHandlers = {
    onMouseEnter: () => {
      setRadii(true)
    },
    onMouseLeave: () => {
      setRadii(false)
    },
  }

  const position = Vector.fromXY(character.position)
  const offsetPosition = position.add(new Vector(15, -15))
  const color = character.color || 'lime'

  return (
    <>
      {radii && (
        <>
          <circle
            {...position.prefix('c')}
            r={6 * dpi}
            stroke={color}
            strokeWidth="0.5"
            fill={color}
            fillOpacity="0.1"
          />
          <circle
            {...position.prefix('c')}
            r={1 * dpi}
            stroke={color}
            strokeWidth="0.5"
            fill={color}
            fillOpacity="0.2"
          />
        </>
      )}
      <circle
        {...position.prefix('c')}
        r="4"
        stroke={color}
        strokeWidth="1.5"
        fill={color}
        fillOpacity="0.1"
        {...hoverHandlers}
      />
      <path
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        d={`
M ${position.x + 2},${position.y - 2}
L ${offsetPosition.x},${offsetPosition.y + 2}
L ${offsetPosition.x + character.name.length * 6},${offsetPosition.y + 2}
    `}
      />
      <text
        {...offsetPosition}
        fill={color}
        style={{ fontFamily: 'monospace', fontWeight: 'bold' }}
        {...hoverHandlers}
      >
        {character.name}
      </text>
    </>
  )
}

export default CharacterMarker
