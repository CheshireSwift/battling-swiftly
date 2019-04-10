import * as firebase from 'firebase/app'
import 'firebase/firestore'

const config = {
  apiKey: 'AIzaSyAZwTp8XAqss1HaoEtr_Ei5Zd5RE3p6v1k',
  authDomain: 'battling-swiftly.firebaseapp.com',
  databaseURL: 'https://battling-swiftly.firebaseio.com',
  projectId: 'battling-swiftly',
  storageBucket: 'battling-swiftly.appspot.com',
  messagingSenderId: '451921975216',
}

firebase.initializeApp(config)

const app = firebase.app()
const collection = app.firestore().collection('test-collection')

const palette = {
  friendly: 'lime',
  hostile: 'orange',
  unknown: 'cyan',
  neutral: 'yellow',
}

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

async function refreshData() {
  const oldCollectionSnapshot = await collection.get()
  const deletion = Promise.all(
    oldCollectionSnapshot.docs.map(oldDoc =>
      collection.doc(oldDoc.id).delete(),
    ),
  )
  const creation = Promise.all(
    characters.map(character => collection.add(character)),
  )

  await Promise.all([creation, deletion])
}

refreshData().then(() => {
  console.log('Done!')
  process.exit()
})
