const config = {
  apiKey: "AIzaSyCrHzn2kmqc68JyL-NMyo-aPlp2fF__SPA",
  authDomain: "conference-application-2d211.firebaseapp.com",
  projectId: "conference-application-2d211",
  storageBucket: "conference-application-2d211.appspot.com",
  messagingSenderId: "901608938288",
  appId: "1:901608938288:web:33839525f36d73944c06f5",
  measurementId: "G-9R37XPH0FN"
};
firebase.initializeApp(config);

document.addEventListener('DOMContentLoaded', function () {

  try {

    let app = firebase.app();
    let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
    document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        
      } else {
        // User is signed out.
        window.location = "../index.html"
      }
    });
  } catch (e) {
    console.log(e);
    document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
  }
});

function toggleActive() {
  document.getElementById('sidebar').classList.toggle('active');
}

function logout() {
  firebase.auth().signOut();
  console.log('logged out')
  window.location = "../index.html"
}