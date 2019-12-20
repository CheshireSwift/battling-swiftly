import * as _ from 'lodash'
import * as React from 'react'
import ReactRough, { Circle, Path, Rectangle } from 'react-rough'
import MarkerData from '../data/Character'
import Options from '../data/Options'
import Vector from '../helpers/Vector'

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
    : position.add(new Vector(20, -20).multiply(1 * sizeMultiplier))
  const color = character.color || drawColour

  const radiusCircles = character.radius ? (
    <Circle
      // {...position.prefix('c')}
      {...position.toXY()}
      diameter={character.radius * dpi * 2}
      stroke={color}
      strokeWidth={0.5 * sizeMultiplier}
      fill={color}
      fillWeight={0.5}
    />
  ) : (
    (highlight || hover) && (
      <>
        <Circle
          {...position.toXY()}
          diameter={6 * dpi * 2}
          stroke={color}
          strokeWidth={1.5 * sizeMultiplier}
          fill={color}
        />
        <Circle
          {...position.toXY()}
          diameter={1 * dpi * 2}
          stroke={color}
          strokeWidth={0.5 * sizeMultiplier}
          fill={color}
          fillStyle="cross-hatch"
        />
        <Circle
          {...position.toXY()}
          diameter={7 * dpi * 2}
          stroke={color}
          // strokeDasharray="10"
          strokeWidth={0.5 * sizeMultiplier}
          fill="none"
        />
      </>
    )
  )

  const handleBarHeight = offsetPosition.y + 2 * sizeMultiplier
  const handleBarLength = character.name.length * 8 * sizeMultiplier
  const mapHandle = (
    <>
      <Circle
        {...position.toXY()}
        diameter={2 * sizeMultiplier * 2}
        stroke={color}
        strokeWidth={1.5 * sizeMultiplier}
        fill={color}
        {...hoverHandlers}
        roughness={0.3}
      />
      <Path
        stroke={color}
        strokeWidth={1.5 * sizeMultiplier}
        fill="none"
        d={`
M ${position.x + sizeMultiplier},${position.y - sizeMultiplier}
L ${offsetPosition.x},${handleBarHeight}
L ${offsetPosition.x + handleBarLength},${handleBarHeight}
    `}
        roughness={1.5}
      />
    </>
  )

  const fontSize = 14 * sizeMultiplier
  const nameText = (
    <>
      <ReactRough renderer="svg" width={1000} height={1000}>
        <Rectangle
          x={100}
          y={200}
          width={100}
          height={200}
          stroke="none"
          fill="wheat"
        />
      </ReactRough>
      <text
        {...offsetPosition}
        fill={color}
        style={{
          fontWeight: 'bold',
          fontSize,
          zIndex: 999,
        }}
        {...hoverHandlers}
      >
        {character.name}
      </text>
    </>
  )

  const notesText = (
    <text {...offsetPosition} fill={color} style={{ fontSize, zIndex: 999 }}>
      {character.notes &&
        (highlight || hover ? (
          character.notes.map(note => (
            <>
              <tspan x={offsetPosition.x} dy={fontSize}>
                {note}
              </tspan>
            </>
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
