import todoCard from "./todoCard";
const startBtn = document.getElementById("start-btn");
const progressBar = document.getElementById("progressBar");
const displayTimer = document.getElementById("display-timer");
const pomodoroBtn = document.getElementById("pomodoroBtn");
const shortBreakBtn = document.getElementById("shortBreakBtn");
const longBreakBtn = document.getElementById("longBreakBtn");
const statsBtn = document.getElementById("statsBtn");
const statsCloseBtn = document.getElementById("statsCloseBtn");
const statsContainer = document.getElementById("statsContainer");
const pomodoroStatsContainer = document.getElementById(
  "pomodoroStatsContainer"
);
const goalsInput = document.getElementById("goalsInput");
const goalDueDate = document.getElementById("goalDueDate");
const addGoalBtn = document.getElementById("addGoalBtn");
const goalsContainer = document.getElementById("goalsContainer");
const goalsBtn = document.getElementById("goalsBtn");
const goalsCloseBtn = document.getElementById("goalsCloseBtn");
const allGoalsContainer = document.getElementById("allGoalsContainer");

const shortStatsContainer = document.getElementById("shortStatsContainer");
const longStatsContainer = document.getElementById("longStatsContainer");
const goalsStatsContainer = document.getElementById("goalsStatsContainer");
const mainTimerContainer = document.getElementById("main-timer-container");

let timeMinutes = 29; //29
let timeSeconds = 60; //60
let timerInterval;
let sessionType = "pomodoro";
let timesPaused = 0;

// stats for each type of timer
const allPomodoroSessions = JSON.parse(localStorage.getItem("pomodoro")) || [];
const allshortBreakSessions =
  JSON.parse(localStorage.getItem("shortBreak")) || [];
const allLongBreakSessions =
  JSON.parse(localStorage.getItem("longBreak")) || [];
const allGoals = JSON.parse(localStorage.getItem("goals")) || [];

// classes to store timer information

class completedPomodoro {
  constructor(timeStamp, timesPaused) {
    this.timeStamp = timeStamp;
    this.timesPaused = timesPaused;
  }
}

class completedShortBreak {
  constructor(timeElapsed, timesPaused) {
    this.timeElapsed = timeElapsed;
    this.timesPaused = timesPaused;
  }
}

class completedLongBreak {
  constructor(timeElapsed, timesPaused) {
    this.timeElapsed = timeElapsed;
    this.timesPaused = timesPaused;
  }
}

class Goal {
  constructor(estematedDate, goalString, isCompleted) {
    this.estematedDate = estematedDate;
    this.goalString = goalString;
    this.isCompleted = isCompleted;
  }
}

// progress bar
let progess = 0;

const progressCalc = () => {
  if (sessionType === "pomodoro" || sessionType === "longBreak") {
    progess += 0.536;
    progressBar.style.width = `${progess}px`;
  } else if (sessionType === "shortBreak") {
    progess += 2.68;
    progressBar.style.width = `${progess}px`;
  }
};

// make it so that the time value is either 25 or the value that is set in data attribute
displayTimer.textContent = "25:00";

// Timer function that decriments seconds and decriments
// minutes if second is 0
const timer = () => {
  if (timeSeconds > 0) {
    timeSeconds -= 1;
  } else if (timeSeconds === 0) {
    timeMinutes -= 1;
    timeSeconds = 59;
  }

  displayTimer.textContent = `${timeMinutes
    .toString()
    .padStart(2, 0)}:${timeSeconds.toString().padStart(2, 0)}`;
};

// start and pause functionality that uses a click counter
// to check whether to pause or play timer

// play alert sound for start and end of timer
const playStartAudio = () => {
  let startAudio = new Audio("./public/audio/start.mp3");
  startAudio.play();
};

const playEndAudio = () => {
  let endAudio = new Audio("./public/audio/end.mp3");
  endAudio.play();
};

let clickCounter = 0;
startBtn.addEventListener("click", () => {
  setTimeout(() => {
    playStartAudio();
  }, 100);
  clickCounter++;

  console.log(clickCounter);
  startBtn.innerHTML = "STOP";

  if (clickCounter === 2) {
    timesPaused++;
    clearInterval(timerInterval);
    clickCounter = 0;
    startBtn.textContent = "START";
  } else {
    timerInterval = setInterval(() => {
      if (timeMinutes === 0 && timeSeconds === 0) {
        setTimeout(() => {
          playEndAudio();
        }, 10);

        clearInterval(timerInterval);

        timeMinutes = 24;
        timeSeconds = 59;
        displayTimer.textContent = "25:00";

        if (sessionType === "pomodoro") {
          const pomodoroSession = new completedPomodoro(
            getTimeStamp(),
            timesPaused
          );

          allPomodoroSessions.push(pomodoroSession);
          localStorage.setItem("pomodoro", JSON.stringify(allPomodoroSessions));
        } else if (sessionType === "shortBreak") {
          const shortBreakSession = new completedShortBreak(
            getTimeStamp(),
            timesPaused
          );
          allshortBreakSessions.push(shortBreakSession);
          localStorage.setItem(
            "shortBreak",
            JSON.stringify(allshortBreakSessions)
          );
        } else {
          const longBreakSession = new completedLongBreak(
            getTimeStamp(),
            timesPaused
          );
          allLongBreakSessions.push(longBreakSession);
          localStorage.setItem(
            "longBreak",
            JSON.stringify(allLongBreakSessions)
          );
        }
        timesPaused = 0;
      } else {
        timer();
        progressCalc();
      }
    }, 1000);
  }
});

