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
    // onAuthStateChanged for checking if user is logged in
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) { // User is logged in
        /* Functions for handling button clicks on the group pop-up */
        // Move selected participants from the left box to the right
        document.getElementById("btnRight").addEventListener('click', (function (e) {
          // retrieve HTML Select box where participants have been selected
          var select = document.getElementById("availableParticipantsList")
          // If nothing has been selected
          if (select.options.length == 0) {
            alert("Nothing selected")
            e.preventDefault()
          }
          //Iterate through all the <option> elements in the select
          for (i = 0; i < select.options.length; i++) {
            // Current option being checked
            var option = select.options[i]
            // If the current option was selected
            if (option.selected === true) {
              //Copy the option element, set the text and add it to the In Group select box
              var optionToMove = option.cloneNode()
              optionToMove.innerHTML = option.innerHTML
              document.getElementById("groupParticipants").append(optionToMove)
              // Remove the <option> from the available participants list
              select.options[i].remove()
            }
          }
          // Stops default action from being taken if event isn't explicity handled
          e.preventDefault()
        }))

        // Move selected participants from the right box to the left
        document.getElementById("btnLeft").addEventListener('click', (function (e) {
          // retrieve HTML Select box where participants have been selected
          var select = document.getElementById("groupParticipants")
          // If nothing has been selected
          if (select.options.length == 0) {
            alert("Nothing selected")
            e.preventDefault()
          }
          //Iterate through all the <option> elements in the select
          for (i = 0; i < select.options.length; i++) {
            // Current option being checked
            var option = select.options[i]
            // If the current option was selected
            if (option.selected === true) {
              //Copy the option element, set the text and add it to the Out Of Group select box
              var optionToMove = option.cloneNode()
              optionToMove.innerHTML = option.innerHTML
              document.getElementById("availableParticipantsList").append(optionToMove)
              // Remove the <option> from the group participants list
              select.options[i].remove()
            }
          }
          // Stops default action from being taken if event isn't explicity handled
          e.preventDefault()
        }))

        // Move all options from the participant list to group participants
        document.getElementById("btnAllRight").addEventListener('click', (function (e) {
          // Retrieve the HTML Select box with the available participant list
          var select = document.getElementById("availableParticipantsList")

          // Iterate through the participant list and move all options to the group participants
          while (select.options.length > 0) {
            //Copy the option element, set the text and add it to the In Group select box
            var optionToMove = select.options[0].cloneNode()
            optionToMove.innerHTML = select.options[0].innerHTML
            document.getElementById("groupParticipants").append(optionToMove)
            // Remove the <option> from the available participants list
            select.options[0].remove()
          }
        }))
        // Move all options from the group participants list to the available participants list
        document.getElementById("btnAllLeft").addEventListener('click', (function (e) {
          // Retrieve the HTML Select box with the available participant list
          var select = document.getElementById("groupParticipants")
          // Iterate through the participant list and move all options to the group participants
          while (select.options.length > 0) {
            //Copy the option element, set the text and add it to the Out Of Group select box
            var optionToMove = select.options[0].cloneNode()
            optionToMove.innerHTML = select.options[0].innerHTML
            document.getElementById("availableParticipantsList").append(optionToMove)
            // Remove the <option> from the group participants list
            select.options[0].remove()
          }
        }))
      } else {
        // User is signed out.
        window.location = "../index.html"
      }
    })
  } catch (e) {
    alert(error)
  }
})


function logout() {
  // End the current auth session
  firebase.auth().signOut()
  console.log('logged out')
  // Reset the user to the login page
  window.location = "../index.html"
}
/**
 * Adds the active class to the sidebar element
 */
function toggleActive() {
  document.getElementById('sidebar').classList.toggle('active');
}
/**
 * 
 * @param {*} dataWanted 
 */
function getData(dataWanted){
  return db.collection(dataWanted).get()
}


/**
 * Creates the group table upon Page Load
 */
getData("Groups").then(groups => {
  groups.forEach(group => {
    group = group.data()
    //  create HTML table row for current participant
    var groupsTable = document.getElementById("groups")
    var currentGroupRow = document.createElement("tr")
    var name = document.createElement("td")
    var edit = document.createElement("td")
    var rmv = document.createElement("td")
    var editButton = document.createElement("button")
    var deleteButton = document.createElement("button")
    var id = document.createAttribute("id")
    id.value = group.groupID

    var editButton = document.createElement("button")
    editButton.innerHTML = "Edit"
    editButton.setAttribute("class", "btn btn-info")
    editButton.setAttribute("onclick", "editGroup(this.id)")
    editButton.setAttributeNode(id)

    var deleteButton = document.createElement("button")
    deleteButton.innerHTML = "Delete"
    deleteButton.setAttribute("class", "btn btn-danger")
    deleteButton.setAttribute("onclick", "deleteGroup(this.id)")
    deleteButton.setAttributeNode(id.cloneNode())
    currentGroupRow.setAttributeNode(id.cloneNode())

    //  Set value of each section of the table row 
    name.innerHTML = group.Name
    edit.append(editButton)
    rmv.append(deleteButton)

    // Add the <td>s to the current <tr>
    currentGroupRow.appendChild(name)
    currentGroupRow.appendChild(edit)
    currentGroupRow.appendChild(rmv)

    // Add the <tr> to the table
    groupsTable.appendChild(currentGroupRow)
  })
})


