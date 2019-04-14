import * as React from 'react'
import * as _ from 'lodash'

import { layerStyle } from '../helpers/styleSnippets'
import { useEventValue } from '../helpers/hooks'
import Vector from '../helpers/Vector'
import PopupMenu from '../ui/PopupMenu'
import Tool from '../data/Tool'
import CharacterMarker, { Character } from '../graphics/CharacterMarker'

type DrawingProps = {
  dimensions: { height: number; width: number }
  dpi: number
  characters: Character[]
  controlledCharacterKey?: string
  update: (key: string, data: Partial<Character>) => void
}

const cappedDifference = (start: Vector, end: Vector, cap: number) =>
  start.difference(end).cap(cap)

export const Drawing = ({
  dimensions,
  dpi,
  characters,
  controlledCharacterKey,
  update,
}: DrawingProps) => {
  const movementCap = 6 * dpi
  const [moveStart, setMoveStart] = React.useState<Vector | null>(null)
  const [moveEnd, setMoveEnd] = React.useState<Vector | null>(null)
  const [menuPosition, setMenuPosition] = React.useState<Vector | null>(null)
  const [selectedTool, setSelectedTool] = React.useState(Tool.Measure)
  const mousePos = useEventValue<MouseEvent, Vector>(
    'mousemove',
    Vector.fromEvent,
  )
  const controlledCharacterPosition = () => {
    const controlledCharacter = _.find(characters, {
      key: controlledCharacterKey,
    })
    if (!controlledCharacter) {
      return
    }

    return Vector.fromXY(controlledCharacter.position)
  }

  const startToUse = {
    [Tool.Measure]: moveStart,
    [Tool.Move]: controlledCharacterPosition(),
  }[selectedTool]

  const endToUse = moveEnd || mousePos

  const measureHandler = (e: React.MouseEvent): void => {
    const point = Vector.fromEvent(e)
    if (moveStart && !moveEnd) {
      setMoveEnd(point)
    } else {
      setMoveStart(point)
      setMoveEnd(null)
    }
  }

  const moveHandler = (e: React.MouseEvent): void => {
    const position = controlledCharacterPosition()
    controlledCharacterKey &&
      position &&
      update(controlledCharacterKey, {
        position: cappedDifference(position, Vector.fromEvent(e), movementCap)
          .add(position)
          .toXY(),
      })

    setSelectedTool(Tool.Measure)
  }

  const handlerForTool = (tool: Tool) => {
    switch (tool) {
      case Tool.Measure:
        return measureHandler
      case Tool.Move:
        return moveHandler
      default:
        console.warn('No handler for tool', Tool[tool])
        return () => {}
    }
  }

  const toolClick = (e: React.MouseEvent) => {
    if (menuPosition) {
      setMenuPosition(null)
      return
    }

    if (e.button !== 0) {
      return
    }

    handlerForTool(selectedTool)(e)
  }

  const menuClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setMoveStart(null)
    setMoveEnd(null)
    setMenuPosition(Vector.fromEvent(e))
  }

  const highlightedChildren = characters.map(character => (
    <CharacterMarker
      key={character.key}
      character={character}
      highlight={
        selectedTool == Tool.Move && character.key === controlledCharacterKey
      }
      dpi={dpi}
    />
  ))

  const plottingLine = () => {
    if (!startToUse || !endToUse) {
      return null
    }

    if (selectedTool === Tool.Measure) {
      return <PlottingLine start={startToUse} end={endToUse} dpi={dpi} />
    }

    if (selectedTool === Tool.Move) {
      const lineVector = startToUse.difference(endToUse)
      const scaledLineVector = lineVector.cap(movementCap)

      return (
        <PlottingLine
          start={startToUse}
          end={startToUse.add(scaledLineVector)}
          dpi={dpi}
        />
      )
    }

    return null
  }

  return (
    <div onClick={toolClick} onContextMenu={menuClick}>
      <svg style={{ ...layerStyle, ...dimensions }}>
        {highlightedChildren}
        {plottingLine()}
      </svg>
      <PopupMenu
        position={menuPosition ? menuPosition.toStyle() : null}
        menuItems={[
          [Tool.Measure, 'Measure'],
          controlledCharacterKey && [Tool.Move, 'Move'],
        ]}
        selectedItem={selectedTool}
        onSelectItem={(selection: Tool) => {
          setSelectedTool(selection)
          setMenuPosition(null)
        }}
      />
    </div>
  )
}

type PlottingLineProps = {
  start: Vector
  end: Vector
  dpi: number
}
const PlottingLine = ({ start, end, dpi }: PlottingLineProps) => {
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
export default Drawing