// choose a timer functionality

// POMODORO
pomodoroBtn.addEventListener("click", () => {
  resetTimer();

  timeMinutes = Number(pomodoroBtn.getAttribute("data-Pomodoro-time"));
  displayTimer.textContent = "25:00";
  sessionType = "pomodoro";
  document.body.style.backgroundColor = "#ba4a49";
  mainTimerContainer.style.backgroundColor = "#c05c5c";
  startBtn.style.color = "#ba4a49";
  progressBar.style.width = "0";
  progess = 0;

  const timerBtn = document.querySelectorAll(".timerBtn").forEach((btn) => {
    btn.classList.remove("timerBtn");
  });

  pomodoroBtn.classList.add("timerBtn");
});

// shortbreak

shortBreakBtn.addEventListener("click", () => {
  resetTimer();

  timeMinutes = Number(shortBreakBtn.getAttribute("data-shortBreak-time"));
  displayTimer.textContent = "05:00";
  sessionType = "shortBreak";
  document.body.style.backgroundColor = "#38868a";
  mainTimerContainer.style.backgroundColor = "#4c9196";
  startBtn.style.color = "#38868a";
  progressBar.style.width = "0";
  progess = 0;

  const timerBtn = document.querySelectorAll(".timerBtn").forEach((btn) => {
    btn.classList.remove("timerBtn");
  });

  shortBreakBtn.classList.add("timerBtn");
});

// long break
longBreakBtn.addEventListener("click", () => {
  resetTimer();
  timeMinutes = Number(longBreakBtn.getAttribute("data-longBreak-time"));
  displayTimer.textContent = "25:00";
  sessionType = "longBreak";
  document.body.style.backgroundColor = "#397097";
  mainTimerContainer.style.backgroundColor = "#4d7fa2";
  startBtn.style.color = "#397097";
  progressBar.style.width = "0";
  progess = 0;

  const timerBtn = document.querySelectorAll(".timerBtn").forEach((btn) => {
    btn.classList.remove("timerBtn");
  });

  longBreakBtn.classList.add("timerBtn");
});

// Reset timers when you switch if the timer is running
const resetTimer = () => {
  clearInterval(timerInterval);
  clickCounter = 0;
  startBtn.innerHTML = "START";
  timeSeconds = 60;
};

const getTimeStamp = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

// STATS

// Show/hide stats screen
statsBtn.addEventListener("click", () => {
  pomodoroStatsContainer.innerHTML = "";
  shortStatsContainer.innerHTML = "";
  longStatsContainer.innerHTML = "";
  goalsStatsContainer.innerHTML = "";
  displayAllStats();
  statsContainer.classList.add("show");
});

statsCloseBtn.addEventListener("click", () => {
  statsContainer.classList.remove("show");
});

