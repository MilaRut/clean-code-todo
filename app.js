const taskInput = document.getElementById('new-task');
const addButton = document.querySelector('.task-row-wrapper button');
const incompleteTaskList = document.getElementById('incompleteTasks');
const completedTaskList = document.getElementById('completed-tasks');

const createTaskElement = function (taskText) {
  const listItem = document.createElement('li');

  const checkBox = document.createElement('input');
  const label = document.createElement('label');
  const editInput = document.createElement('input');
  const editButton = document.createElement('button');

  const deleteButton = document.createElement('button');
  const deleteButtonImg = document.createElement('img');

  // innerText, not innerHTML: the task text comes from the user and must not be parsed as markup.
  label.innerText = taskText;
  label.className = 'task';

  checkBox.type = 'checkbox';
  editInput.type = 'text';
  editInput.className = 'task';

  editButton.innerText = 'Edit';
  editButton.className = 'edit';

  deleteButton.className = 'delete';
  deleteButtonImg.src = './remove.svg';
  deleteButton.appendChild(deleteButtonImg);

  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);
  return listItem;
};

const addTask = function () {
  if (!taskInput.value) return;
  const listItem = createTaskElement(taskInput.value);

  incompleteTaskList.appendChild(listItem);
  bindTaskEvents(listItem, completeTask);

  taskInput.value = '';
};

const toggleEditMode = function () {
  const listItem = this.parentNode;

  const editInput = listItem.querySelector('input[type=text]');
  const label = listItem.querySelector('label');
  const editButton = listItem.querySelector('.edit');
  const isEditMode = listItem.classList.contains('editMode');
  if (isEditMode) {
    label.innerText = editInput.value;
    editButton.innerText = 'Edit';
  } else {
    editInput.value = label.innerText;
    editButton.innerText = 'Save';
  }

  listItem.classList.toggle('editMode');
};

const deleteTask = function () {
  const listItem = this.parentNode;
  const taskList = listItem.parentNode;
  taskList.removeChild(listItem);
};

const completeTask = function () {
  const listItem = this.parentNode;
  completedTaskList.appendChild(listItem);
  bindTaskEvents(listItem, reopenTask);
};

const reopenTask = function () {
  const listItem = this.parentNode;
  incompleteTaskList.appendChild(listItem);
  bindTaskEvents(listItem, completeTask);
};

addButton.addEventListener('click', addTask);

const bindTaskEvents = function (listItem, onCheckboxChange) {
  const checkBox = listItem.querySelector('input[type=checkbox]');
  const editButton = listItem.querySelector('button.edit');
  const deleteButton = listItem.querySelector('button.delete');

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
