// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

/**
 * 
 * @param {*} dataWanted 
 */
function getData(dataWanted) {
  return db.collection(dataWanted).get()
}

getData('Events').then((events) => {
  events.forEach((event) => {
    event = event.data()
    var events = document.getElementById("events")
    var currentEvent = document.createElement("tr")
    var name = document.createElement("td")
    var dateTime = document.createElement("td")
    var confDay = document.createElement("td")
    var location = document.createElement("td")
    var speakerTD = document.createElement("td")
    var speakerUL = document.createElement("ul")
    var groupTD = document.createElement("td")
    var groupUL = document.createElement("ul")
    var description = document.createElement("td")
    var rmv = document.createElement("td")
    var edit = document.createElement("td")

    //  create buttons and give row a eventID
    var id = document.createAttribute("id")
    id.value = event.eventID

    var editButton = document.createElement("button")
    editButton.innerHTML = "Edit"
    editButton.setAttribute("class", "btn btn-info")
    editButton.setAttribute("onclick", "editEvent(this.id)")
    editButton.setAttributeNode(id)

    var deleteButton = document.createElement("button")
    deleteButton.innerHTML = "Delete"
    deleteButton.setAttribute("class", "btn btn-danger")
    deleteButton.setAttribute("onclick", "deleteEvent(this.id)")
    deleteButton.setAttributeNode(id.cloneNode())

    currentEvent.setAttributeNode(id.cloneNode())

    name.innerHTML = event.Name
    dateTime.innerHTML = event.Date + " " + event.Time
    confDay.innerHTML = event.ConferenceDay
    location.innerHTML = event.Location
    description.innerHTML = event.Description

    if (event.Speaker) {
    event.Speaker.forEach((spk) => {
      var spkLi = document.createElement("li")
      spkLi.innerHTML = spk
      speakerUL.appendChild(spkLi)
    })
  }
    if (event.Groups) {
    event.Groups.forEach((grp) => {
      var grpLi = document.createElement("li")
      grpLi.innerHTML = grp
      groupUL.appendChild(grpLi)
    })
  }
    edit.append(editButton)
    rmv.append(deleteButton)

    currentEvent.appendChild(name)
    currentEvent.appendChild(dateTime)
    currentEvent.appendChild(confDay)
    currentEvent.appendChild(location)
    speakerTD.appendChild(speakerUL)
    currentEvent.appendChild(speakerTD)
    groupTD.appendChild(groupUL)
    currentEvent.appendChild(groupTD)
    currentEvent.appendChild(description)
    currentEvent.appendChild(edit)
    currentEvent.appendChild(rmv)
    events.appendChild(currentEvent)
  })
})

function convertDateTimeTo24(dt) {
  var newTime, newDate, newDateTime
  var dtToConvert = dt.split(" ")
  var dToConvert = dtToConvert[0].split("/");
  if (dtToConvert[2] == "PM") {
    var hour = dtToConvert[1].substring(0, 2)
    var min = dtToConvert[1].substring(3, 5)
    if (parseInt(hour) == 12) {
      var newHour = 12
    } else {
    var newHour = (parseInt(hour) + 12).toString()
    }
    newTime = newHour + ":" + min
  } else {
    newTime = dtToConvert[1]
  }
  var day = dToConvert[1]
  var month = dToConvert[0]
  var year = dToConvert[2]

  newDate = year + "-" + month + "-" + day
  newDateTime = newDate + "T" + newTime
  return newDateTime

}

function convertDateTimeTo12(dt) {
  var year = dt.substring(0, 4)
  var month = dt.substring(5, 7)
  var day = dt.substring(8, 10)
  var hour = dt.substring(11, 13)
  var min = dt.substring(14, 16)
  var dayNight = "AM"
  if (parseInt(hour) >= 12) {
    if (parseInt(hour) >= 22) {
      hour = (parseInt(hour) - 12).toString()
      dayNight = "PM"
    } else if (parseInt(hour) == 12) {
      dayNight = "PM"
    } else {
      hour = "0" + (parseInt(hour) - 12).toString()
      dayNight = "PM"
    }
  }
  return month + "/" + day + "/" + year + " " + hour + ":" + min + " " + dayNight

}

function editEvent(eventID) {
  var currentRow = document.getElementById(eventID)
  currentRow.setAttribute("class", "table-warning")

  //Store all the current values in variables
  var tds = currentRow.childNodes
  var name = tds[0].innerHTML
  var datetime = tds[1].innerHTML
  var dayconference = tds[2].innerHTML
  var location = tds[3].innerHTML
  var eventspeaker = tds[4].innerHTML
  var eventgroup = tds[5].innerHTML
  var description = tds[6].innerHTML

  var eventNameInputTD = document.createElement("td")
  var eventNameInput = document.createElement("input")
  eventNameInput.setAttribute("id", "nameInput")
  eventNameInput.innerHTML = name
  eventNameInput.value = name
  eventNameInputTD.appendChild(eventNameInput)

  var eventDescriptionTextAreaTD = document.createElement("td")
  var eventDescriptionTextArea = document.createElement("textarea")
  eventDescriptionTextArea.setAttribute("id", "descriptionTextArea")
  eventDescriptionTextArea.innerHTML = description
  eventDescriptionTextArea.value = description
  eventDescriptionTextAreaTD.appendChild(eventDescriptionTextArea)

  var eventLocationInputTD = document.createElement("td")
  var eventLocationInput = document.createElement("input")
  eventLocationInput.setAttribute("id", "locationInput")
  eventLocationInput.innerHTML = location
  eventLocationInput.value = location
  eventLocationInputTD.appendChild(eventLocationInput)

  var currentDateTime = convertDateTimeTo24(tds[1].innerHTML)
  var DateInput = document.createElement("input")
  var dateType = document.createAttribute("type")
  var dateValue = document.createAttribute("value")
  dateType.value = "datetime-local"
  dateValue.value = currentDateTime
  DateInput.setAttributeNode(dateType)
  DateInput.setAttributeNode(dateValue)
  var newDateTD = document.createElement("td")
  newDateTD.append(DateInput)

  var groupDropDown = document.createElement("select")
  var speakerDropDown = document.createElement("select")

  var currentSpeakers = []
  var speakerList = tds[4].firstChild.childNodes
  speakerList.forEach((item) => {
    currentSpeakers.push(item.innerHTML)
  })
  var currentGroups = []
  var groupList = tds[5].firstChild.childNodes
  groupList.forEach((item) => {
    currentGroups.push(item.innerHTML)
  })
  var selected = document.createAttribute("selected")
  var multipleAtrr = document.createAttribute("multiple")
  getData('Speakers').then((speakers => {
    speakers.forEach((speaker) => {
      speaker = speaker.data()
      var sp = document.createElement("option")
      var spValue = document.createAttribute("value")
      spValue.value = speaker.Name
      sp.innerHTML = speaker.Name
      if (currentSpeakers.includes(speaker.Name)) {
        sp.setAttributeNode(selected.cloneNode())
      }
      sp.setAttributeNode(spValue.cloneNode())
      speakerDropDown.appendChild(sp)
    })
  }))
  getData('Groups').then((groups) => {
    groups.forEach((group) => {
      group = group.data()
      var grp = document.createElement("option")
      var grpV = document.createAttribute("value")
      grpV.value = group.Name
      grp.innerHTML = group.Name
      if (currentGroups.includes(group.Name)) {
        grp.setAttributeNode(selected.cloneNode())
      }
      grp.setAttributeNode(grpV.cloneNode())
      groupDropDown.appendChild(grp)
    })
  })

  var conferenceDayDropDown = document.createElement("select")
  var currentConferenceDay = tds[2].innerHTML
  var day1 = document.createElement("option")
  var day2 = document.createElement("option")
  var day3 = document.createElement("option")
  var day4 = document.createElement("option")
  var day1A = document.createAttribute("value")
  var day2A = document.createAttribute("value")
  var day3A = document.createAttribute("value")
  var day4A = document.createAttribute("value")
  day1A.value = 1
  day2A.value = 2
  day3A.value = 3
  day4A.value = 4
  day1.innerHTML = "Day 1"
  day2.innerHTML = "Day 2"
  day3.innerHTML = "Day 3"
  day4.innerHTML = "Day 4"
  day1.setAttributeNode(day1A)
  day2.setAttributeNode(day2A)
  day3.setAttributeNode(day3A)
  day4.setAttributeNode(day4A)
  switch (currentConferenceDay) {
    case "1": day1.setAttributeNode(selected)
      break
    case "2": day2.setAttributeNode(selected)
      break
    case "3": day3.setAttributeNode(selected)
      break
    case "4": day4.setAttributeNode(selected)
      break
  }
  conferenceDayDropDown.appendChild(day1)
  conferenceDayDropDown.appendChild(day2)
  conferenceDayDropDown.appendChild(day3)
  conferenceDayDropDown.appendChild(day4)

  var newConferenceDayTD = document.createElement("td")
  newConferenceDayTD.appendChild(conferenceDayDropDown)

  var newGroupTD = document.createElement("td")
  var newSpeakerTD = document.createElement("td")
  groupDropDown.setAttributeNode(multipleAtrr.cloneNode())
  speakerDropDown.setAttributeNode(multipleAtrr.cloneNode())
  newGroupTD.appendChild(groupDropDown)
  newSpeakerTD.appendChild(speakerDropDown)
  tds[0].replaceWith(eventNameInputTD)
  tds[1].replaceWith(newDateTD)
  tds[2].replaceWith(newConferenceDayTD)
  tds[3].replaceWith(eventLocationInputTD)
  tds[4].replaceWith(newSpeakerTD)
  tds[5].replaceWith(newGroupTD)
  tds[6].replaceWith(eventDescriptionTextAreaTD)
  tds[7].firstChild.innerHTML = "Save"
  tds[7].firstChild.setAttribute("onclick", "saveEvent(this.id)")
  tds[8].firstChild.innerHTML = "Cancel"
  tds[8].firstChild.setAttribute("onclick", "resetRow(this.id, '" + name + "','" + datetime + "','" + dayconference + "','" + location + "','" + eventspeaker + "','" + eventgroup + "','" + description + "')")
}

