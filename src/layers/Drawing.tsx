import * as React from 'react'
import { layerStyle } from '../helpers/styleSnippets'
import { useEventValue } from '../helpers/hooks'
import { Vector } from '../helpers/vector'

type DrawingProps = {
  dimensions: { height: number; width: number }
  dpi: number
}

const pointFromEvent = (e: { pageX: number; pageY: number }) =>
  new Vector(e.pageX, e.pageY)

export const Drawing = ({ dimensions, dpi }: DrawingProps) => {
  const [start, setStart] = React.useState<Vector | null>(null)
  const [end, setEnd] = React.useState<Vector | null>(null)
  const mousePos = useEventValue<MouseEvent, Vector>(
    'mousemove',
    pointFromEvent,
  )

  const endToUse = end || mousePos

  const toolClick = (e: React.MouseEvent) => {
    if (e.button !== 0) {
      return
    }

    const point = pointFromEvent(e)
    if (start && !end) {
      setEnd(point)
    } else {
      setStart(point)
      setEnd(null)
    }
  }

  const menuClick = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('menu!')
  }

  return (
    <svg
      style={{ ...layerStyle, ...dimensions, pointerEvents: 'all' }}
      onClick={toolClick}
      onContextMenu={menuClick}
    >
      {start && endToUse && (
        <>
          <line
            {...start.suffix('1')}
            {...endToUse.suffix('2')}
            stroke="lime"
          />
          <text {...endToUse} fill="lime">
            {(endToUse.difference(start).length() / dpi).toFixed(1)}"
          </text>
        </>
      )}
    </svg>
  )
}
export default Drawing
