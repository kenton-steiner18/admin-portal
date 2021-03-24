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
var db = firebase.firestore()

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.

  } else {
    // User is signed out.
    window.location = "../index.html"
  }
})

document.addEventListener('DOMContentLoaded', function () {

  try {
  } catch (e) {
    alert(error)
  }
})

function logout() {
  firebase.auth().signOut();
  console.log('logged out')
  window.location = "../index.html"
}

function toggleActive() {
  document.getElementById('sidebar').classList.toggle('active');
}


getData("Speakers").then((speakers) => {
  speakers.forEach(speaker => {
    speaker = speaker.data()
    //  create HTML table row for current participant
    var speakers = document.getElementById("speakersbody")
    var currentSpeaker = document.createElement("tr")
    var photoTD = document.createElement("td")
    var photoIMG = document.createElement("img")
    var name = document.createElement("td")
    var title = document.createElement("td")
    var email = document.createElement("td")
    var desc = document.createElement("td")
    var edit = document.createElement("td")
    var rmv = document.createElement("td")

    //  create buttons and give row a uid
    var id = document.createAttribute("id")
    id.value = speaker.speakerID

    var editButton = document.createElement("button")
    editButton.innerHTML = "Edit"
    editButton.setAttribute("class","btn btn-info")
    editButton.setAttribute("onclick","editSpeaker(this.id)")
    editButton.setAttributeNode(id)

    var deleteButton = document.createElement("button")
    deleteButton.innerHTML = "Delete"
    deleteButton.setAttribute("class", "btn btn-danger")
    deleteButton.setAttribute("onclick", "deleteSpeaker(this.id)")
    deleteButton.setAttributeNode(id.cloneNode())

    currentSpeaker.setAttributeNode(id.cloneNode())

    var photoValue = document.createAttribute("value")
    photoValue.value = speaker.Photo
    var photoSizeAttribute = document.createAttribute("style")
    photoSizeAttribute.value = "width:50px; height:50px;"
    photoIMG.setAttributeNode(photoSizeAttribute)
    photoTD.setAttributeNode(photoValue)
  

    //  Set value of each section of the table row
    if (speaker.Photo != "../imgs/default.jpg") {
      firebase.storage().ref("images/speakerPhotos/" + speaker.Photo).getDownloadURL().then(url => {
        photoIMG.src = url
      })
    } else {
      photoIMG.src = speaker.Photo
    }
    name.innerHTML = speaker.Name
    title.innerHTML = speaker.Title
    email.innerHTML = speaker.Email
    desc.innerHTML = speaker.Description
    edit.append(editButton)
    rmv.append(deleteButton)

    photoTD.appendChild(photoIMG)
    currentSpeaker.appendChild(photoTD)
    currentSpeaker.appendChild(name)
    currentSpeaker.appendChild(title)
    currentSpeaker.appendChild(email)
    currentSpeaker.appendChild(desc)
    currentSpeaker.appendChild(edit)
    currentSpeaker.appendChild(rmv)
    speakers.appendChild(currentSpeaker)
  })

})

function editSpeaker(uid) {
  var currentRow = document.getElementById(uid)
  currentRow.setAttribute("class", "table-warning")
  var tds = currentRow.childNodes
  var name = tds[1].innerHTML
  var title = tds[2].innerHTML
  var email = tds[3].innerHTML
  var desc = tds[4].innerHTML
  var photo = tds[0].innerHTML
  tds[0].innerHTML += "<input type='file' id='newprofilepicture' style='width:200px;' accept='image/gif, image/jpeg, image/png'><br>"
  tds[0].innerHTML += "<button id='" + uid + "' onclick='removePhoto(this.id)'>Remove Photo</button>"
  var speakerNameInputTD = document.createElement("td")
var speakerNameInput = document.createElement("input")
speakerNameInput.setAttribute("id", "nameInput")
speakerNameInput.innerHTML=name
speakerNameInput.value = name
speakerNameInputTD.appendChild(speakerNameInput)

var speakerTitleInputTD = document.createElement("td")
var speakerTitleInput = document.createElement("input")
speakerTitleInput.setAttribute("id", "titleInput")
speakerTitleInput.innerHTML=title
speakerTitleInput.value = title
speakerTitleInputTD.appendChild(speakerTitleInput)

var speakerEmailInputTD = document.createElement("td")
var speakerEmailInput = document.createElement("input")
speakerEmailInput.setAttribute("id", "emailInput")
speakerEmailInput.innerHTML=name
speakerEmailInput.value = name
speakerEmailInputTD.appendChild(speakerEmailInput)

var speakerDescInputTD = document.createElement("td")
var speakerDescInput = document.createElement("input")
speakerDescInput.setAttribute("id", "descInput")
speakerDescInput.innerHTML=desc
speakerDescInput.value = desc
speakerDescInputTD.appendChild(speakerDescInput)
  tds[1].replaceWith(speakerNameInputTD)
  tds[2].replaceWith(speakerTitleInputTD)
  tds[3].replaceWith(speakerEmailInputTD)
  tds[4].replaceWith(speakerDescInputTD)
  tds[5].firstChild.innerHTML = "Save"
  tds[5].firstChild.setAttribute("onclick", "saveSpeaker(this.id,'" + name + "','" + photo + "')")
  tds[6].firstChild.innerHTML = "Cancel"
  tds[6].firstChild.setAttribute("onclick", "resetRow(this.id,'" + name + "','" + title + "','" + dept + "','" + email + "','" + desc + "','" + photo + "')")
}