function resetRow(eventID, name, datetime, dayconference, location, speakers, groups, details) {
  var currentRow = document.getElementById(eventID)
  currentRow.removeAttribute("class")
  var tds = currentRow.childNodes
  tds[0].innerHTML = name
  tds[1].innerHTML = datetime
  tds[2].innerHTML = dayconference
  tds[3].innerHTML = location
  tds[4].innerHTML = speakers
  tds[5].innerHTML = groups
  tds[6].innerHTML = details
  tds[7].firstChild.innerHTML = "Edit"
  tds[7].firstChild.setAttribute("onclick", "editEvent(this.id)")
  tds[8].firstChild.innerHTML = "Delete"
  tds[8].firstChild.setAttribute("onclick", "deleteEvent(this.id)")
}
function saveEvent(eventID) {
  var currentRow = document.getElementById(eventID)
  var tds = currentRow.childNodes
  var name = document.getElementById("nameInput").value
  var description = document.getElementById("descriptionTextArea").value
  var location = document.getElementById("locationInput").value

  //Retrieve selected speakers and groups
  var speaker = []
  var group = []
  var selectedSpeakers = tds[4].firstChild.selectedOptions
  var selectedGroups = tds[5].firstChild.selectedOptions
  for (i = 0; i < selectedSpeakers.length; i++) {
    speaker.push(selectedSpeakers[i].value)
  }
  for (i = 0; i < selectedGroups.length; i++) {
    group.push(selectedGroups[i].value)
  }

  //Convert date/time input
  let datetime = convertDateTimeTo12(tds[1].firstChild.value).split(" ")
  var date = datetime[0]
  var time = datetime[1] + " " + datetime[2]

  //Check input values vs regex and save to firebase if valid
  if (/^[a-zA-Z0-9\-\.\&\,\s\!]+$/.test(name) && /^[a-zA-Z0-9\-\.\&\,\s\!]+$/.test(location)) {
    db.collection('Events').doc(eventID).update({
      Date: date,
      Time: time,
      Location: location,
      Name: name,
      ConferenceDay: parseInt(tds[2].firstChild.options[tds[2].firstChild.selectedIndex].value),
      Groups: group,
      Description: description,
      Speaker: speaker
    }).then(() => {
      tds[0].innerHTML = name
      tds[3].innerHTML = location
      tds[6].innerHTML = description
      var speakerUL = ""
      var groupUL = ""
      tds[2].innerHTML = parseInt(tds[2].firstChild.options[tds[2].firstChild.selectedIndex].value)
      tds[1].innerHTML = date + " " + time
      speakerUL = "<ul>"
      if (speaker) {
        speaker.forEach((spk) => {
          speakerUL += "<li>" + spk + "</li>"
        })
      }
      speakerUL += "</ul>"
      groupUL = "<ul>"
      if (group) {
        group.forEach((grp) => {
          groupUL += "<li>" + grp + "</li>"
        })
      }
      groupUL += "</ul>"
      tds[4].innerHTML = speakerUL
      tds[5].innerHTML = groupUL
      tds[7].firstChild.innerHTML = "Edit"
      tds[7].firstChild.setAttribute("onclick", "editEvent(this.id)")
      tds[8].firstChild.innerHTML = "Delete"
      tds[8].firstChild.setAttribute("onclick", "deleteEvent(this.id)")
      currentRow.removeAttribute("class")
    })
  } else {
    alert("You can only enter spaces, '-' , or AlphaNumeric values in Name and Location fields")
  }

}

