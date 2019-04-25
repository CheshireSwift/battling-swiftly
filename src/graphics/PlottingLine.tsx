import * as React from 'react'

import Vector from '../helpers/Vector'
import Options from '../data/Options'

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
      <line {...start.suffix('1')} {...end.suffix('2')} {...shared} />
      <circle
        {...end.prefix('c')}
        r={4 * scaleMultiplier}
        {...shared}
        fill="none"
      />
      <text
        {...end.add(offsetVector)}
        fill={drawColour}
        fontSize={fontSize}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontFamily: 'monospace',
          cursor: 'pointer',
        }}
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
