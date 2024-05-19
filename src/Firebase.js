import { initializeApp } from "firebase/app";
import {getFirestore} from '@firebase/firestore'
import {getAuth, GoogleAuthProvider} from 'firebase/auth'


const firebaseConfig = {
  apiKey: "AIzaSyCkyTP9DUx1s3prT2_SUR3co7lLRDOPMCI",
  authDomain: "expensetracker-c30f7.firebaseapp.com",
  projectId: "expensetracker-c30f7",
  storageBucket: "expensetracker-c30f7.appspot.com",
  messagingSenderId: "946768997276",
  appId: "1:946768997276:web:82f4cd6e2eba6012cd7659"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)

export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()