function deleteEvent(eventID) {
  var name = document.getElementById(eventID).childNodes[0].innerHTML;
  if (confirm("This will permanently remove event: " + name + " from the database!")) {
    db.collection('Events').doc(eventID).delete().then(() => {
      location.reload()
    })
  }
}

function logout() {
  firebase.auth().signOut()
  window.location = "../index.html"
}

function addEvent() {
  var groupSelect = document.getElementById("createGroups")
  var speakerSelect = document.getElementById("createSpeaker")

  getData("Groups").then((groups) => {
    groups.forEach((group) => {
      group = group.data()
      var nextGroup = document.createElement("option")
      var valueAttr = document.createAttribute("value")
      nextGroup.innerHTML = group.Name
      valueAttr.value = group.Name
      nextGroup.setAttributeNode(valueAttr)
      groupSelect.appendChild(nextGroup)
    })
  })
  getData("Speakers").then((speakers) => {
    speakers.forEach((speaker) => {
      speaker = speaker.data()
      var nextSpeaker = document.createElement("option")
      var valueAttr = document.createAttribute("value")
      nextSpeaker.innerHTML = speaker.Name
      valueAttr.value = speaker.Name
      nextSpeaker.setAttributeNode(valueAttr)
      speakerSelect.appendChild(nextSpeaker)
    })
  })
}

function createDBEvent() {
  var speaker = []
  var group = []
  var name = document.getElementById("createName").value
  var locations = document.getElementById("createLocation").value
  var description = document.getElementById("createDescription").value
  var confDay = document.getElementById("createConfDay").options[document.getElementById("createConfDay").selectedIndex].value
  var dateTime = convertDateTimeTo12(document.getElementById("createDate").value)
  var dtParts = dateTime.split(" ")
  var date = dtParts[0]
  var time = dtParts[1] + " " + dtParts[2]
  var selectedSpeakers = document.getElementById("createSpeaker").selectedOptions
  var selectedGroups = document.getElementById("createGroups").selectedOptions
  if (/^[a-zA-Z0-9\-\.\&\,\s\!]+$/.test(name) && /^[a-zA-Z0-9\-\.\&\,\s\!]+$/.test(locations)) {
    for (i = 0; i < selectedSpeakers.length; i++) {
      speaker.push(selectedSpeakers[i].value)
    }
    for (i = 0; i < selectedGroups.length; i++) {
      group.push(selectedGroups[i].value)
    }
    newEventRef = db.collection("Events").doc()
    newEventRef.set({
      Date: date,
      Time: time,
      Location: locations,
      Name: name,
      ConferenceDay: confDay,
      Speaker: speaker,
      Groups: group,
      Description: description,
      eventID: newEventRef.id
    }).then(() => {
      location.reload()
    })
  } else {
    alert("You can only enter spaces, '-' , or AlphaNumeric values in Name and Location ")
  }
}

function searchTable() {
  var input, filter, table, tr, td
  input = document.getElementById("searchInput")
  filter = input.value.toUpperCase()
  table = document.getElementById("events")
  tr = table.getElementsByTagName("tr")

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0]
    if (td) {
      var nameValue = td.textContent || td.innerText;
      if (nameValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = ""
      } else {
        tr[i].style.display = "none"
      }
    }
  }
}

function filterTable() {
  var day, table, tr, td, txtValue
  var daydd = document.getElementById("selectedDay")
  day = daydd.options[daydd.selectedIndex].value
  table = document.getElementById("events")
  tr = table.getElementsByTagName("tr")

  if (day == "ALL") {
    for (i = 0; i < tr.length; i++) {
      tr[i].style.display = ""
    }
  } else {
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[2]
      if (td) {
        txtValue = td.textContent || td.innerText
        if (txtValue.toUpperCase().indexOf(day) > -1) {
          tr[i].style.display = ""
        } else {
          tr[i].style.display = "none"
        }
      }
    }
  } 
}