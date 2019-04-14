import { CSSProperties } from 'react'
import * as _ from 'lodash'

export const layerStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  bottom: 0,
}

export const ignoreZoom = (style: CSSProperties): CSSProperties =>
  _.mapValues(
    style,
    <T extends string | number>(val: T): T => {
      if (typeof val === 'number') {
        return (val / window.devicePixelRatio) as T
      }

      const stringVal = val as string
      if (stringVal.endsWith('px')) {
        return (Math.round(
          parseFloat(stringVal.substring(0, stringVal.length - 2)) /
            window.devicePixelRatio,
        ) + 'px') as T
      }

      return val
    },
  ) as CSSProperties
