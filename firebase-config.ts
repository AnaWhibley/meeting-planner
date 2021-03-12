import firebase from 'firebase/app';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyDeRTou2m4_kdHijLMEvCXaWgoCTa2MoUE",
    authDomain: "meeting-planner-tfg.firebaseapp.com",
    projectId: "meeting-planner-tfg",
    storageBucket: "meeting-planner-tfg.appspot.com",
    messagingSenderId: "161158269703",
    appId: "1:161158269703:web:6402b571592395f1f213a2",
    measurementId: "G-731N4M9KS8"
};

firebase.initializeApp(config);

export default firebase;