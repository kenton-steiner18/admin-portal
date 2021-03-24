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

document.addEventListener('DOMContentLoaded', function () {

  try {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.

      } else {
        // User is signed out.
        window.location = "../index.html"
      }
    })
  } catch (e) {
    alert(error)
  }
})


this.getAllPhotos().then((result) => {
  result.forEach((photo) => {
    firebase.storage().ref("images/photogallery/" + photo.fileName).getDownloadURL().then((url) => {
      var image = document.createElement("img")
      var deleteImage = document.createElement("img")
      var imageSRC = document.createAttribute("src")
      var deleteSRC = document.createAttribute("src")
      var deleteID = document.createAttribute("id")
      var deleteClick = document.createAttribute("onclick")
      var imageHeight = document.createAttribute("height")
      var deleteHeight = document.createAttribute("height")
      var deleteWidth = document.createAttribute("width")
      var imageWidth = document.createAttribute("width")
      imageHeight.value = 200
      imageWidth.value = 200
      deleteHeight.value = 50
      deleteWidth.value = 50
      imageSRC.value = url
      deleteSRC.value = "../imgs/delete.jpg"
      deleteClick.value = "deletePhoto(this.id)"
      deleteID.value = photo.fileName + "," + photo.key
      deleteImage.setAttributeNode(deleteSRC)
      deleteImage.setAttributeNode(deleteClick)
      deleteImage.setAttributeNode(deleteHeight)
      deleteImage.setAttributeNode(deleteWidth)
      deleteImage.setAttributeNode(deleteID)
      image.setAttributeNode(imageSRC)
      image.setAttributeNode(imageHeight)
      image.setAttributeNode(imageWidth)
      photos.append(image)
      photos.append(deleteImage)
    })
  })
})
function deletePhoto(fileNameKey) {
  var input = fileNameKey.split(',')
  var fileName = input[0]
  var key = input[1]
  firebase.storage().ref("images/photogallery/" + fileName).delete()
  firebase.database().ref("/Photos/" + key).remove()
  reloadPage()
}
function toggleActive() {
  document.getElementById('sidebar').classList.toggle('active');
}
function reloadPage() {
  location.reload()
}

function logout() {
  firebase.auth().signOut();
  console.log('logged out')
  window.location = "../index.html"
}

function getAllPhotos() {
  return firebase.database().ref('/Photos').orderByChild("date").once('value') // .once returns a Promise
    // Upon .once completing, call a function on the snapshot that is returned to grab 
    // values from the snapshot
    .then(function (snapshot) {
      // Create an array to hold all of the promises to be resolved
      let promises = []
      // For each key in the snapshot, add the value to the array created
      snapshot.forEach(function (key) {
        promises.push(key.val())
      })
      return Promise.all(promises)
    }, // Handles the errors with userRef.once
      function (error) {
        console.log(error)
      })
    // Upon Promise.all returning all of the user values from the database,
    // return the gathered values
    .then(function (values) {
      return values
    })
}