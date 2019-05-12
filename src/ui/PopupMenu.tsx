import * as React from 'react'
import * as _ from 'lodash'
import { ignoreZoom } from '../helpers/styleSnippets'
import { cMenuBg } from '../styling/constants'
import Options from '../data/Options'

type PopupMenuProps<T> = {
  position: { top: number; left: number } | null
  menuItems: Array<[T, React.ReactNode] | null | undefined | false | '' | 0>
  selectedItem?: T
  onSelectItem?: (key: T) => void
}

export const PopupMenu = <T extends any>(props: PopupMenuProps<T>) => {
  const options = React.useContext(Options)
  return props.position ? (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'all',
        ...props.position,
      }}
    >
      {_.compact(props.menuItems).map(([key, value]) => (
        <div
          key={key.toString()}
          id={'popup-menu-item-' + key}
          style={ignoreZoom({
            padding: 2,
            background: cMenuBg,
            borderColor: options.drawColour,
            borderStyle: 'solid',
            borderWidth: props.selectedItem === key ? 1 : 0,
            color: options.drawColour,
          })}
          onClick={e => {
            props.onSelectItem && props.onSelectItem(key)
            e.stopPropagation()
          }}
        >
          {value}
        </div>
      ))}
    </div>
  ) : null
}

export default PopupMenu