/**
 * Populates the modal pop-up for editing group participants and name
 * @param {*} uid - the group ID in the database
 */
function editGroup(uid) {
  // Retrieve the elements on the Page
  var groupEditModal = document.getElementById('editGroup')
  var currentGroup = document.getElementById(uid)
  var groupName = document.getElementById('createGroupName')
  var cancelButton = document.getElementById('cancelAction')
  var saveButton = document.getElementById('submitGroup')
  var name = currentGroup.childNodes[0].innerHTML

  //Set value of elements for Editing purposes   
  document.getElementById('editGroupTitle').innerHTML = "Edit Group: " + name
  groupName.setAttribute('value', name)
  saveButton.value = "Save"

  // Populate the Select boxes
  getData("Groups").then(groups => {
    groups.forEach(group => {
      group = group.data()
      // Find the group in the database with the uid from the row
      if (group.groupID == uid) {
        // Use the participant list to populate the Participant List/Group Participants boxes
        populateParticipantSelects(group.Participants)
      }
    })
  })

  //Display the modal on the page
  groupEditModal.style.display = "block"

  var groupTable = document.getElementById("groupsTable")
  groupTable.style.display="none"

  // Set events the happen when you click buttons on the page
  cancelButton.onclick = function () {
    groupEditModal.style.display = "none"
    groupTable.style.display = "block"
  }
  saveButton.onclick = function () {
    saveGroup(uid, name)
  }
  console.log("edit group modal displaying")

}

/**
 * Save the changes made to the group in the database and reload the group page
 * @param {*} uid - the group ID of the group being edited
 */
function saveGroup(uid, oldName) {

  // Assign variables, get the elements from the page needed
  var name = document.getElementById("createGroupName").value
  var selectedParticipants = document.getElementById("groupParticipants")

  // The array with all the participant UID's
  var groupParticipants = []

  // Iterate through all the <option> elements in the Group Participants select box, and add the participant UIDs
  // to the comma separated string
  for (i = 0; i < selectedParticipants.length; i++) {
    groupParticipants.push(selectedParticipants.options[i].value)
  }

  db.collection("Groups").doc(uid).update({
    Name: name,
    Participants: groupParticipants,
  }).then(() => {
    if (oldName != name) {
      getData("Events").then((events) => {
        events.forEach((event) => {
          event = event.data()
          var newGroupList = event.Groups
          var index = newGroupList.indexOf(oldName)
          if (index !== -1) {
            newGroupList[index] = name
          }
          db.collection("Events").doc(event.eventID).update({
            Groups: newGroupList
          }).then(() => {
            location.reload()
          })
        })
      })
    }
  })

}

/**
 * Set the participant list in the Participant List and Group Participants select boxes
 */
function populateParticipantSelects(groupParticipants) {
  // Retrieve the elements from the HTML
  var availableParticipantSelect = document.getElementById("availableParticipantsList")
  var groupParticipantsSelect = document.getElementById("groupParticipants")

  //Clear the Select elements so that if edit is clicked before the modal is closed, the correct participants display
  while (availableParticipantSelect.firstChild) { availableParticipantSelect.removeChild(availableParticipantSelect.firstChild) }
  while (groupParticipantsSelect.firstChild) { groupParticipantsSelect.removeChild(groupParticipantsSelect.firstChild) }

  //Get the list of participants from the database
  getData("Participants").then((users) => {
    users.forEach(user => { // For each participant
      user = user.data()
      // Create the HTML element/attributes to assign
      var participantOption = document.createElement("option")
      var valueAttribute = document.createAttribute("value")
      valueAttribute.value = user.userID

      //Set the values of the HTML element          
      participantOption.innerHTML = user.FirstName + " " + user.LastName
      participantOption.setAttributeNode(valueAttribute)
      // If the UID of the current user is present in the groupParticipants string
      // add <option> to the group Participants select box
      if (groupParticipants.includes(user.userID)) {
        groupParticipantsSelect.appendChild(participantOption)
      } else { // current user UID is not in the group participants String, add <option> to available participant list
        availableParticipantSelect.appendChild(participantOption)
      }
    })
  })
}

/**
 * Removes the selected group from the database
 * @param {*} uid - ID of the group to delete in the database
 */
