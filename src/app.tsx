import * as React from 'react'
import * as ReactDOM from 'react-dom'

import queryStringData from './helpers/queryStringData'
import Background from './layers/Background'
import { Toolbox, Tool } from './layers/Toolbox'
import Drawing from './layers/Drawing'

const App = () => {
  const [imageDimensions, setImageDimensions] = React.useState({
    height: 0,
    width: 0,
  })
  const [selectedTool, setSelectedTool] = React.useState(Tool.Measure)

  const query = queryStringData<{ bg: string }>({ valueKeys: ['bg'] })

  return (
    <>
      <Background url={query.bg} onLoadDimensions={setImageDimensions} />
      <Drawing dimensions={imageDimensions} dpi={100} />
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('battlemap'))
