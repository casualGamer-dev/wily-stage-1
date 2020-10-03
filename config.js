import firebase from 'firebase'
require('@firebase/firestore')
var firebaseConfig = {
    apiKey: "AIzaSyAPGJscj9szKybOM5giUCJYFThUQUawCLI",
    authDomain: "wily-46919.firebaseapp.com",
    databaseURL: "https://wily-46919.firebaseio.com",
    projectId: "wily-46919",
    storageBucket: "wily-46919.appspot.com",
    messagingSenderId: "831672649145",
    appId: "1:831672649145:web:007839ef910fcd7ec82268"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore()