import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as firebase from 'firebase/app'
import 'firebase/firestore'

import queryStringData from './helpers/queryStringData'
import Background from './layers/Background'
import Drawing from './layers/Drawing'
import palette from './graphics/palette'
import CharacterMarker, { Character } from './graphics/CharacterMarker'
import useFirebase from './data/useFirebase'

// const colours = [
//   palette.friendly,
//   palette.hostile,
//   palette.neutral,
//   palette.unknown,
// ]
// let i = 0
// setTimeout(() => {
//   i = (i + 1) % colours.length
// }, 300)

// const characters = [
//   {
//     name: 'Waffle',
//     position: { x: 240, y: 400 },
//     color: palette.friendly,
//   },
//   {
//     name: 'Puppy',
//     position: { x: 690, y: 420 },
//     color: palette.unknown,
//   },
//   {
//     name: 'Mister E',
//     position: { x: 600, y: 400 },
//     color: palette.neutral,
//   },
//   {
//     name: 'Intoner',
//     position: { x: 150, y: 200 },
//     color: palette.hostile,
//   },
//   {
//     name: 'Greenjacket',
//     position: { x: 300, y: 150 },
//     color: palette.hostile,
//   },
// ]

const App = () => {
  const [imageDimensions, setImageDimensions] = React.useState({
    height: 0,
    width: 0,
  })

  const query = queryStringData<{
    bg: string
    dpi: string
    collection: string
  }>({
    valueKeys: ['bg', 'dpi', 'collection'],
  })

  if (!query.bg) {
    return <div>Require background image (?bg=url)</div>
  }

  if (!query.dpi) {
    return <div>Require dpi (?dpi=number)</div>
  }

  if (!query.collection) {
    return <div>Require data collection (?collection=collection-name)</div>
  }

  const dpi = parseInt(query.dpi)

  const { snapshot } = useFirebase(
    firebase
      .app()
      .firestore()
      .collection(query.collection),
  )

  if (!snapshot) {
    return <div>Could not find collection {query.collection}</div>
  }

  const characters = snapshot.docs.map(doc => doc.data() as Character)

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

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyAZwTp8XAqss1HaoEtr_Ei5Zd5RE3p6v1k',
  authDomain: 'battling-swiftly.firebaseapp.com',
  databaseURL: 'https://battling-swiftly.firebaseio.com',
  projectId: 'battling-swiftly',
  storageBucket: 'battling-swiftly.appspot.com',
  messagingSenderId: '451921975216',
}

firebase.initializeApp(config)

ReactDOM.render(<App />, document.getElementById('battlemap'))
