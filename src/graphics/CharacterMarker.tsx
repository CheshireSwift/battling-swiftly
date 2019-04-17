import * as React from 'react'
import Vector from '../helpers/Vector'
import Options from '../data/Options'

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

  const options = React.useContext(Options)
  const sizeMultiplier = options.fixedScale
    ? options.fixedScale
    : 1 / window.devicePixelRatio

  const position = Vector.fromXY(character.position)
  const offsetPosition = position.add(
    new Vector(15, -15).multiply(1 * sizeMultiplier),
  )
  const color = character.color || 'lime'

  const radiusCircles = (highlight || hover) && (
    <>
      <circle
        {...position.prefix('c')}
        r={6 * dpi}
        stroke={color}
        strokeWidth={0.5 * sizeMultiplier}
        fill={color}
        fillOpacity="0.1"
      />
      <circle
        {...position.prefix('c')}
        r={1 * dpi}
        stroke={color}
        strokeWidth={0.5 * sizeMultiplier}
        fill={color}
        fillOpacity="0.2"
      />
    </>
  )

  const handleBarHeight = offsetPosition.y + 2 * sizeMultiplier
  const handleBarLength = character.name.length * 6 * sizeMultiplier
  const mapHandle = (
    <>
      <circle
        {...position.prefix('c')}
        r={4 * sizeMultiplier}
        stroke={color}
        strokeWidth={1.5 * sizeMultiplier}
        fill={color}
        fillOpacity="0.1"
        {...hoverHandlers}
      />
      <path
        stroke={color}
        strokeWidth={1.5 * sizeMultiplier}
        fill="none"
        d={`
M ${position.x + 2 * sizeMultiplier},${position.y - 2 * sizeMultiplier}
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
        fontSize: 14 * sizeMultiplier,
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
