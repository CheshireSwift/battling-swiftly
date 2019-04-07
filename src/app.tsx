import * as React from 'react'
import * as ReactDOM from 'react-dom'

import QueryString from './helpers/QueryString'
import Background from './layers/Background'
import { Toolbox, Tool } from './layers/Toolbox'
import Drawing from './layers/Drawing'

interface QueryStringData {
  bg: string
}

const App = () => {
  const [imageDimensions, setImageDimensions] = React.useState({
    height: 0,
    width: 0,
  })
  return (
    <QueryString<QueryStringData> valueKeys={['bg']}>
      {query => (
        <>
          <Background url={query.bg} onLoadDimensions={setImageDimensions} />
          <Drawing dimensions={imageDimensions} />
          <Toolbox selectedTool={Tool.Measure} />
        </>
      )}
    </QueryString>
  )
}

ReactDOM.render(<App />, document.getElementById('battlemap'))
