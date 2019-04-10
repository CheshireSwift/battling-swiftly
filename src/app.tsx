import * as React from 'react'
import * as ReactDOM from 'react-dom'

import queryStringData from './helpers/queryStringData'
import Background from './layers/Background'
import Drawing from './layers/Drawing'
import palette from './graphics/palette'
import CharacterMarker from './graphics/CharacterMarker'

const colours = [
  palette.friendly,
  palette.hostile,
  palette.neutral,
  palette.unknown,
]
let i = 0
setTimeout(() => {
  i = (i + 1) % colours.length
}, 300)

const characters = [
  {
    name: 'Waffle',
    position: { x: 240, y: 400 },
    color: palette.friendly,
  },
  {
    name: 'Puppy',
    position: { x: 690, y: 420 },
    color: palette.unknown,
  },
  {
    name: 'Mister E',
    position: { x: 600, y: 400 },
    color: palette.neutral,
  },
  {
    name: 'Intoner',
    position: { x: 150, y: 200 },
    color: palette.hostile,
  },
  {
    name: 'Greenjacket',
    position: { x: 300, y: 150 },
    color: palette.hostile,
  },
]

const App = () => {
  const [imageDimensions, setImageDimensions] = React.useState({
    height: 0,
    width: 0,
  })

  const query = queryStringData<{ bg: string; dpi: string }>({
    valueKeys: ['bg', 'dpi'],
  })

  if (!query.bg) {
    return <div>Require background image (?bg=url)</div>
  }

  const dpi = parseInt(query.dpi || '1')

  return (
    <>
      <Background url={query.bg} onLoadDimensions={setImageDimensions} />
      <Drawing dimensions={imageDimensions} dpi={dpi}>
        {characters.map(character => (
          <CharacterMarker
            key={character.name}
            character={character}
            dpi={dpi}
          />
        ))}
      </Drawing>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('battlemap'))
