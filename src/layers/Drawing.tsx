import * as _ from 'lodash'
import * as React from 'react'
import { ReactRough } from 'react-rough'
import Character from '../data/Character'
import Tool from '../data/Tool'
import CharacterMarker from '../graphics/CharacterMarker'
import PlottingLine from '../graphics/PlottingLine'
import { useEventValue } from '../helpers/hooks'
import { layerStyle } from '../helpers/styleSnippets'
import Vector from '../helpers/Vector'
import PopupMenu from '../ui/PopupMenu'

type Dimensions = { height: number; width: number }
type DrawingProps = {
  dimensions: Dimensions
  dpi: number
  characters: Character[]
  controlledCharacterKey?: string
  update: (key: string, data: Partial<Character>) => void
  onOptionsSelected: () => void
}

const cappedDifference = (start: Vector, end: Vector, cap: number) =>
  start.difference(end).cap(cap)

const DrawingCanvas = ({
  dimensions,
  dpi,
  moveStart,
  moveEnd,
  movementCap,
  selectedTool,
  characters,
  controlledCharacterKey,
  controlledCharacterPosition,
}: {
  dimensions: Dimensions
  dpi: number
  moveStart: Vector | null
  moveEnd: Vector | null
  movementCap: number
  selectedTool: Tool
  characters: Character[]
  controlledCharacterKey: string | undefined
  controlledCharacterPosition: Vector | undefined
}) => {
  const mousePos = useEventValue<MouseEvent, Vector>(
    'mousemove',
    Vector.fromEvent,
  )

  const startToUse = {
    [Tool.Measure]: moveStart,
    [Tool.Move]: controlledCharacterPosition,
  }[selectedTool]
  const endToUse = moveEnd || mousePos

  const markers = _.sortBy(characters, 'radius').map(character => (
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
  ;(Math.random as any).setSeed(123)
  return (
    <div style={{ ...layerStyle }}>
      <ReactRough
        renderer="svg"
        {...dimensions}
        config={{
          options: {
            bowing: 0.5,
            roughness: 0.5,
            fillStyle: 'zigzag',
            fillWeight: 1,
          },
        }}
      >
        {markers}
        {plottingLine()}
      </ReactRough>
    </div>
  )
}
export const Drawing = ({
  dimensions,
  dpi,
  characters,
  controlledCharacterKey,
  update,
  onOptionsSelected,
}: DrawingProps) => {
  const movementCap = 6 * dpi
  const [moveStart, setMoveStart] = React.useState<Vector | null>(null)
  const [moveEnd, setMoveEnd] = React.useState<Vector | null>(null)
  const [menuPosition, setMenuPosition] = React.useState<Vector | null>(null)
  const [selectedTool, setSelectedTool] = React.useState(Tool.Measure)

  const controlledCharacter = _.find(characters, {
    key: controlledCharacterKey,
  })

  const controlledCharacterPosition =
    controlledCharacter && Vector.fromXY(controlledCharacter.position)

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
    controlledCharacterKey &&
      controlledCharacterPosition &&
      update(controlledCharacterKey, {
        position: cappedDifference(
          controlledCharacterPosition,
          Vector.fromEvent(e),
          movementCap,
        )
          .add(controlledCharacterPosition)
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

  return (
    <div onClick={toolClick} onContextMenu={menuClick}>
      <DrawingCanvas
        {...{
          dimensions,
          dpi,
          characters,
          controlledCharacterKey,
          controlledCharacterPosition,
          moveStart,
          moveEnd,
          movementCap,
          selectedTool,
        }}
      />
      <PopupMenu
        position={menuPosition ? menuPosition.toStyle() : null}
        menuItems={[
          [Tool.Measure, 'Measure'],
          controlledCharacterKey && [Tool.Move, 'Move'],
          ['options', '...'] as ['options', string],
        ]}
        selectedItem={selectedTool}
        onSelectItem={(selection: Tool | 'options') => {
          if (selection === 'options') {
            onOptionsSelected()
          } else {
            setSelectedTool(selection)
          }

          setMenuPosition(null)
        }}
      />
    </div>
  )
}

export default Drawing
