import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as firebase from 'firebase/app'
import 'firebase/firestore'

import App from './App'

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

const store = firebase.app().firestore()

ReactDOM.render(<App store={store} />, document.getElementById('battlemap'))
