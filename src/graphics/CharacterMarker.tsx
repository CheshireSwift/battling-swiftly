import * as React from 'react'
import * as _ from 'lodash'

import Vector from '../helpers/Vector'
import Options from '../data/Options'
import MarkerData from '../data/Character'

export const CharacterMarker = ({
  character,
  dpi,
  highlight,
}: {
  character: MarkerData
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

  const { fixedScale, drawColour } = React.useContext(Options)
  const sizeMultiplier = fixedScale ? fixedScale : 1 / window.devicePixelRatio

  const position = Vector.fromXY(character.position)
  const offsetPosition = character.radius
    ? position
    : position.add(new Vector(15, -15).multiply(1 * sizeMultiplier))
  const color = character.color || drawColour

  const radiusCircles = character.radius ? (
    <circle
      {...position.prefix('c')}
      r={character.radius * dpi}
      stroke={color}
      strokeWidth={0.5 * sizeMultiplier}
      fill={color}
      fillOpacity='0.3'
    />
  ) : (
    (highlight || hover) && (
      <>
        <circle
          {...position.prefix('c')}
          r={6 * dpi}
          stroke={color}
          strokeWidth={1.5 * sizeMultiplier}
          fill={color}
          fillOpacity='0.1'
        />
        <circle
          {...position.prefix('c')}
          r={1 * dpi}
          stroke={color}
          strokeWidth={0.5 * sizeMultiplier}
          fill={color}
          fillOpacity='0.2'
        />
        <circle
          {...position.prefix('c')}
          r={7 * dpi}
          stroke={color}
          strokeDasharray='10'
          strokeWidth={0.5 * sizeMultiplier}
          fill='none'
        />
      </>
    )
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
        fillOpacity='0.1'
        {...hoverHandlers}
      />
      <path
        stroke={color}
        strokeWidth={1.5 * sizeMultiplier}
        fill='none'
        d={`
M ${position.x + 2 * sizeMultiplier},${position.y - 2 * sizeMultiplier}
L ${offsetPosition.x},${handleBarHeight}
L ${offsetPosition.x + handleBarLength},${handleBarHeight}
    `}
      />
    </>
  )

  const fontSize = 14 * sizeMultiplier
  const nameText = (
    <text
      {...offsetPosition}
      fill={color}
      style={{
        fontFamily: 'monospace',
        fontWeight: 'bold',
        fontSize,
      }}
      {...hoverHandlers}
    >
      {character.name}
    </text>
  )

  const notesText = (
    <text
      {...offsetPosition}
      fill={color}
      style={{
        fontFamily: 'monospace',
        fontSize,
      }}
    >
      {character.notes &&
        (highlight || hover ? (
          character.notes.map(note => (
            <tspan x={offsetPosition.x} dy={fontSize}>
              {note}
            </tspan>
          ))
        ) : (
          <tspan x={offsetPosition.x} dy={fontSize}>
            {_.repeat('•', character.notes.length)}
          </tspan>
        ))}
    </text>
  )

  return (
    <>
      {radiusCircles}
      {!character.radius && mapHandle}
      {nameText}
      {notesText}
    </>
  )
}

export default CharacterMarker
