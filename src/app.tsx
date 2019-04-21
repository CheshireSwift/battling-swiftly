import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as _ from 'lodash'
import * as firebase from 'firebase/app'
import 'firebase/firestore'

import queryStringData from './helpers/queryStringData'
import Background from './layers/Background'
import Drawing from './layers/Drawing'
import useFirebase from './data/useFirebase'
import Help from './ui/Help'
import Options, { useOptions } from './data/Options'
import Character from './data/Character'
import CharacterSelector from './ui/CharacterSelector'

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

const App = () => {
  const [showOptions, setShowOptions] = React.useState(false)
  const [options, setOption] = useOptions()
  const [imageDimensions, setImageDimensions] = React.useState({
    height: 0,
    width: 0,
  })

  const query = queryStringData({
    valueKeys: ['bg', 'dpi', 'collection'],
    arrayKeys: ['char'],
  })

  const [selectedCharacter, setSelectedCharacter] = React.useState(
    _.first(query.arrays.char),
  )

  if (!query.values.bg) {
    return <div>Require background image (?bg=url)</div>
  }

  if (!query.values.dpi) {
    return <div>Require dpi (?dpi=number)</div>
  }

  if (!query.values.collection) {
    return <div>Require data collection (?collection=collection-name)</div>
  }

  const dpi = parseInt(query.values.dpi)

  const collection = firebase
    .app()
    .firestore()
    .collection(query.values.collection)

  const snapshot = useFirebase(collection)

  if (!snapshot) {
    return <div>Could not find collection {query.values.collection}</div>
  }

  const characters = snapshot.docs.map(
    doc => ({ key: doc.id, ...doc.data() } as Character),
  )

  return (
    <Options.Provider value={options}>
      <Background url={query.values.bg} onLoadDimensions={setImageDimensions} />
      <Drawing
        dimensions={imageDimensions}
        dpi={dpi}
        controlledCharacterKey={selectedCharacter}
        characters={characters}
        update={(key, data) => {
          collection.doc(key).update(data)
        }}
        onOptionsSelected={() => {
          setShowOptions(true)
        }}
      />
      <Help
        show={showOptions}
        setOption={setOption}
        onClose={() => setShowOptions(false)}
      />
      {selectedCharacter &&
        query.arrays.char &&
        query.arrays.char.length > 1 && (
          <CharacterSelector
            characters={characters}
            availableKeys={query.arrays.char}
            selected={selectedCharacter}
            onSelect={setSelectedCharacter}
          />
        )}
    </Options.Provider>
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