function deleteGroup(uid) {
  // Ask for confirmation of group deletion
  if (confirm("This will permanently remove Group: " + document.getElementById(uid).childNodes[1].innerHTM)) {
    console.log("Deleting Group: " + document.getElementById(uid).childNodes[1].innerHTML)
    db.collection('Groups').doc(uid).delete().then(() => {
      location.reload()
    })
  }
}

/**
 * Creates a new group object in the database
 */
function createGroup() {
  // Create variables with group information from retrieving HTML elements
  var groupName = document.getElementById("createGroupName").value
  var selectedParticipants = document.getElementById("groupParticipants")
  var groupParticipants = []
  // Iterate through all the <option> elements in the Group Participants select box, and add the participant UIDs
  // to the comma separated string
  for (i = 0; i < selectedParticipants.length; i++) {
    groupParticipants.push(selectedParticipants.options[i].value)
  }

  // Create a new group object in the database
  var newGroupRef = db.collection('Groups').doc()

  //Set the values of the attributes for the newly created object and refresh the page to reflect the updated list
  newGroupRef.set({
    Name: groupName,
    groupID: newGroupRef.id,
    Participants: groupParticipants
  }).then(function () {
    location.reload()
  })
}

/**
 * Set up the group editing popup for creating a new group
 * @param {*} title - the string to put as the title of the pop up
 */
function addGroup(title) {
  //Retrieve the HTML elements from the page
  var createGroupModal = document.getElementById('editGroup')
  var cancelButton = document.getElementById('cancelAction')
  var submitButton = document.getElementById('submitGroup')
  var participantSelect = document.getElementById("availableParticipantsList")
  // Set the title of the pop up
  document.getElementById('editGroupTitle').innerHTML = title
  //Populate the available participants <select> since no users will initially be in a new group
  getData("Pariticpants").then((participants) => {
    participants.forEach(participant => {
      participant = participant.data()
      // Create an HTML element and attribute for each user
      var user = document.createElement("option")
      var valueAttribute = document.createAttribute("value")
      valueAttribute.value = user.userID
      //Set the values of the HTML element and add the <option> to the Select box
      user.innerHTML = participant.FirstName + " " + participant.LastName
      user.setAttributeNode(valueAttribute)
      participantSelect.appendChild(user)
    })
  })
  //Display the modal
  createGroupModal.style.display = "block"
  var groupTable = document.getElementById("groupsTable")
  groupTable.style.display="none"
  // Set what happens when buttons are clicked
  cancelButton.onclick = function () {
    createGroupModal.style.display = "none"
    groupTable.style.display = "block"
  }
  submitButton.onclick = function () {
    createGroup()
  }
  console.log("create group modal displaying")
}

/**
 * Search the select boxes for users in the group editing/creation pop up
 */
function searchParticipants() {
  //Retrieve HTML elements needed for Search
  var searchInput = document.getElementById("searchParticipantsInput").value.toUpperCase()
  var availableParticipantList = document.getElementById("availableParticipantsList")
  var groupParticipantList = document.getElementById("groupParticipants")
  // Loop through all participants in the avaiable Participant List, and hide those who don't match the search query
  for (i = 0; i < availableParticipantList.options.length; i++) {
    participant = availableParticipantList.options[i]
    if (participant) { // if participant is not null
      participantName = participant.innerHTML
      if (participantName.toUpperCase().indexOf(searchInput) > -1) {
        // Display the participant <option> if the search query is present in the first or last name of the participant
        participant.style.display = ""
      } else { // Hide the <option>
        participant.style.display = "none"
      }
    }
  }
  //Loop through all participants in the group Participant List, and hide those who don't match the search query
  for (i = 0; i < groupParticipantList.options.length; i++) {
    participant = groupParticipantList.options[i]
    if (participant) {
      participantName = participant.innerHTML
      if (participantName.toUpperCase().indexOf(searchInput) > -1) {
        // Display the participant <option> if the search query is present in the first or last name of the participant
        participant.style.display = ""
      } else {// Hide the <option>
        participant.style.display = "none"
      }
    }
  }
}

/**
 * Search the group table with names to find specific groups
 */
function searchGroupTable() {
  //Retrieve HTML elements needed for Search 
  var searchInput = document.getElementById("searchInput").value.toUpperCase()
  var groupTable = document.getElementById("groupsTable")
  var tableRowArray = groupTable.getElementsByTagName("tr")
  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tableRowArray.length; i++) {
    // Get the <td> from the current row that has the group name
    groupNameTD = tableRowArray[i].getElementsByTagName("td")[0]
    if (groupNameTD) { // If the table row has a <td> for the group name, get the group name
      groupName = gntd.textContent || gntd.innerText
      if (groupName.toUpperCase().indexOf(searchInput) > -1) {
        // Display the table rowif the search query is present in the name of the group
        tableRowArray[i].style.display = ""
      } else { // Hide the table row
        tableRowArray[i].style.display = "none"
      }
    }
  }
}