const displayAllStats = () => {
  const docFrag = document.createDocumentFragment();
  const totalSessions = document.createElement("h2");
  const totalSessionHours = document.createElement("h2");
  const totalInterrupted = document.createElement("h2");
  const totalShortBreaks = document.createElement("h2");
  const totalLongBreaks = document.createElement("h2");
  const totalShortBreakHours = document.createElement("h2");
  const totalLongBreakHours = document.createElement("h2");
  const totalGoals = document.createElement("h2");
  const CompletedGoals = document.createElement("h2");
  const OutstandingGoals = document.createElement("h2");

  let interrupted = 0;
  allPomodoroSessions.forEach((session) => {
    if (session.timesPaused > 0) {
      interrupted++;
    }
  });

  totalSessions.textContent = `Total Session Completed: ${allPomodoroSessions.length}`;
  totalSessionHours.textContent = `Total Session Hours: ${(
    (25 * allPomodoroSessions.length) /
    60
  ).toFixed(2)} hours`;
  totalInterrupted.textContent = `Total Sessions Interrupted: ${interrupted}`;

  totalShortBreaks.textContent = `Total Breaks: ${allshortBreakSessions.length}`;
  totalShortBreakHours.textContent = `Total Break Hours: ${(
    (25 * allshortBreakSessions.length) /
    60
  ).toFixed(2)} hours`;

  totalLongBreaks.textContent = `Total Breaks: ${allLongBreakSessions.length}`;
  totalLongBreakHours.textContent = `Total Break Hours: ${(
    (25 * allLongBreakSessions.length) /
    60
  ).toFixed(2)} hours`;

  // keeps track of completed goals by looping through and check if iScomplete is  true
  let totalCompleted = 0;
  allGoals.forEach((goal) => {
    if (goal.isCompleted === true) {
      totalCompleted++;
    }
  });

  totalGoals.textContent = `Total Goals: ${allGoals.length}`;
  CompletedGoals.textContent = `Completed Goals: ${totalCompleted}`;

  // Checks for Overdue goals
  let overDueGoals = 0;
  let today = new Date();
  allGoals.forEach((goal) => {
    let date = new Date(goal.estematedDate);
    if (today > date && goal.isCompleted === false) {
      overDueGoals++;
    }
  });

  OutstandingGoals.textContent = `Overdue Goals: ${overDueGoals}`;

  docFrag.append(totalSessions, totalSessionHours, totalInterrupted);
  pomodoroStatsContainer.append(docFrag);

  docFrag.append(totalShortBreaks, totalShortBreakHours);
  shortStatsContainer.append(docFrag);

  docFrag.append(totalLongBreaks, totalLongBreakHours);
  longStatsContainer.append(docFrag);

  docFrag.append(totalGoals, CompletedGoals, OutstandingGoals);
  goalsStatsContainer.append(docFrag);
};

displayAllStats();

// GOALS

// open and close goals section
goalsBtn.addEventListener("click", () => {
  goalsContainer.classList.add("show");
});

goalsCloseBtn.addEventListener("click", () => {
  goalsContainer.classList.remove("show");
});

// add goals on button click
addGoalBtn.addEventListener("click", () => {
  if (goalsBtn.value !== "" && goalDueDate.value !== "") {
    addGoal();
    goalsInput.value = "";
    goalDueDate.value = "";
  }
});

// add a goal and refresh all goals local storage with new data
const addGoal = () => {
  const goal = new Goal(goalDueDate.value, goalsInput.value, false);
  allGoals.push(goal);
  localStorage.setItem("goals", JSON.stringify(allGoals));
  allGoalsContainer.innerHTML = "";
  displayGoals();
};

let editClickCounter = 0;
// display all goals onto the goals container
const displayGoals = () => {
  // const docFrag = document.createDocumentFragment();
  allGoals.forEach((goal) => {
    const goalCard = document.createElement("div");

    goalCard.classList.add("goalCard");
    goalCard.innerHTML = todoCard(goal.goalString, goal.estematedDate);
    allGoalsContainer.append(goalCard);
  });

  const goalCheckBox = document.querySelectorAll(".goalCheckBox");
  const editBtns = document.querySelectorAll(".editBtn");
  const deleteBtns = document.querySelectorAll(".deleteBtn");

  // goal checkbox functionality
  goalCheckBox.forEach((checkbox, index) => {
    // saves the state of checkboxes and makes them persistent

    if (allGoals[index].isCompleted === true) {
      goalCheckBox[index].checked = true;
    } else {
      goalCheckBox[index].checked = false;
    }

    checkbox.addEventListener("click", () => {
      togglecompletedGoals(checkbox, index);
    });
  });

  editBtns.forEach((editBtn, index) => {
    editBtn.addEventListener("click", () => {
      goalsInput.focus();
      editBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i>`;
      editClickCounter++;
      if (editClickCounter === 2) {
        editGoal(index);
        editClickCounter = 0;
        editBtn.innerHTML = `<i class="fa-solid fa-square-pen editBtn"></i>`;
      }
    });
  });

  deleteBtns.forEach((deleteBtn, index) => {
    deleteBtn.addEventListener("click", () => {
      deleteGoal(index);
    });
  });
};

displayGoals();

// checkBox updated goal completed status
const togglecompletedGoals = (checkbox, index) => {
  if (checkbox.checked === true) {
    allGoals[index].isCompleted = true;
  } else if (checkbox.checked === false) {
    allGoals[index].isCompleted = false;
  }
  localStorage.setItem("goals", JSON.stringify(allGoals));
};

//edit goal functionality
const editGoal = (index) => {
  if (goalsInput.value !== "") {
    allGoals[index].goalString = goalsInput.value;
    localStorage.setItem("goals", JSON.stringify(allGoals));
    allGoalsContainer.innerHTML = "";
    displayGoals();
  }
};

// delete goal functionality

const deleteGoal = (index) => {
  allGoals.splice(index, 1);
  localStorage.setItem("goals", JSON.stringify(allGoals));
  allGoalsContainer.innerHTML = "";
  displayGoals();
};
