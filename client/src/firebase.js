
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAOMQwUFLKrnPmpQqOxq5vqWC19egWdl-g",
  authDomain: "music-player-48afa.firebaseapp.com",
  projectId: "music-player-48afa",
  storageBucket: "music-player-48afa.appspot.com",
  messagingSenderId: "125966705107",
  appId: "1:125966705107:web:b18e53d1bcbf937bb34f26"
};

export const app = initializeApp(firebaseConfig);