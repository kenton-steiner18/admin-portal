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

document.addEventListener("DOMContentLoaded", function () {
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
  document.getElementById('sidebar').classList.toggle('active');
}

/**
 * 
 * @param {*} dataWanted 
 */
function getData(dataWanted){
  return db.collection(dataWanted).get()
}

getData("Push").then((pushes) => {
  pushes.forEach((push) => {
    push = push.data()
    var givenDate = new Date(push.Date);
    var currentDate = new Date();
    var currentPush = document.createElement("tr");
    var pushDate = document.createElement("td");
    var body = document.createElement("td");
    pushDate.innerHTML = push.Date;
    body.innerHTML = push.body;
    var id = document.createAttribute("id");
    id.value = push.key;
    currentPush.setAttributeNode(id);
    currentPush.appendChild(body);
    currentPush.appendChild(pushDate);
    if (givenDate < currentDate) {
      var prevPushes = document.getElementById("pastPushbody");
      prevPushes.appendChild(currentPush);
    } else {
      var futurePushes = document.getElementById("futurePushbody");
      futurePushes.appendChild(currentPush);
    }
  })
})

function sendPush() {
  var message = document.getElementById("createPush").value;
  var title = document.getElementById("createPushTitle").value;
  if (message == "") {
    alert("Please enter a message");
  } else if (title == "") {
    alert("Please enter a title");
  } else {
    if (confirm("Your push notification reads:\"" + message + "\"It will send to all devices immediatly")) {
      var notificationData = {
        "to": "/topics/all",
        "notification": {
          "body": message,
          "title": title
        }
      }

      $.ajax({
        url: "https://fcm.googleapis.com/fcm/send",
        type: "post",
        data: JSON.stringify(notificationData),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "key = AAAAh7Ebuxk:APA91bHy7rrfLWVy6bPauV_GOGFB-fZh1vo24RtIBMbRnD8J2v-HOQ15Csu9JmZna_Ba6tCtoLSzzq2yZNLpPv3eZyyPDuwaCSy5r7kxDhns4JH3ENn30j9Hr5Mj0Uu8xM8iZFe67x-7"
        },
        dataType: 'json',
        success: function (data) {
          console.log(data);
          alert(data.message);
          var newPushRef = db.collection("Push").doc()
          newPushRef.set({
            Date: Date(),
            title: title,
            body: message,
            key: newPushRef.id
          })
        }
      })
    } else {

    }
  }
}

function logout() {
  firebase.auth().signOut();
  console.log('logged out')
  window.location = "../index.html"
}

function convertDateTimeTo24(dt) {
  var newTime, newDate, newDateTime
  var dtToConvert = dt.split(" ");
  var dToConvert = dtToConvert[0].split("/");
  if (dtToConvert[2] == "PM") {
    var hour = dtToConvert[1].substring(0, 2)
    var min = dtToConvert[1].substring(3, 5);
    var newHour = (parseInt(hour) + 12).toString();
    newTime = newHour + ":" + min;
  } else {
    newTime = dtToConvert[1];
  }
  var day = dToConvert[1]
  var month = dToConvert[0]
  var year = dToConvert[2]

  newDate = year + "-" + month + "-" + day;
  newDateTime = newDate + "T" + newTime
  return newDateTime;

}

function convertDateTimeTo12(dt) {
  var newTime, newDate, newDateTime
  var year = dt.substring(0, 4);
  var month = dt.substring(5, 7);
  var day = dt.substring(8, 10);
  var hour = dt.substring(11, 13);
  var min = dt.substring(14, 16);
  var dayNight = "AM";
  if (parseInt(hour) > 12) {
    if (parseInt(hour) >= 22) {
      hour = (parseInt(hour) - 12).toString();
      dayNight = "PM";
    } else {
      hour = "0" + (parseInt(hour) - 12).toString();
      dayNight = "PM";
    }
  }
  return month + "/" + day + "/" + year + " " + hour + ":" + min + " " + dayNight;

}