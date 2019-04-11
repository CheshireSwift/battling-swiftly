import * as React from 'react'
import { layerStyle } from '../helpers/styleSnippets'
import { useEventValue } from '../helpers/hooks'
import { Vector } from '../helpers/Vector'
import PopupMenu from '../ui/PopupMenu'
import Tool from '../data/Tool'

type DrawingProps = {
  dimensions: { height: number; width: number }
  dpi: number
  children?: React.ReactNode
}

export const Drawing = ({ dimensions, dpi, children }: DrawingProps) => {
  const [start, setStart] = React.useState<Vector | null>(null)
  const [end, setEnd] = React.useState<Vector | null>(null)
  const [menuPosition, setMenuPosition] = React.useState<Vector | null>(null)
  const [selectedTool, setSelectedTool] = React.useState(Tool.Measure)
  const mousePos = useEventValue<MouseEvent, Vector>(
    'mousemove',
    Vector.fromEvent,
  )

  const endToUse = end || mousePos

  const measureHandler = (e: React.MouseEvent): void => {
    const point = Vector.fromEvent(e)
    if (start && !end) {
      setEnd(point)
    } else {
      setStart(point)
      setEnd(null)
    }
  }

  const handlerForTool = (tool: Tool) => {
    switch (tool) {
      case Tool.Measure:
        return measureHandler
      default:
        console.warn('No handler for tool', Tool[tool])
        return () => {}
    }
  }

  const toolClick = (e: React.MouseEvent) => {
    setMenuPosition(null)

    if (e.button !== 0) {
      return
    }

    handlerForTool(selectedTool)(e)
  }

  const menuClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setMenuPosition(Vector.fromEvent(e))
  }

  return (
    <div onClick={toolClick} onContextMenu={menuClick}>
      <svg style={{ ...layerStyle, ...dimensions }}>
        {children}
        {start && endToUse && (
          <>
            <line
              {...start.suffix('1')}
              {...endToUse.suffix('2')}
              stroke="lime"
              strokeWidth="1.5"
            />
            <circle
              {...endToUse.prefix('c')}
              r="4"
              stroke="lime"
              strokeWidth="1.5"
              fill="none"
            />
            <text
              {...endToUse}
              fill="lime"
              fontSize="16"
              textAnchor="middle"
              dominantBaseline="middle"
              {...start
                .difference(endToUse)
                .normalize(30, 15)
                .prefix('d')}
              style={{
                fontFamily: 'monospace',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              {(endToUse.difference(start).length() / dpi).toFixed(1)}"
            </text>
          </>
        )}
      </svg>
      <PopupMenu
        position={menuPosition}
        menuItems={[[Tool.Measure, 'Measure'], [Tool.Move, 'Move']]}
        selectedItem={selectedTool}
        onSelectItem={(selection: Tool) => {
          setSelectedTool(selection)
          setMenuPosition(null)
        }}
      />
    </div>
  )
}
export default Drawing
