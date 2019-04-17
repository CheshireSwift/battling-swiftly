import * as React from 'react'

import Vector from '../helpers/Vector'

type PlottingLineProps = {
  start: Vector
  end: Vector
  dpi: number
}

export const PlottingLine = ({ start, end, dpi }: PlottingLineProps) => {
  const shared = {
    stroke: 'lime',
    strokeWidth: 1.5 / devicePixelRatio,
  }
  const fontSize = 16 / devicePixelRatio

  const lineVector = start.difference(end)
  const offsetVector = lineVector.normalize(2 * fontSize, 1.5 * fontSize)

  return (
    <>
      <line {...start.suffix('1')} {...end.suffix('2')} {...shared} />
      <circle
        {...end.prefix('c')}
        r={4 / devicePixelRatio}
        {...shared}
        fill="none"
      />
      <text
        {...end.add(offsetVector)}
        fill="lime"
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
