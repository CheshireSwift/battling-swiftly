import * as React from 'react'
import * as _ from 'lodash'
import { Vector } from '../helpers/Vector'

type PopupMenuProps<T> = {
  position: { top: number; left: number } | Vector | null
  menuItems: Array<[T, React.ReactNode] | null | undefined | false | '' | 0>
  selectedItem?: T
  onSelectItem?: (key: T) => void
}

const coerceVector = (position: { top: number; left: number } | Vector) =>
  position instanceof Vector ? position.toStyle() : position

export const PopupMenu = <T extends any>(props: PopupMenuProps<T>) =>
  props.position ? (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'all',
        ...coerceVector(props.position),
      }}
    >
      {_.compact(props.menuItems).map(([key, value]) => (
        <div
          key={key.toString()}
          id={'popup-menu-item-' + key}
          style={{
            border: props.selectedItem === key ? '1px solid lime' : 'none',
            background: 'gray',
          }}
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

export default PopupMenu
