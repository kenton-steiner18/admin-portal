
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
var db = firebase.firestore();



document.addEventListener('DOMContentLoaded', function () {
  try {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        // User is signed out.
        window.location = "../index.html"
      }
    })
  } catch (e) {
    alert(error)
  }
})

function toggleActive() {
  document.getElementById('sidebar').classList.toggle('active')
}

  getData("Participants").then((participants) => {
    var partArray = []
    participants.forEach(participant => {
      participant = participant.data()
      partArray.push(participant)
      //  create HTML table row for current participant
      var participants = document.getElementById("participantsbody")
      var currentParticipant = document.createElement("tr")
      var photoTD = document.createElement("td")
      var photoIMG = document.createElement("img")
      var fn = document.createElement("td")
      var ln = document.createElement("td")
      var delPhoto = document.createElement("td")
      var edit = document.createElement("td")
      var rmv = document.createElement("td")


      //  create buttons and give row a uid
      var id = document.createAttribute("id")
      id.value = participant.userID

      var deletePhotoButton = document.createElement("button")
      deletePhotoButton.innerHTML = "Remove Photo"
      deletePhotoButton.setAttribute("class", "btn btn-warning")
      deletePhotoButton.setAttribute("onclick", "removePhoto(this.id)")
      deletePhotoButton.setAttributeNode(id.cloneNode())

      var editButton = document.createElement("button")
      editButton.innerHTML = "Edit"
      editButton.setAttribute("class", "btn btn-info")
      editButton.setAttribute("onclick", "editParticipant(this.id)")
      editButton.setAttributeNode(id)

      var deleteButton = document.createElement("button")
      deleteButton.innerHTML = "Delete"
      deleteButton.setAttribute("class", "btn btn-danger")
      deleteButton.setAttribute("onclick", "deleteParticipant(this.id)")
      deleteButton.setAttributeNode(id.cloneNode())

      currentParticipant.setAttributeNode(id.cloneNode(true))

      //  Set value of each section of the table row
      var photoValue = document.createAttribute("value")
      photoValue.value = participant.Photo
      var photoSizeAttribute = document.createAttribute("style")
      photoSizeAttribute.value = "width:50px; height:50px;"
      photoIMG.setAttributeNode(photoSizeAttribute)
      photoTD.setAttributeNode(photoValue)

      if (participant.Photo != "../imgs/default.jpg") {
        firebase.storage().ref("images/profilePictures/" + participant.Photo).getDownloadURL().then(url => {
          photoIMG.src = url
        })
      } else {
        photoIMG.src = participant.Photo
      }

      fn.innerHTML = participant.FirstName
      ln.innerHTML = participant.LastName
      delPhoto.append(deletePhotoButton)
      edit.append(editButton)
      rmv.append(deleteButton)

      //  add the values to the row and then add the row to the table
      photoTD.appendChild(photoIMG)
      currentParticipant.append(photoTD)
      currentParticipant.appendChild(fn)
      currentParticipant.appendChild(ln)
      currentParticipant.appendChild(edit)
      currentParticipant.appendChild(delPhoto)
      currentParticipant.appendChild(rmv)
      participants.appendChild(currentParticipant)
    })
  })


function editParticipant(uid) {
  var currentRow = document.getElementById(uid)
  currentRow.setAttribute("class", "table-warning")

  //Store all the current values in variables
  var tds = currentRow.childNodes
  var firstName = tds[1].innerHTML
  var lastName = tds[2].innerHTML

  var firstNameInputTD = document.createElement("td")
  var lastNameInputTD = document.createElement("td")
  var firstNameInput = document.createElement("input")
  var lastNameInput = document.createElement("input")
  firstNameInput.setAttribute("id", "fnInput")
  lastNameInput.setAttribute("id", "lnInput")
  firstNameInput.innerHTML = firstName
  firstNameInput.value = firstName
  lastNameInput.innerHTML = lastName
  lastNameInput.value = lastName
  firstNameInputTD.appendChild(firstNameInput)
  lastNameInputTD.appendChild(lastNameInput)

  

  tds[1].replaceWith(firstNameInputTD)
  tds[2].replaceWith(lastNameInputTD)
  tds[3].replaceWith(newFuncTD)
  tds[4].replaceWith(newYearTD)
  tds[3].firstChild.innerHTML = "Save"
  tds[3].firstChild.setAttribute("onclick", "saveParticipant(this.id)")
  tds[4].firstChild.innerHTML = "Remove Photo"
  tds[4].firstChild.setAttribute("onclick", "removePhoto(this.id)")
  tds[5].firstChild.innerHTML = "Cancel"
  tds[5].firstChild.setAttribute("onclick", "resetRow(this.id,'" + firstName + "','" + lastName + "','" + currentYear + "','" + currentFunction + "')")
}

