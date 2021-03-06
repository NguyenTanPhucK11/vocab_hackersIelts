const TIME_LIMIT = 1; // Start with an initial value of 20 seconds
const WARNING_THRESHOLD = 10; // Warning occurs at 10s
const ALERT_THRESHOLD = 5; // Alert occurs at 5s
const SCORE_LIMIT = 10;
const COLOR_CODES = {
  info: {
    color: "FF0052",
  },
  warning: {
    color: "blue",
    threshold: WARNING_THRESHOLD,
  },
  alert: {
    color: "blue",
    threshold: ALERT_THRESHOLD,
  },
};
const FULL_DASH_ARRAY = 283; // Initially, no time has passed, but this will count up and subtract from the TIME_LIMIT
const COLOR_BUTTON = {
  blue: {
    color: "#007BFF",
  },
  orange: {
    color: "#FF9900",
  },
};

let arrDefs = new Array();
let arrWrds = new Array();
let arrExs = new Array();

let resultWords = new Array();

let randomArrayDefs = new Array();
let randomArrayWrds = new Array();
let randomArrayExs = new Array();
let count_part = 1;

let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

let valueRadio;
// reset();
// SetRemainingPathColor();

var config = {
  apiKey: "AIzaSyB7udJutjrMEsQmuRb293N2VsSB_fUAvq0",
  authDomain: "vocab-ielst.firebaseapp.com",
  projectId: "vocab-ielst",
  storageBucket: "vocab-ielst.appspot.com",
  messagingSenderId: "106090060581",
  appId: "1:106090060581:web:7311e4e990bfe6445298cc",
  measurementId: "G-PJE7NY5YEH",
};
firebase.initializeApp(config);
var db = firebase.firestore();

$(document).ready(function () {
  $("input[type='radio']").click(function () {
    valueRadio = $("input[name='flexRadioDefault']:checked").val();
    document.getElementById("list-unit").innerHTML = "";
    db.collection(valueRadio)
      .get()
      .then((snap) => {
        size = snap.size; // will return the collection sizes
        document.getElementById("count-part").value = "" + size;
        count_part = parseInt(document.getElementById("count-part").value);

        for (let i = 0; i < size; i++) {
          const { blue, orange } = COLOR_BUTTON;
          let buttonColor = orange.color;
          switch (i % 2) {
            case 0:
              buttonColor = blue.color;
              break;
            case 1:
              buttonColor = orange.color;
              break;
          }

          document.getElementById("list-unit").innerHTML += `
      <button type="submit" onclick = "setValue(${i})" 
      class="btn btn-primary" style = "background-color : ${buttonColor} ;border-color: ${buttonColor} ;margin : 2px">${
            i + 1
          }</button>
      `;
        }
      });
  });
});
if (valueRadio == undefined) valueRadio = "Listening";

db.collection(valueRadio)
  .get()
  .then((snap) => {
    size = snap.size; // will return the collection sizes
    document.getElementById("count-part").value = "" + size;
    count_part = parseInt(document.getElementById("count-part").value);

    for (let i = 0; i < size; i++) {
      const { blue, orange } = COLOR_BUTTON;
      let buttonColor = orange.color;
      switch (i % 2) {
        case 0:
          buttonColor = blue.color;
          break;
        case 1:
          buttonColor = orange.color;
          break;
      }

      document.getElementById("list-unit").innerHTML += `
    <button type="submit" onclick = "setValue(${i})" 
    class="btn btn-primary" style = "background-color : ${buttonColor} ;border-color: ${buttonColor} ;margin : 2px">${
        i + 1
      }</button>
    `;
    }
  });

document.getElementById("count-time").innerHTML = `...`;
document.getElementById("count-time").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        style = "color : ${remainingPathColor}"
        class="base-timer__path-remaining"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">
    ${formatTimeLeft(timeLeft)}
  </span>
</div>
`;
document.getElementById("score").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-score-path-remaining"
        stroke-dasharray="283"
        style = "color : ${remainingPathColor}"
        class="base-timer__path-remaining"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-score-label" class="base-timer__label">
    0/${SCORE_LIMIT}
  </span>
</div>
`;