function resetRow(uid, name, title, email, desc, photo) {
  var currentRow = document.getElementById(uid)
  currentRow.removeAttribute("class")
  var tds = currentRow.childNodes
  tds[0].innerHTML = photo
  tds[1].innerHTML = name
  tds[2].innerHTML = title
  tds[3].innerHTML = email
  tds[4].innerHTML = desc
  tds[5].firstChild.innerHTML = "Edit"
  tds[5].firstChild.setAttribute("onclick", "editSpeaker(this.id)")
  tds[6].firstChild.innerHTML = "Delete"
  tds[6].firstChild.setAttribute("onclick", "deleteSpeaker(this.id)")
}

function removePhoto(uid) {
  var currentRow = document.getElementById(uid)
  var fields = currentRow.childNodes
  var photoName = fields[0].getAttribute("value")
  if (confirm("Are you sure you want to delete this speaker's photo?")) {
    firebase.storage().ref("images/speakerPhotos/" + photoName).delete().then(() => {
      db.collection("Speakers").doc(uid).update({
        Photo: "../imgs/default.jpg"
      }).then(() => {
        location.reload()
      })
    })
  }
}

function createSpeaker() {
  var name, title, dept, email, desc, photo
  name = document.getElementById("createName").value
  title = document.getElementById("createTitle").value
  email = document.getElementById("createEmail").value
  desc = document.getElementById("createDesc").value
  photo = "../imgs/default.jpg"
  newSpeakerRef = db.collection("Speakers").doc()
  newSpeakerRef.set({
    Photo: photo,
    Name: name,
    Title: title,
    Email: email,
    Description: desc,
    speakerID: newSpeakerRef.id
  }).then(() => {
    location.reload()
  })
}

function saveSpeaker(uid, oldName, photo) {
  console.log(uid)
  var currentRow = document.getElementById(uid)
  var fields = currentRow.childNodes
  var photoName = fields[0].getAttribute("value")
  var name = document.getElementById("nameInput").value
  var title = document.getElementById("titleInput").value
  var email = document.getElementById("emailInput").value
  var desc = document.getElementById("descInput").value
  var newPhoto = document.getElementById('newprofilepicture').files[0]
  db.collection("Speakers").doc(uid).set({
    Name: name,
    Title: title,
    Email: email,
    speakerID: uid,
    Description: desc,
    Photo: name + ".jpg",
})
  if (newPhoto == null) {
    db.collection("Speakers").doc(uid).update({
      Name: name,
      Title: title,
      Email: email,
      Description: desc,
    })
    fields[0].innerHTML = photo
  } else {
    if (photoName != "../imgs/default.jpg") {
      firebase.storage().ref("images/speakerPhotos/" + photoName).delete().then(() => {
        var fileRef = firebase.storage().ref("images/speakerPhotos/" + newPhoto.name)
        fileRef.put(newPhoto).then(() => {
          db.collection("Speakers").doc(uid).update({
            Photo: newPhoto.name,
            Name: name,
            Title: title,
            Email: email,
            Description: desc,
          }).then(() => { location.reload() })
        })
      })
    } else {
      var fileRef = firebase.storage().ref("images/speakerPhotos/" + newPhoto.name)
      fileRef.put(newPhoto).then(() => {
        db.collection("Speakers").doc(uid).update({
          Photo: newPhoto.name,
          Name: name,
          Title: title,
          Email: email,
          Description: desc,
        }).then(() => { location.reload() })
      })
    }

  }
  fields[1].innerHTML = name
  fields[2].innerHTML = title
  fields[3].innerHTML = email
  fields[4].innerHTML = desc
  fields[5].firstChild.innerHTML = "Edit"
  fields[5].firstChild.setAttribute("onclick", "editSpeaker(this.id)")
  fields[6].firstChild.innerHTML = "Delete"
  fields[6].firstChild.setAttribute("onclick", "deleteSpeaker(this.id)")
  if (oldName != name) {
    getData("Events").then(events => {
      events.forEach(event => {
        event = event.data()
        var newSpeakerList = event.Speaker
        var index = newSpeakerList.indexOf(oldName)
        if (index !== -1 ) {
          newSpeakerList[index] = name
        }
        db.collection("Events").doc(event.eventID).update({
          Speaker: newSpeakerList
        })
      })

    })
  }
}

function searchTable() {
  var input, filter, table, tr, i
  input = document.getElementById("searchInput")
  filter = input.value.toUpperCase()
  table = document.getElementById("speakers")
  tr = table.getElementsByTagName("tr")

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    fntd = tr[i].getElementsByTagName("td")[2]
    titletd = tr[i].getElementsByTagName("td")[3]
    if (fntd || lntd) {
      fnValue = fntd.textContent || fntd.innerText
      titleValue = titletd.textContent || titletd.innerText
      if ((fnValue.toUpperCase().indexOf(filter) > -1) || titleValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = ""
      } else {
        tr[i].style.display = "none"
      }
    }
  }
}

function deleteSpeaker(uid) {
  var photo = document.getElementById(uid).childNodes[0].getAttribute("value")
  var name = document.getElementById(uid).childNodes[1].innerHTML
  var title = document.getElementById(uid).childNodes[2].innerHTML
  if (confirm("This will permanently remove " + name + " " + title)) {
    if (photo != "../imgs/default.jpg") {
      firebase.storage().ref("images/speakerPhotos/" + photo).delete().catch((error) => {
        alert("failed: " + error)
      })
    }
    db.collection('Speakers').doc(uid).delete().then(() => {
    location.reload()
    })
  }
}

/**
 * 
 * @param {*} dataWanted 
 */
function getData(dataWanted){
  return db.collection(dataWanted).get()
}