async function fetchTodos() {
  // Assume we make a network call to get todo items from the server
  const ids = Object.keys(localStorage);

  return ids.map((id) => {
    const todoItemJSON = localStorage.getItem(id);
    // fetch()
    // JSON.stringify
    return JSON.parse(todoItemJSON);
  });
}

let todoItems;
//Function to create element from data taken from localStorage Database
async function initialize() {
  todoItems = await fetchTodos();

  renderTodoList(todoItems);
}

//Function to save todos in localStorage Database
function saveToDb(id, text, completed) {
  const task = {
    id: id,
    text: text,
    completed: completed,
  };
  localStorage.setItem(id, JSON.stringify(task));
}

//Function to Delete todos from localStorage Database
function deleteFromDb(id) {
  localStorage.removeItem(id);
}

function deleteAllDb() {
  todoItems = [];
  localStorage.clear();
}

//Function to Update Task in localStorage Database
function updateTaskInDb(id, editedText) {
  const ids = localStorage.getItem(id);
  const parsedData = JSON.parse(ids);
  parsedData.text = editedText;
  localStorage.setItem(id, JSON.stringify(parsedData));
  for (let i = 0; i < todoItems.length; i++) {
    const todoitem = todoItems[i];
    if (todoitem.id == id) {
      todoitem.text = editedText;
    }
    console.log(todoItems);
  }
}

//Function to Update completed status in localStorage Database
function updateCompletedStatus(id, completedStatus) {
  const ids = localStorage.getItem(id);
  const parsedData = JSON.parse(ids);
  parsedData.completed = completedStatus;
  localStorage.setItem(id, JSON.stringify(parsedData));
  for (let i = 0; i < todoItems.length; i++) {
    const todoitem = todoItems[i];
    if (todoitem.id == id) {
      todoitem.completed = completedStatus;
    }
  }
}

const form = document.querySelector("#displayBox");
form.addEventListener("submit", submitForm);

// Function to take input on Form Submit
function submitForm(event) {
  console.log("submitting");
  const input = document.querySelector("#userInput");

  event.preventDefault();
  const task = input.value;

  console.log(task);
  const id = new Date().getTime();
  saveToDb(id, task, false);

  createListItem(id, task, false);
  document.forms["displayBox"].reset();
  todoItems.push({
    id: id,
    text: task,
    completed: false,
  });
}

//Function to create List items
function createListItem(id, text, completed) {
  //Creating List
  const listContainer = document.querySelector(".list");
  const taskList = document.createElement("li");
  taskList.setAttribute("id", "taskList");
  taskList.setAttribute("data-id", id);
  listContainer.appendChild(taskList);
  //Creating Checkbox
  const doneTask = document.createElement("INPUT");
  doneTask.setAttribute("type", "checkbox");
  doneTask.setAttribute("id", "todo-checkbox");
  doneTask.setAttribute("class", "todo-checkbox");
  doneTask.checked = completed;
  taskList.appendChild(doneTask);
  //Adding Input in the List
  const textEl = document.createElement("span");
  textEl.id = "element";
  textEl.textContent = text;
  if (completed) {
    textEl.classList.add("checked");
  }
  taskList.append(textEl);
  //Creating Edit Button
  const editButton = document.createElement("button");
  editButton.type = "submit";
  editButton.id = "editButton";
  const editText = document.createTextNode("Edit");
  editButton.appendChild(editText);
  taskList.appendChild(editButton);
  //Creating Save Button
  const saveChange = document.createElement("button");
  saveChange.type = "submit";
  saveChange.id = "saveButton";
  const saveText = document.createTextNode("Save");
  saveChange.appendChild(saveText);
  taskList.appendChild(saveChange);
  //Creating Delete Button
  const button = document.createElement("button");
  button.setAttribute("id", "deleteButton");
  const buttonText = document.createTextNode("X");
  button.appendChild(buttonText);
  taskList.appendChild(button);
  //Calling function on button Click
  editButton.addEventListener("click", editTask);
  saveChange.addEventListener("click", saveTask);
  //Function to Edit Task
  function editTask() {
    editButton.style.display = "none";
    saveChange.style.display = "block";
    textEl.contentEditable = true;
    textEl.style.background = "transparent";
    textEl.style.border = "2px solid black";
  }
  //Function to save edited Task
  function saveTask() {
    saveChange.style.display = "none";
    editButton.style.display = "block";
    textEl.contentEditable = false;
    const editedText = textEl.textContent;
    textEl.style.background = "transparent";
    textEl.style.border = "none";
    updateTaskInDb(id, editedText);
  }

  //Calling Function on Button Click
  button.addEventListener("click", removeTask);
  doneTask.addEventListener("change", taskChange);

  // Function to Delete Specific Tasks on Clicking Delete
  function removeTask() {
    console.log("Deleting Task..");
    taskList.remove();
    button.remove();
    doneTask.remove();
    updateStats();
    deleteFromDb(id);
  }

  // Function to check/uncheck done Tasks
  function taskChange(event) {
    if (event.target.checked) {
      console.log("Task Checked");
      textEl.classList.add("checked");
      updateStats();
      updateCompletedStatus(id, true);
    } else {
      console.log("Task unchecked");
      textEl.classList.remove("checked");
      updateStats();
      updateCompletedStatus(id, false);
    }
  }
  updateStats();
}

