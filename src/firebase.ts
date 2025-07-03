import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAjnzEjBNM2KXLQd6ijLsrF6YCDdIYEgfc",
  authDomain: "mindmap-22515.firebaseapp.com",
  databaseURL: "https://mindmap-22515-default-rtdb.firebaseio.com",
  projectId: "mindmap-22515",
  storageBucket: "mindmap-22515.firebasestorage.app",
  messagingSenderId: "198807975175",
  appId: "1:198807975175:web:f200a13bd44734ee38c1a2",
  measurementId: "G-SDX2YVKT0R"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
