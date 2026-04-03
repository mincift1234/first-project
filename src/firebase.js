import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyD00lxssxKs1fJUl3BP7Bp_KQ7IpcWARKo',
  authDomain: 'pt-flow-74542.firebaseapp.com',
  projectId: 'pt-flow-74542',
  storageBucket: 'pt-flow-74542.firebasestorage.app',
  messagingSenderId: '127474572782',
  appId: '1:127474572782:web:962408c75ec00d204342ff',
  measurementId: 'G-GS9RSNDS6L',
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