// Function to update Task Counts
function updateStats() {
  //For Total Task Count
  const totalItems = document.querySelectorAll("#list li").length;
  document.querySelector("#totalTasks").textContent = totalItems;
  console.log("Total Task: " + totalItems);
  //For Completed Task Count
  const completedItems = document.querySelectorAll(
    "INPUT:checked.todo-checkbox"
  ).length;
  document.querySelector("#completedTask").textContent = completedItems;
  console.log("Completed Task: " + completedItems);
  //For Remaining Task Count
  const remainingItems = totalItems - completedItems;
  document.querySelector("#remainingTask").textContent = remainingItems;
  console.log("Remaining Task: " + remainingItems);
}

const showAll = document.querySelector("#showAll");
const completedTask = document.querySelector("#showCompleted");
const remainingTask = document.querySelector("#showRemaining");
//Calling Function on Button Click
showAll.addEventListener("click", fullList);
completedTask.addEventListener("click", taskCompleted);
remainingTask.addEventListener("click", taskRemaining);

// Function to Show Full Task List
function fullList() {
  console.log("Showing All Task");
  const listItems = Array.from(
    document.querySelector("#list").querySelectorAll("li")
  );
  for (let i = 0; i < listItems.length; i++) {
    const listItem = listItems[i];
    listItem.style.display = "flex";
  }
}

// Function to show Completed Task Only
function taskCompleted() {
  console.log("Showing Completed Task Only");
  const listItems = Array.from(
    document.querySelector("#list").querySelectorAll("li")
  );
  for (let i = 0; i < listItems.length; i++) {
    const listItem = listItems[i];
    const checkBox = listItem.querySelector("input");
    if (!checkBox.checked) {
      listItem.style.display = "none";
    } else {
      listItem.style.display = "flex";
    }
  }
}

// Function to show Remaining Task Only
function taskRemaining() {
  console.log("Showing Remaining Task Only");
  const listItems = Array.from(
    document.querySelector("#list").querySelectorAll("li")
  );
  for (let i = 0; i < listItems.length; i++) {
    const listItem = listItems[i];
    const checkBox = listItem.querySelector("input");
    if (checkBox.checked) {
      listItem.style.display = "none";
    } else {
      listItem.style.display = "flex";
    }
  }
}

const deleteall = document.querySelector("#deleteAll");
deleteall.addEventListener("click", deleteAllTask);
function deleteAllTask() {
  deleteAllDb();
  const taskList = document.getElementById("list");
  while (taskList.firstChild) {
    taskList.removeChild(taskList.lastChild);
  }
  updateStats();
}

const searchInput = document.querySelector("#searchbar");
searchInput.addEventListener("keyup", search);

//Function to search Tasks
function search() {
  console.log("Searching...");
  const taskList = document.getElementById("list");
  while (taskList.firstChild) {
    taskList.removeChild(taskList.lastChild);
  }
  if (searchInput.value == "") {
    renderTodoList(todoItems);
  } else {
    var searchText = searchInput.value.toLowerCase();

    let filteredList = [];

    // for(let i = 0; i < todoItems.length; i++) {
    // const todoItem = todoItems[i]
    let searchedText = todoItems.filter((newarray) =>
      newarray.text.toLowerCase().includes(searchText)
    );
    renderTodoList(searchedText);
  }
}

const sortByTaskStatus = document.querySelector("#sortByTaskStatus");

//Calling Function on Button Click
sortByTaskStatus.addEventListener("click", sortedCompletedTask);

//Function to Sort Completed Task
function sortedCompletedTask(event) {
  const taskList = document.getElementById("list");
  while (taskList.firstChild) {
    taskList.removeChild(taskList.lastChild);
  }
  if (event.target.textContent === "Sort Completed") {
    event.target.textContent = "Sort Remaining";
    const sorted = todoItems.sort((a, b) => b.completed - a.completed);
    renderTodoList(sorted);
  } else {
    event.target.textContent = "Sort Completed";
    todoItems.sort((a, b) => a.completed - b.completed);
    renderTodoList(todoItems);
  }
}

const sortAlphabetically = document.querySelector("#sortTaskByText");
sortAlphabetically.addEventListener("click", SortAlphabetically);
function SortAlphabetically() {
  const taskList = document.getElementById("list");
  while (taskList.firstChild) {
    taskList.removeChild(taskList.lastChild);
  }
  todoItems.sort((a, b) => {
    if (a.text < b.text) {
      return -1;
    }
    if (a.text > b.text) {
      return 1;
    }
    return 0;
  });
  renderTodoList(todoItems);
}

initialize();

function renderTodoList(todoItems) {
  for (let i = 0; i < todoItems.length; i++) {
    const todoItem = todoItems[i];
    createListItem(todoItem.id, todoItem.text, todoItem.completed);
  }
}
