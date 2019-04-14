import * as React from 'react'
import Vector from '../helpers/Vector'

export type Character = {
  key: string
  name: string
  position: { x: number; y: number }
  color?: string
}

export const CharacterMarker = ({
  character,
  dpi,
  highlight,
}: {
  character: Character
  dpi: number
  highlight?: boolean
}) => {
  const [hover, setHover] = React.useState(false)
  const hoverHandlers = {
    onMouseEnter: () => {
      setHover(true)
    },
    onMouseLeave: () => {
      setHover(false)
    },
  }

  const position = Vector.fromXY(character.position)
  const offsetPosition = position.add(
    new Vector(15, -15).multiply(1 / devicePixelRatio),
  )
  const color = character.color || 'lime'

  const radiusCircles = (highlight || hover) && (
    <>
      <circle
        {...position.prefix('c')}
        r={6 * dpi}
        stroke={color}
        strokeWidth={0.5 / devicePixelRatio}
        fill={color}
        fillOpacity="0.1"
      />
      <circle
        {...position.prefix('c')}
        r={1 * dpi}
        stroke={color}
        strokeWidth={0.5 / devicePixelRatio}
        fill={color}
        fillOpacity="0.2"
      />
    </>
  )

  const handleBarHeight = offsetPosition.y + 2 / devicePixelRatio
  const handleBarLength = (character.name.length * 6) / devicePixelRatio
  const mapHandle = (
    <>
      <circle
        {...position.prefix('c')}
        r={4 / devicePixelRatio}
        stroke={color}
        strokeWidth={1.5 / devicePixelRatio}
        fill={color}
        fillOpacity="0.1"
        {...hoverHandlers}
      />
      <path
        stroke={color}
        strokeWidth={1.5 / devicePixelRatio}
        fill="none"
        d={`
M ${position.x + 2 / devicePixelRatio},${position.y - 2 / devicePixelRatio}
L ${offsetPosition.x},${handleBarHeight}
L ${offsetPosition.x + handleBarLength},${handleBarHeight}
    `}
      />
    </>
  )

  const nameText = (
    <text
      {...offsetPosition}
      fill={color}
      style={{
        fontFamily: 'monospace',
        fontWeight: 'bold',
        fontSize: 14 / devicePixelRatio,
      }}
      {...hoverHandlers}
    >
      {character.name}
    </text>
  )

  return (
    <>
      {radiusCircles}
      {mapHandle}
      {nameText}
    </>
  )
}

export default CharacterMarker
