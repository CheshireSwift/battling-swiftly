import * as React from 'react'
import { Circle, Line } from 'react-rough'
import Options from '../data/Options'
import Vector from '../helpers/Vector'

type PlottingLineProps = {
  start: Vector
  end: Vector
  dpi: number
}

export const PlottingLine = ({ start, end, dpi }: PlottingLineProps) => {
  const { fixedScale, drawColour } = React.useContext(Options)
  const scaleMultiplier = fixedScale ? fixedScale : 1 / window.devicePixelRatio
  const shared = {
    stroke: drawColour,
    strokeWidth: 1.5 * scaleMultiplier,
  }
  const fontSize = 16 * scaleMultiplier

  const lineVector = start.difference(end)
  const offsetVector = lineVector.normalize(2 * fontSize, 1.5 * fontSize)

  return (
    <>
      <Line {...start.toLineStart()} {...end.toLineEnd()} {...shared} />
      <Circle
        {...end.toXY()}
        diameter={4 * scaleMultiplier * 2}
        {...shared}
        fill="none"
      />
      <text
        {...end.add(offsetVector)}
        fill={drawColour}
        fontSize={fontSize}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ cursor: 'pointer' }}
      >
        <tspan dy={-fontSize / 2} style={{ fontWeight: 'bolder' }}>
          {(lineVector.length() / dpi).toFixed(1)}"
        </tspan>
        <tspan x={end.x + offsetVector.x} dy={fontSize}>
          {end.multiply(1 / dpi).toString()}
        </tspan>
      </text>
    </>
  )
}

export default PlottingLine
