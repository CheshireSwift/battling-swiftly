import * as React from 'react'
import { layerStyle } from '../helpers/styleSnippets'

export enum Tool {
  Measure,
  Move,
}

enum ToolboxLocation {
  TL,
  TR,
  BL,
  BR,
}

type ToolboxProps = {
  selectedTool: Tool
  onSelectTool: (tool: Tool) => void
}

const cornerStyles: { [corner in ToolboxLocation]: React.CSSProperties } = {
  [ToolboxLocation.TL]: {
    borderTopColor: 'lime',
    borderLeftColor: 'lime',
    top: 0,
    left: 0,
  },
  [ToolboxLocation.TR]: {
    borderTopColor: 'lime',
    borderRightColor: 'lime',
    top: 0,
    right: 0,
  },
  [ToolboxLocation.BL]: {
    borderLeftColor: 'lime',
    borderBottomColor: 'lime',
    bottom: 0,
    left: 0,
  },
  [ToolboxLocation.BR]: {
    borderBottomColor: 'lime',
    borderRightColor: 'lime',
    bottom: 0,
    right: 0,
  },
}

export const Toolbox = ({ selectedTool, onSelectTool }: ToolboxProps) => {
  const [location, setLocation] = React.useState(ToolboxLocation.BL)

  const handleClick = (e: React.MouseEvent) => {
    console.log('clicky')
    e.preventDefault()
  }

  return (
    <div
      style={{
        ...layerStyle,
        position: 'fixed',
        pointerEvents: 'none',
        width: '100%',
        height: '100vh',
      }}
      onContextMenu={handleClick}
      onContextMenuCapture={handleClick}
    >
      {[
        ToolboxLocation.TL,
        ToolboxLocation.TR,
        ToolboxLocation.BL,
        ToolboxLocation.BR,
      ]
        .filter(loc => loc !== location)
        .map(loc => (
          <div
            key={loc}
            onClick={() => setLocation(loc)}
            style={{
              height: 0,
              width: 0,
              border: '1rem solid transparent',
              position: 'absolute',
              pointerEvents: 'all',
              ...cornerStyles[loc],
            }}
          />
        ))}
    </div>
  )
}

export default Toolbox