function addlistVoca() {
  for (let i = 1; i <= 10; i++) {
    document.getElementById("addVoca").innerHTML += `
          <div text-align: center>
              <span class="badge">${i}</span>

              <div style = "display: inline-flex">
                  <input  style = " margin : 2px ;width = 50px" class="form-control" placeholder= "Word"  type = "text" id = "W${i}" >
                  <input  style = " margin : 2px ;width = 50px" class="form-control" placeholder= "Defination" type = "text" id = "D${i}" >
                  <input  style = " margin : 2px ;width = 50px" class="form-control" placeholder= "Example" type = "text" id = "E${i}" >
              </div>
              
          </div>
          `;
  }
}

function reset() {
  getWords();
  getDefinitions();
  getExamples();
  // examination();
}

function setValue(i) {
  document.getElementById("count-part").value = i + 1;
  reset();
}

function examination() {
  if (timeLeft == TIME_LIMIT) {
    StartTimer();
  }

  random();
  document.getElementById("addVoca").innerHTML = "";
  for (let i = 0; i < 10; i++) {
    document.getElementById("addVoca").innerHTML += `
            <div class="input-group">
              <button class="btn btn-primary" style ="margin : 2px">${i + 1}. ${
      randomArrayDefs[i]
    }</button>
              <div style = "display: inline-block;">
                <input type="text" id = "Words${
                  i + 1
                }" style = " margin : 2px ;width = 50px"class="form-control">
              </div>
              <button class="btn btn-primary" style ="margin : 2px">Example: ${
                randomArrayExs[i]
              }</button>
              <button id = "finish${
                i + 1
              }" style="display: none" class="btn btn-primary">${
      resultWords[i]
    }</button>
            </div>

          `;
  }
}

function checkWrdsDefs() {
  let score = 0;
  if (arrDefs.length == 0) {
    return;
  }
  for (let i = 1; i <= arrDefs.length; i++) {
    if (document.getElementById("Words" + i).value == randomArrayWrds[i - 1]) {
      document.getElementById("Words" + i).style.color = "green";
      document.getElementById("finish" + i).style.display = "none";
      resultWords[i - 1] = "";
      score++;
    } else {
      if (document.getElementById("Words" + i).value == "") {
        document.getElementById("Words" + i).value = "x";
      }
      document.getElementById("finish" + i).style.display = "";
      document.getElementById("Words" + i).style.color = "red";
    }
  }
  document.getElementById(
    "base-score-label"
  ).innerHTML = `${score} / ${SCORE_LIMIT}`;
  SetCircleDasharrayScore(score);
}

function random() {
  let tempRADs = randomArrayDefs;
  let tempRAWs = randomArrayWrds;
  let tempRAEs = randomArrayExs;
  randomArrayDefs = [];
  randomArrayWrds = [];
  randomArrayExs = [];
  for (let i = 0; i < 10; i++) {
    let randomDefs = tempRADs[Math.floor(Math.random() * tempRADs.length)];
    for (let j = 0; j < tempRADs.length; j++) {
      if (tempRADs[j] == randomDefs) {
        tempRADs.splice(j, 1);
        randomArrayWrds[i] = tempRAWs[j];
        resultWords[i] = randomArrayWrds[i];

        randomArrayExs[i] = tempRAEs[j];
        tempRAEs.splice(j, 1);
        tempRAWs.splice(j, 1);
        randomArrayDefs[i] = randomDefs;
        console.log(j);

        j = tempRADs.length;
      }
    }
  }
  console.log(randomArrayWrds);
  console.log(randomArrayExs);
}

async function getDefinitions() {
  var docRef = db
    .collection(valueRadio)
    .where("Part", "==", "" + document.getElementById("count-part").value);
  await docRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (data) {
      for (let i = 0, j = 1; i < 10; i++, j += 3) {
        arrDefs[i] = data.data()[j + 1];
      }
    });
  });
  for (let i = 0; i < arrDefs.length; i++) {
    randomArrayDefs[i] = arrDefs[i];
  }
  console.log(arrDefs);
}

