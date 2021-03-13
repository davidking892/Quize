// selector
var gotIt = document.querySelectorAll(".gotIt");
var submitRequest = document.getElementById("submitRequest");
var modal = document.getElementById("myModal");
var questionHolder = document.querySelectorAll(
  "#questionContainer .question"
)[0];
var subQuestionHolder = document.querySelectorAll(
  "#questionContainer .subQuestion"
)[0];
var questionImageHolder = document.querySelectorAll(
  "#questionContainer .imageContainer"
)[0];

var sound = document.querySelectorAll(" .sound");

// show time result;

var col_1 = document.getElementById("col-1");
var col_2 = document.getElementById("col-2");
var col_3 = document.getElementById("col-3");

// storage
var questionNumber = 0;
var data = null;
var selectedOption = null;
var question = null;
var rightAnswer = null;
var images = null;
var counting = 0;
var questionAnswered = 0;
var smartScore = 0;
var percentIncrease = 0;
var intervalHolder;
var seconds = null;
var currentStatusIndex = null;
var displayTimeInterval;
var totalTimeTaken = 0;

var rightAnswerImageContainer = [
  `<div> <h1>Excellent</h1> </div>`,
  "<div> <h1>Good Job</h1> </div>",
  "<div> <h1>Right Answer</h1> </div>",
];

function refresh() {
  removeOptionSelection();
  uploadDataLocally();
  applyListener();
  insertQuestionData();
  document.getElementById("quizeContainer").style.display = "flex";
}

function displayBoard() {
  counting = 0;
  clearInterval(intervalHolder);
  scoreTimer(59);
  selectedOption = null;
  questionNumber = 0;
  questionAnswered = 0;
  percentIncrease = parseInt(100 / data.length);
  smartScore = 0;
}

function start() {
  removeOptionSelection();
  shuffle();
  uploadDataLocally();
  insertQuestionData();
  document.getElementById("resultContainer").style.display = "none";
  document.getElementById("quizeContainer").style.display = "flex";
  document.getElementById("questionContent").innerText = questionNumber + 1;
}

function checkResult() {
  if (questionNumber >= data.length - 1) {
    // winner status
    clearInterval(displayTimeInterval);
    document.getElementById(
      "questionDisplayContent"
    ).innerText = questionAnswered;
    document.getElementById("scoreDisplayContent").innerText = smartScore;
    document.getElementById("scoreDisplayContent").innerText = totalTimeTaken;

    document.getElementById("resultContainer").style.display = "flex";
    document.getElementById("quizeContainer").style.display = "none";
    document.getElementById("restart").addEventListener("click", function () {
      start();
    });
  } else {
    questionNumber += 1;
    scoreTimer(59);
    refresh();
  }
}

function removeOptionSelection() {
  var options = document.querySelectorAll(".option");
  for (var item of options) {
    item.classList.remove("active");
  }
}

function applyListener() {
  gotIt.forEach((item) => {
    item.addEventListener("click", (event) => {
      checkResult();
      document.getElementById("explaination").style.display = "none";
      document.getElementById("questionContainer").style.display = "block";
    });
  });

  // sound box
  sound.forEach((item) => {
    item.addEventListener("click", (e) => {
      speak(e.target.nextElementSibling.innerText);
    });
  });

  selectImages();

  selectAnswer();

  submitAnswer();
}

function selectImages() {
  document
    .querySelector("#questionContainer .imageContainer")
    .addEventListener("click", function (e) {
      if (e.target.classList.contains("img")) {
        if (!e.target.parentElement.children[1].classList.contains("active")) {
          counting += 1;
          if (counting <= images.length) {
            e.target.parentElement.children[1].classList.add("active");
            e.target.classList.add("active");
            e.target.parentElement.children[1].innerText = counting;
          }
        }
      }
    });
}

function selectAnswer() {
  document
    .querySelector("#questionContainer .optionsContainer")
    .addEventListener("click", function (e) {
      if (e.target.classList.contains("option")) {
        var oldSelection = selectedOption;
        selectedOption = parseInt(e.target.innerText);
        if (selectedOption !== oldSelection) {
          removeOptionSelection();
        }
        e.target.parentElement.children[
          parseInt(selectedOption - 1)
        ].classList.toggle("active");
      }
    });
}

function submitAnswer() {
  submitRequest.addEventListener("click", function () {
    clearInterval(intervalHolder);
    document.getElementById("timeContent").innerHTML = "";
    var selectedItem = document.querySelectorAll("#questionContainer .option");
    var checkAttempt = 0;
    for (var item of selectedItem) {
      if (!item.classList.contains("active")) {
        checkAttempt += 1;
      }
    }

    if (checkAttempt === 3) {
      selectedOption = null;
    }
    performAction();
  });
}

function speak(txt) {
  var msg = new SpeechSynthesisUtterance(txt);
  window.speechSynthesis.speak(msg);
}

function shuffle() {
  var arr = window.quizeList;
  var ctr = arr.length,
    temp,
    index;

  // While there are elements in the array
  while (ctr > 0) {
    // Pick a random index
    index = Math.floor(Math.random() * ctr);
    // Decrease ctr by 1
    ctr--;
    // And swap the last element with it
    temp = arr[ctr];
    arr[ctr] = arr[index];
    arr[index] = temp;
  }
  data = arr;
  clearInterval(displayTimeInterval);
  displayTimer();
}

