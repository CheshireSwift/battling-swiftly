import * as React from 'react'

import { layerStyle } from '../helpers/styleSnippets'

export const Background = ({
  url,
  onLoadDimensions,
}: {
  url: string
  onLoadDimensions: (dimensions: { height: number; width: number }) => void
}) => (
  <img
    style={{ ...layerStyle, height: undefined, width: undefined }}
    src={url}
    onLoad={e => {
      const img = e.target as HTMLImageElement
      onLoadDimensions({ height: img.height, width: img.width })
    }}
  />
)

export default Background