async function getWords() {
  var docRef = db
    .collection(valueRadio)
    .where("Part", "==", "" + document.getElementById("count-part").value);
  await docRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (data) {
      for (let i = 0, j = 0; i < 10; i++, j += 3) {
        arrWrds[i] = data.data()[j + 1];
      }
    });
  });
  for (let i = 0; i < arrWrds.length; i++) {
    randomArrayWrds[i] = arrWrds[i];
  }
  console.log(arrWrds);
}

async function getExamples() {
  var docRef = db
    .collection(valueRadio)
    .where("Part", "==", "" + document.getElementById("count-part").value);
  await docRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (data) {
      for (let i = 0, j = 2; i < 10; i++, j += 3) {
        arrExs[i] = data.data()[j + 1];
      }
    });
  });
  for (let i = 0; i < arrWrds.length; i++) {
    randomArrayExs[i] = arrExs[i];
  }
  console.log(arrExs);
}

function addVoca() {
  $(document).ready(function () {
    count_part = parseInt(document.getElementById("count-part").value) + 1;
    db.collection(valueRadio)
      .doc("Part" + count_part)
      .set({
        1: document.getElementById("W1").value,
        2: document.getElementById("D1").value,
        3: document.getElementById("E1").value,
        4: document.getElementById("W2").value,
        5: document.getElementById("D2").value,
        6: document.getElementById("E2").value,
        7: document.getElementById("W3").value,
        8: document.getElementById("D3").value,
        9: document.getElementById("E3").value,
        10: document.getElementById("W4").value,
        11: document.getElementById("D4").value,
        12: document.getElementById("E4").value,
        13: document.getElementById("W5").value,
        14: document.getElementById("D5").value,
        15: document.getElementById("E5").value,
        16: document.getElementById("W6").value,
        17: document.getElementById("D6").value,
        18: document.getElementById("E6").value,
        19: document.getElementById("W7").value,
        20: document.getElementById("D7").value,
        21: document.getElementById("E7").value,
        22: document.getElementById("W8").value,
        23: document.getElementById("D8").value,
        24: document.getElementById("E8").value,
        25: document.getElementById("W9").value,
        26: document.getElementById("D9").value,
        27: document.getElementById("E9").value,
        28: document.getElementById("W10").value,
        29: document.getElementById("D10").value,
        30: document.getElementById("E10").value,
        Part: count_part.toString(),
      })
      .then(function () {
        alert("Successful");
        location.reload();
      })
      .catch(function (error) {
        console.log("Error");
      });
  });
}

function formatTimeLeft(time) {
  // The largest round integer less than or equal to the result of time divided being by 60.
  const minutes = Math.floor(time / 60);

  // Seconds are the remainder of the time divided by 60 (modulus operator)
  let seconds = time % 60;

  // If the value of seconds is less than 10, then display seconds with a leading zero
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  if (minutes < 1) {
    return `${seconds}`;
  } else {
    return `${minutes}:${seconds}`;
  }

  // The output in MM:SS format
}

function StartTimer() {
  timerInterval = setInterval(() => {
    // The amount of time passed increments by one

    if (timeLeft > 0) {
      timePassed -= 1;
      timeLeft = TIME_LIMIT - timePassed;
    }
    // The time left label is updated
    document.getElementById("base-timer-label").innerHTML = formatTimeLeft(
      timeLeft
    );

    SetCircleDasharray();
  }, 1000);
}

function CalculateTimeFraction() {
  return timeLeft / TIME_LIMIT;
}

function SetCircleDasharray() {
  const circleDasharray = `${(
    CalculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

function SetCircleDasharrayScore(score) {
  const circleDasharray = `${(
    (1 - score / SCORE_LIMIT) *
    FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-score-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

function SetRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;

  // If the remaining time is less than or equal to 5, remove the "warning" class and apply the "alert" class.
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);

    // If the remaining time is less than or equal to 10, remove the base color and apply the "warning" class.
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}
