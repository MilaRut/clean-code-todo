const taskInput = document.getElementById('new-task');
const addButton = document.getElementById('add-task');
const incompleteTaskList = document.getElementById('incomplete-tasks');
const completedTaskList = document.getElementById('completed-tasks');

const createDeleteButton = function () {
  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-button';

  const icon = document.createElement('img');
  icon.src = './remove.svg';
  deleteButton.appendChild(icon);

  return deleteButton;
};

const createTaskElement = function (taskText) {
  const checkBox = document.createElement('input');
  checkBox.type = 'checkbox';

  const label = document.createElement('label');
  label.className = 'task-text';
  // innerText, not innerHTML: the task text comes from the user and must not be parsed as markup.
  label.innerText = taskText;

  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'task-text';

  const editButton = document.createElement('button');
  editButton.className = 'edit-button';
  editButton.innerText = 'Edit';

  const listItem = document.createElement('li');
  listItem.append(checkBox, label, editInput, editButton, createDeleteButton());
  return listItem;
};

const appendTaskToList = function (listItem, taskList, onCheckboxChange) {
  taskList.appendChild(listItem);
  bindTaskEvents(listItem, onCheckboxChange);
};

const addTask = function () {
  if (!taskInput.value) return;
  const listItem = createTaskElement(taskInput.value);

  appendTaskToList(listItem, incompleteTaskList, completeTask);

  taskInput.value = '';
};

const toggleEditMode = function () {
  const listItem = this.parentNode;

  const editInput = listItem.querySelector('input[type=text]');
  const label = listItem.querySelector('label');
  const editButton = listItem.querySelector('.edit-button');
  const isEditMode = listItem.classList.contains('edit-mode');
  if (isEditMode) {
    label.innerText = editInput.value;
    editButton.innerText = 'Edit';
  } else {
    editInput.value = label.innerText;
    editButton.innerText = 'Save';
  }

  listItem.classList.toggle('edit-mode');
};

const deleteTask = function () {
  const listItem = this.parentNode;
  const taskList = listItem.parentNode;
  taskList.removeChild(listItem);
};

const completeTask = function () {
  appendTaskToList(this.parentNode, completedTaskList, reopenTask);
};

const reopenTask = function () {
  appendTaskToList(this.parentNode, incompleteTaskList, completeTask);
};

addButton.addEventListener('click', addTask);

const bindTaskEvents = function (listItem, onCheckboxChange) {
  const checkBox = listItem.querySelector('input[type=checkbox]');
  const editButton = listItem.querySelector('.edit-button');
  const deleteButton = listItem.querySelector('.delete-button');

  // Handlers are assigned to on* properties, not added with addEventListener:
  // a task is rebound every time it moves between lists, and assignment
  // replaces the previous handler instead of stacking another one.
  editButton.onclick = toggleEditMode;
  deleteButton.onclick = deleteTask;
  checkBox.onchange = onCheckboxChange;
};

const bindTaskListEvents = function (taskList, onCheckboxChange) {
  for (const listItem of taskList.children) {
    bindTaskEvents(listItem, onCheckboxChange);
  }
};

bindTaskListEvents(incompleteTaskList, completeTask);
bindTaskListEvents(completedTaskList, reopenTask);