function displayTimer() {
  var seconds = 0,
    minutes = 0,
    hours = 0;

  var hoursText = 0,
    minuteText = 0,
    secondText = 0;

  displayTimeInterval = setInterval(function () {
    seconds++;
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
      if (minutes >= 60) {
        minutes = 0;
        hours++;
      }
    }

    hoursText = hours ? (hours > 9 ? hours : "0" + hours) : "00";
    minuteText = minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00";
    secondText = seconds > 9 ? seconds : "0" + seconds;

    col_1.innerText = hoursText;
    col_2.innerText = minuteText;
    col_3.innerText = secondText;

    totalTimeTaken = hoursText + " : " + minuteText + " : " + secondText;
  }, 1000);
}

function showRightStatus() {
  var rightStatus = document.getElementById("rightAnswerStatus");
  document.getElementById("dashboard").style.display = "none";
  rightStatus.innerHTML = rightAnswerImageContainer[currentStatusIndex];
  rightStatus.style.display = "block";

  setTimeout(() => {
    rightStatus.style.display = "none";
    document.getElementById("dashboard").style.display = "flex";
    checkResult();
  }, 1500);
}

function scoreTimer(startingTime) {
  seconds = startingTime;
  intervalHolder = setInterval(function () {
    seconds -= 1;

    if (seconds < 20) {
      clearInterval(intervalHolder);
    }
  }, 1000);
}

function performAction() {
  if (selectedOption === rightAnswer) {
    if (seconds > 50) {
      smartScore += 20;
      currentStatusIndex = 0;
    } else if (seconds > 30) {
      smartScore += 15;
      currentStatusIndex = 1;
    } else {
      smartScore += 5;
      currentStatusIndex = 2;
    }
    showRightStatus();
    questionAnswered += 1;
    document.getElementById("questionContent").innerText = questionAnswered;
    document.getElementById("scoreContent").innerText = smartScore;
    // checkResult();
  } else if (selectedOption === null) {
    modal.style.display = "block";
  } else if (selectedOption !== rightAnswer) {
    explanation();
  }
}

function explanation() {
  document.getElementById("explaination").style.display = "block";
  document.getElementById("quizeContainer").style.display = "none";

  document
    .querySelectorAll("#explaination .section1 .option")
    [rightAnswer - 1].classList.add("active");

  // section3 uplading
  review();

  // section3 uploading
  solve();
}

function review() {
  var reviewQuestion = document.querySelectorAll(
    "#explaination .section2 .question"
  )[0];
  var reviewSubQuestion = document.querySelectorAll(
    "#explaination .section2 .subQuestion"
  )[0];
  var reviewImages = document.querySelectorAll(
    "#explaination .section2 .imageContainer"
  )[0];
  reviewQuestion.innerHTML = question;
  reviewSubQuestion.innerHTML = subQuestion;

  var newImagesArray = "";
  for (let i = 0; i < images.length; i++) {
    newImagesArray += `<div class="imgSubContainer" > <img class="img" src="${
      images[i].img
    }"/> <span class="count">${i + 1}</span> </div>`;
  }
  reviewImages.innerHTML = newImagesArray;

  if (selectedOption !== null) {
    document
      .querySelectorAll("#explaination .section2 .ansOptionsContainer .option")
      [selectedOption - 1].classList.add("active");
  }
}

function solve() {
  var section3Question = document.querySelectorAll(
    "#explaination .section3 .question"
  )[0];
  var section3Answer = document.querySelectorAll(
    "#explaination .section3 .answer"
  )[0];
  var section3Images = document.querySelectorAll(
    "#explaination .section3 .imageContainer"
  )[0];

  section3Question.innerHTML = data[questionNumber].solution.question;
  section3Answer.innerHTML = data[questionNumber].solution.ans;

  var section3ImagesArray = "";
  for (let i = 0; i < images.length - 1; i++) {
    section3ImagesArray += `<div class="imgSubContainer" > <img class="img" src="${
      images[i].img
    }"/> <span class="count displayCount">${i + 1}</span> </div>`;
  }
  section3ImagesArray += `<div class="imgSubContainer" > <img class="img" src="${
    images[images.length - 1].img
  }"/>
    <div class="starContainer"> <span class="star"> <img src="images/star.png"/> <p> ${
      images.length
    } </p></span></div> </div>`;

  section3Images.innerHTML = section3ImagesArray;
}

function uploadDataLocally() {
  question = data[questionNumber].question;
  rightAnswer = parseInt(data[questionNumber].rightAnswer);
  subQuestion = data[questionNumber].subQuestion;
  images = data[questionNumber].questionImages;
}

function insertQuestionData() {
  questionHolder.innerHTML = question;
  subQuestionHolder.innerHTML = subQuestion;

  var newImageArray = "";
  for (let i = 0; i < images.length; i++) {
    newImageArray += `<div class="imgSubContainer" > <img class="img" src="${
      images[i].img
    }"/> <span class="count">${i + 1}</span> </div>`;
  }
  questionImageHolder.innerHTML = newImageArray;
  document.getElementById("questionContainer").style.display = "block";
  clearInterval(intervalHolder);
  scoreTimer(59);
}

function packData() {
  shuffle();
  uploadDataLocally();
  applyListener();
  insertQuestionData();
  document.getElementById("quizeContainer").style.display = "flex";
}

var span = document.getElementsByClassName("message-close")[0];
var modalSubmit = document.getElementById("message-modalSubmit");
var modalBack = document.getElementById("message-modalBack");
var modal = document.getElementById("messageModal");

modalBack.onclick = function () {
  modal.style.display = "none";
};

modalSubmit.addEventListener("click", function () {
  modal.style.display = "none";
  explanation();
});

span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

window.onload = packData;
