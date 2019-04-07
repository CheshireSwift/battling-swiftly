import * as React from 'react'
import { layerStyle } from '../helpers/styleSnippets'
import { useEventValue } from '../helpers/hooks'
import { Vector } from '../helpers/vector'

type DrawingProps = {
  dimensions: { height: number; width: number }
}

const pointFromEvent = (e: { pageX: number; pageY: number }) =>
  new Vector(e.pageX, e.pageY)

export const Drawing = ({ dimensions }: DrawingProps) => {
  const [start, setStart] = React.useState<Vector | null>(null)
  const [end, setEnd] = React.useState<Vector | null>(null)
  const mousePos = useEventValue<MouseEvent, Vector>(
    'mousemove',
    pointFromEvent,
  )

  const endToUse = end || mousePos

  const toolClick = (e: React.MouseEvent) => {
    const point = pointFromEvent(e)
    if (start && !end) {
      setEnd(point)
    } else {
      setStart(point)
      setEnd(null)
    }
  }

  return (
    <svg style={{ ...layerStyle, ...dimensions }} onClick={toolClick}>
      {start && (
        <>
          <line
            {...start.suffix('1')}
            {...endToUse.suffix('2')}
            stroke="lime"
          />
          <text {...endToUse} fill="lime">
            {(endToUse.difference(start).length() / 100).toFixed(1)}"
          </text>
        </>
      )}
    </svg>
  )
}
export default Drawing
