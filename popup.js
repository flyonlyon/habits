const taskList = document.getElementById('task-list');
const addBtn = document.getElementById('add-btn');
const taskInput = document.getElementById('task');
const progressBar = document.getElementById('progress-bar');
const progressBarInner = document.getElementById('progress-bar-inner');
const progressBarText = document.getElementById('progress-bar-text');
const flowerImage = document.getElementById('flower-img');

let tasks = [];

// chrome.browserAction.setIcon({path: "images/sad.png"});
// Load tasks from storage
chrome.storage.sync.get('tasks', (data) => {
  if (data.tasks) {
    tasks = data.tasks;
    renderTasks();
    updateProgressBar();
  }
});

// Add task to list
function addTask(task) {
  tasks.push({ text: task, completed: false });
  chrome.storage.sync.set({ tasks });
  renderTasks();
  updateProgressBar();
}

// Remove task from list
function removeTask(index) {
  tasks.splice(index, 1);
  chrome.storage.sync.set({ tasks });
  renderTasks();
  updateProgressBar();
}

// Toggle task completion
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  chrome.storage.sync.set({ tasks });
  updateProgressBar();
}

// Render tasks in list
function renderTasks() {
  taskList.innerHTML = '';
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');
    if (task.completed) {
      taskItem.classList.add('completed');
    }
    const taskCheckbox = document.createElement('input');
    taskCheckbox.setAttribute('type', 'checkbox');
    taskCheckbox.checked = task.completed;
    taskCheckbox.classList.add('completed-checkbox');
    taskCheckbox.addEventListener('change', () => {
      toggleTask(i);
    });
    const taskLabel = document.createElement('label');
    taskLabel.textContent = task.text;
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = 'X';
    deleteButton.addEventListener('click', () => {
      removeTask(i);
    });
    taskItem.appendChild(taskCheckbox);
    taskItem.appendChild(taskLabel);
    taskItem.appendChild(deleteButton);
    taskList.appendChild(taskItem);
  }
}

// Update progress bar based on tasks completed
function updateProgressBar() {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks === 0 ? 0 : completedTasks / totalTasks;
  progressBarInner.style.width = `${progress * 100}%`;
  progressBarInner.textContent = `${Math.round(progress * 100)}%`;
  progressBarText.textContent = `${completedTasks} / ${totalTasks} tasks completed`;

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
addBtn.addEventListener('click', function () {
  const task = taskInput.value.trim();
  if (task) {
    addTask(task);
    taskInput.value = '';
    taskInput.focus();
  }
});