function resetRow(uid, firstname, lastname) {
  var currentRow = document.getElementById(uid)
  currentRow.removeAttribute("class")
  var tds = currentRow.childNodes
  tds[1].innerHTML = firstname
  tds[2].innerHTML = lastname
  tds[3].firstChild.innerHTML = "Edit"
  tds[3].firstChild.setAttribute("onclick", "editParticipant(this.id)")
  tds[4].firstChild.innerHTML = "Delete"
  tds[4].firstChild.setAttribute("onclick", "deleteParticipant(this.id)")
}

function removePhoto(uid) {
  var currentRow = document.getElementById(uid)
  var fields = currentRow.childNodes
  var photoName = fields[0].getAttribute("value")
  if (confirm("Are you sure you want to delete this participant's photo?")) {
    firebase.storage().ref("images/profilePictures/" + photoName).delete().then(() => {
      db.collection("Participants").doc(uid).update({
        Photo: "../imgs/default.jpg"
      })
    })
    fields[0].childNodes[0].src = "../imgs/default.jpg"
    currentRow.removeAttribute("class")
  }
}
function saveParticipant(uid) {
  var currentRow = document.getElementById(uid)
  var fields = currentRow.childNodes
  var firstname = document.getElementById("fnInput").value
  var lastname = document.getElementById("lnInput").value
  
    db.collection("Participants").doc(uid).update({
      FirstName: firstname,
      LastName: lastname,
    }).then(() => {
      fields[1].innerHTML = firstname
      fields[2].innerHTML = lastname
      fields[3].firstChild.innerHTML = "Edit"
      fields[3].firstChild.setAttribute("onclick", "editParticipant(this.id)")
      fields[5].firstChild.innerHTML = "Delete"
      fields[5].firstChild.setAttribute("onclick", "deleteParticipant(this.id)")
      currentRow.removeAttribute("class")
    })
  
}

function deleteParticipant(uid) {
  var photo = document.getElementById(uid).childNodes[0].getAttribute("value")
  var fn = document.getElementById(uid).childNodes[1].innerHTML
  var ln = document.getElementById(uid).childNodes[2].innerHTML
  if (confirm("This will permanently remove " + fn + " " + ln)) {
    if (photo != "../imgs/default.jpg") {
      firebase.storage().ref("images/profilePictures/" + photo).delete().then(() => {
        db.collection('Participants').doc(uid).delete().then(() => {
          getData("Groups").then((groups) => {
            groups.forEach(group => {
              group = group.data()
              var index = group.Participants.indexOf(uid)
              if ( index > -1) {
                group.Participants = group.Participants.splice(index,1)
              }
            })
          }).then(() => {
          location.reload()
        })
      })
      }).catch((error) => {
        alert("failed: " + error)
      })
    } else {
      db.collection('Participants').doc(uid).delete().then(() => {
        getData("Groups").then((groups) => {
          groups.forEach(group => {
            group = group.data()
            var index = group.Participants.indexOf(uid)
            if ( index > -1) {
              group.Participants = group.Participants.splice(index,1)
            }
          })
        }).then(() => {
        location.reload()
      })
    })
    }
  }
}

function logout() {
  firebase.auth().signOut()
  window.location = "../index.html"
}

function createParticipant() {
  var fn = document.getElementById("createFirstName").value
  var ln = document.getElementById("createLastName").value
  newParticipantRef = db.collection("Participants").doc()
  console.log(newParticipantRef.id)
  newParticipantRef.set({
    Photo: "../imgs/default.jpg",
    FirstName: fn,
    LastName: ln,
    userID: newParticipantRef.id
  }).then(() => {
    location.reload()
  })
}

/**
 * 
 * @param {*} dataWanted 
 */
function getData(dataWanted) {
  return db.collection(dataWanted).get()
}

function searchTable() {
  var input, filter, table, tr
  input = document.getElementById("searchInput")
  filter = input.value.toUpperCase()
  table = document.getElementById("participants")
  tr = table.getElementsByTagName("tr")

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    fntd = tr[i].getElementsByTagName("td")[1]
    lntd = tr[i].getElementsByTagName("td")[2]
    if (fntd || lntd) {
      fnValue = fntd.textContent || fntd.innerText
      lnValue = lntd.textContent || lntd.innerText
      if ((fnValue.toUpperCase().indexOf(filter) > -1) || lnValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = ""
      } else {
        tr[i].style.display = "none"
      }
    }
  }
}