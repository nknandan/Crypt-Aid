import firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// const clientCredentials = {
//   apiKey: NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: "G-NK5H0T3450",
// };

const clientCredentials = {
  apiKey: "AIzaSyBYdQD0QccL-YTP5Xo-bO0Ncp3dnaRkAKM",
  authDomain: "cryptaid-423dd.firebaseapp.com",
  projectId: "cryptaid-423dd",
  storageBucket: "cryptaid-423dd.appspot.com",
  messagingSenderId: "932511392531",
  appId: "1:932511392531:web:599c110c503c76451ff0e6",
  measurementId: "G-NK5H0T3450",
};

const app = initializeApp(clientCredentials);

// export default firebase;
export const storage = getStorage(app);
