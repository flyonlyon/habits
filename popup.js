let tasks = [];
const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const title = document.getElementById('weekday');
const d = new Date();
title.innerHTML = weekday[d.getDay()];
var hoursLeft = 23 - d.getHours();
var minutesLeft = 59 - d.getMinutes();
var secondsLeft = 59 - d.getSeconds();

var timeLeft = (hoursLeft * 3600) + (minutesLeft * 60) + secondsLeft;
updateTimer();
setInterval(updateTimer, 1000); //every second

function updateTimer() {
  const timer = document.getElementById('timer');
  var hrs = Math.floor(timeLeft/3600);
  var mins = Math.floor((timeLeft - (hrs*3600))/60);
  var secs = Math.floor(timeLeft - ((hrs*3600) + (mins*60)));
  timer.innerHTML = hrs + "hr(s) " + mins + "min(s) " + secs + "second(s) left";
  timeLeft--;
}

// Load tasks from storage

chrome.storage.sync.get('list', function(data){
  if (data.list) {
    tasks = data.list;
    createTasks();
    updateProgressBar();
  }
});

// Add task to list
function addTask(task) {
  tasks.push({
     item: task, 
     completed: false 
  });
  chrome.storage.sync.set({list: tasks });
  createTasks();
  updateProgressBar();
}

// Remove task from list
function removeTask(index) {
  tasks.splice(index, 1);
  chrome.storage.sync.set({ list: tasks });
  createTasks();
  updateProgressBar();
}

// Toggle task completion
function toggle(index) {
  tasks[index].completed = !tasks[index].completed;
  chrome.storage.sync.set({ list: tasks });
  updateProgressBar();
}

// Render tasks in list
function createTasks() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';
  for (let i = 0; i < tasks.length; i++) {
    const task = document.createElement('li');
    task.classList.add('taskItem');
    if (tasks[i].completed) {
      task.classList.add('completed');
    }
    const taskCheckbox = document.createElement('input');
    taskCheckbox.setAttribute('type', 'checkbox');
    taskCheckbox.checked = tasks[i].completed;
    taskCheckbox.classList.add('completed');
    taskCheckbox.addEventListener('click', () => {
      toggle(i);
    });
    const taskContent = document.createElement('label');
    taskContent.innerHTML = tasks[i].item;
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete');
    deleteButton.innerHTML = 'X';
    deleteButton.addEventListener('click', () => {
      removeTask(i);
    });
    task.appendChild(taskCheckbox);
    task.appendChild(taskContent);
    task.appendChild(deleteButton);
    taskList.appendChild(task);
  }
}

// Update progress bar based on tasks completed
function updateProgressBar() {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  let progress = 0;
    
  if (totalTasks == 0){
      progress = 0;
  }
  else{
    progress = completedTasks / totalTasks;
  }
    
  const progressBarInner = document.getElementById('progressBar-inner');
  progressBarInner.style.width = `${progress * 100}%`;
    
  if (progress == 0) {
      progressBarInner.innerHTML = "&nbsp" + `${Math.round(progress * 100)}%`;
  } else {
      progressBarInner.innerHTML = `${Math.round(progress * 100)}%`;
  }
  
  const progressBarText = document.getElementById('progressBar-text');
  progressBarText.innerHTML = `${completedTasks} / ${totalTasks} tasks completed`;

  const flowerImage = document.getElementById('flower-img');
  if (Math.round(progress * 100) < 25) {
    flowerImage.src = "images/flowers-1.png";
  } else if (Math.round(progress * 100) >= 25 && Math.round(progress * 100) < 50) {
    flowerImage.src = "images/flowers-2.png";
  } else if (Math.round(progress * 100) >= 50 && Math.round(progress * 100) < 75) {
    flowerImage.src = "images/flowers-3.png";
  } else if (Math.round(progress * 100) >= 75 && Math.round(progress * 100) < 100) {
    flowerImage.src = "images/flowers-4.png";
  } else {
    flowerImage.src = "images/flowers-5.png";
  }

  // Change extension icon to happy.png if all tasks are completed
  if (completedTasks == totalTasks) {
    chrome.browserAction.setIcon({ path: 'images/happyface.png'});
  } else {
    chrome.browserAction.setIcon({ path: 'images/Sad-Face-Emoji.png'});
  }
}

// Add task form submit event
const addBtn = document.getElementById('button');
const taskInput = document.getElementById('task');
addBtn.addEventListener('click', function () {
  if (taskInput.value) {
    addTask(taskInput.value);
    taskInput.value = '';
  }
});

let circleProgress = document.getElementById('outerCircle');

const progressVal = document.getElementById('value');
const goalVal = document.getElementById('waterVal');
const addBut = document.getElementById('addBut');
const watBut = document.getElementById('addBut');
var addVal = document.getElementById('currentAddition');
var addGoal = document.getElementById('newAdd');
var subGoal = document.getElementById('newSub');
var goal = 0;
var begin = 0;

watBut.addEventListener('click', () => {
  event.preventDefault();
  goal = parseInt(goalVal.value);
  if (goal != "") {
    progressVal.innerHTML = begin + "/" + goal;
    circleProgress.style.background = `conic-gradient(#8E94F2 ${(begin / goal) * 360}deg, white 0deg)`;
  }
});

addGoal.addEventListener('click', () => {
  event.preventDefault();
  let addVal = document.getElementById('currentAddition');
  if (addVal.value != "") {
    begin += parseInt(addVal.value);
    circleProgress.style.background = `conic-gradient(#8E94F2 ${(begin / goal) * 360}deg, white 0deg)`;
    progressVal.innerHTML = begin + "/" + goal;   
  }
});

subGoal.addEventListener('click', () => {
  event.preventDefault();
  let subVal = document.getElementById('currentAddition');
  if (addVal.value != "") {
    begin -= parseInt(addVal.value);
    if (begin < 0) begin = 0;
    circleProgress.style.background = `conic-gradient(#8E94F2 ${(begin / goal) * 360}deg, white 0deg)`;
    progressVal.innerHTML = begin + "/" + goal;
  }
});

// chrome.storage.sync.set({
//   currGoal: goal,
//   currProgress: begin
// });

// chrome.storage.sync.get(['currGoal', 'currProgress'] () => {
//   rogressVal.innerHTML = currProgress + "/" + currGoal;
// });