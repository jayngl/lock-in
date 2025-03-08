const startBtn = document.getElementById("start-btn");
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

const allStats = document.getElementById("allStats");

const shortStatsContainer = document.getElementById("shortStatsContainer");
const longStatsContainer = document.getElementById("longStatsContainer");
const goalsStatsContainer = document.getElementById("goalsStatsContainer");

let timeMinutes = 29; //29
let timeSeconds = 60; //60
let timerInterval;
let sessionType = "pomodoro";
let timesPaused = 0;

const backgroundVideos = [];

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

// make it so that the time value is either 25 or the value that is set in data attribute
displayTimer.textContent = "25:00";

// Timer function that decriments seconds and decriments
// minutes if second is 0
const timer = () => {
  if (timeSeconds > 0) {
    timeSeconds -= 1;
  } else if (timeSeconds === 0) {
    timeMinutes -= 1;
    timeSeconds = 60;
  }

  displayTimer.textContent = `${timeMinutes
    .toString()
    .padStart(2, 0)}:${timeSeconds.toString().padStart(2, 0)}`;
};

// start and pause functionality that uses a click counter
// to check whether to pause or play timer

let clickCounter = 0;
startBtn.addEventListener("click", () => {
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
      }
    }, 1000);
  }
});

// choose a timer functionality

// pomodoro
pomodoroBtn.addEventListener("click", () => {
  resetTimer();

  timeMinutes = Number(pomodoroBtn.getAttribute("data-Pomodoro-time"));
  displayTimer.textContent = "25:00";
  sessionType = "pomodoro";

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

// getTimeStamp();
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
  const totalSessions = document.createElement("h1");
  const totalSessionHours = document.createElement("h1");
  const totalInterrupted = document.createElement("h1");
  const totalShortBreaks = document.createElement("h1");
  const totalLongBreaks = document.createElement("h1");
  const totalShortBreakHours = document.createElement("h1");
  const totalLongBreakHours = document.createElement("h1");
  const totalGoals = document.createElement("h1");
  const CompletedGoals = document.createElement("h1");
  const OutstandingGoals = document.createElement("h1");

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

  OutstandingGoals.textContent = `Outstanding Goals: ${overDueGoals}`;

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

// total break for both and total break hours for both

// for the interupted sessions
// if paused > 0 then incremement a variable

// Total Pomodoro sessions completed
// Total minutes/hours of focused workv - total full sessions in hours

// Number of interrupted sessions - variable to keep track of how many times timer is paused
// Breaks taken vs. skipped

// GOALS
// make it so that user is able to set goals
// stats for goal, total goals completed, goal are ment to be done in a time frame
//  so maybe should i add expected total sessions to complete

// ADD Asthetic gifs for each timer

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
  const docFrag = document.createDocumentFragment();
  allGoals.forEach((goal, index) => {
    const goalCard = document.createElement("div");
    const goalCheckbox = document.createElement("INPUT");
    goalCheckbox.setAttribute("type", "checkbox");
    goalCheckbox.classList.add("goalCheckbox");

    goalCheckbox.addEventListener("click", () => {
      togglecompletedGoals(goal, goalCheckbox);
    });

    // saves the state of checkboxes and makes them persistent

    if (goal.isCompleted === true) {
      goalCheckbox.checked = true;
    } else {
      goalCheckbox.checked = false;
    }
    const goalTitle = document.createElement("p");
    const goaldueBy = document.createElement("p");
    const editBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");

    editBtn.addEventListener("click", () => {
      goalsInput.focus();
      editBtn.textContent = "save";
      editClickCounter++;
      console.log(editClickCounter);
      if (editClickCounter === 2) {
        editGoal(index);
        editClickCounter = 0;
        editBtn.textContent = "save";
      }
    });

    deleteBtn.addEventListener("click", () => {
      deleteGoal(index);
    });

    goaldueBy.textContent = `Deadline: ${goal.estematedDate}`;
    goalTitle.textContent = goal.goalString;
    editBtn.textContent = "edit";
    deleteBtn.textContent = "delete";
    goalCard.classList.add("goalCard");
    goalCard.append(goalCheckbox, goaldueBy, goalTitle, editBtn, deleteBtn);
    docFrag.append(goalCard);
    allGoalsContainer.append(docFrag);
  });
};

displayGoals();

// checkBox updated goal completed status
const togglecompletedGoals = (goal, goalCheckbox) => {
  if (goalCheckbox.checked === true) {
    goal.isCompleted = true;
  } else if (goalCheckbox.checked === false) {
    goal.isCompleted = false;
  }
  localStorage.setItem("goals", JSON.stringify(allGoals));
};

//edit goal functionality
const editGoal = (index) => {
  allGoals[index].goalString = goalsInput.value;
  localStorage.setItem("goals", JSON.stringify(allGoals));
  allGoalsContainer.innerHTML = "";
  displayGoals();
};

// delete goal functionality

const deleteGoal = (index) => {
  allGoals.splice(index, 1);
  localStorage.setItem("goals", JSON.stringify(allGoals));
  allGoalsContainer.innerHTML = "";
  displayGoals();
};
