import * as React from 'react'
import { layerStyle } from '../helpers/styleSnippets'
import { useEventValue } from '../helpers/hooks'

type Point = { x: number; y: number }
type DrawingProps = {
  dimensions: { height: number; width: number }
}

const pointFromEvent = (e: { pageX: number; pageY: number }): Point => ({
  x: e.pageX,
  y: e.pageY,
})

export const Drawing = ({ dimensions }: DrawingProps) => {
  const [start, setStart] = React.useState<Point | null>(null)
  const [end, setEnd] = React.useState<Point | null>(null)
  const mousePos = useEventValue('mousemove', (e: MouseEvent) => ({
    x: e.pageX,
    y: e.pageY,
  }))

  const endToUse = end || mousePos

  return (
    <svg
      style={{ ...layerStyle, ...dimensions }}
      onClick={e => {
        const point = pointFromEvent(e)
        if (start && !end) {
          setEnd(point)
        } else {
          setStart(point)
          setEnd(null)
        }
      }}
    >
      {start && (
        <>
          <line
            x1={start.x}
            y1={start.y}
            x2={endToUse.x}
            y2={endToUse.y}
            stroke="lime"
          />
          <text x={endToUse.x} y={endToUse.y} fill="lime">
            {Math.round(
              Math.sqrt(
                Math.pow(endToUse.x - start.x, 2) +
                  Math.pow(endToUse.y - start.y, 2),
              ),
            ) / 100}
            "
          </text>
        </>
      )}
    </svg>
  )
}
export default Drawing
