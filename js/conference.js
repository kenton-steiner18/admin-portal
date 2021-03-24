const config = {
  apiKey: "AIzaSyCrHzn2kmqc68JyL-NMyo-aPlp2fF__SPA",
  authDomain: "conference-application-2d211.firebaseapp.com",
  projectId: "conference-application-2d211",
  storageBucket: "conference-application-2d211.appspot.com",
  messagingSenderId: "901608938288",
  appId: "1:901608938288:web:33839525f36d73944c06f5",
  measurementId: "G-9R37XPH0FN"
};
  firebase.initializeApp(config)
  var db = firebase.firestore()
  
  document.addEventListener('DOMContentLoaded', function () {
  
    try {
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          // User is signed in.
  
        } else {
          // User is signed out.
          window.location = "../index.html"
        }
      });
    } catch (e) {
      alert(error)
    }
  })
  
  function toggleActive() {
    document.getElementById('sidebar').classList.toggle('active')
  }

getData("Conference_Info").then((result) => {
    result.forEach((conference) => {
      conference = conference.data()
        document.getElementById("titleOfConference").value = conference.ConferenceName
        document.getElementById("hotelName").value = conference.HotelName
        document.getElementById("hotelPhone").value = conference.Phone
        document.getElementById("hotelAddress").value = conference.HotelAddress
        document.getElementById("hotelWebsite").value = conference.Webpage
        document.getElementById("homeparagraph").value = conference.HomeParagraph
    })
})

function saveConferenceInfo() {
    db.collection('Conference_Info').doc(conference.ConferenceName).update({
        ConferenceName: document.getElementById("titleOfConference").value,
        HotelName: document.getElementById("hotelName").value,
        Phone: document.getElementById("hotelPhone").value,
        HotelAddress: document.getElementById("hotelAddress").value,
        Webpage: document.getElementById("hotelWebsite").value,
        HomeParagraph: document.getElementById("homeparagraph").value,
    }).then(() => {
        alert("Information has been successfully saved to the database.")
    }).catch((error) => {
        alert("Got this error:" + error)
    })
}
  function getData(dataWanted){
    return db.collection(dataWanted).get()
  }