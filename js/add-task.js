let today = new Date().toISOString().split('T')[0];
let selectorCategoryIndex = 0;
let taskCategorySelector = [];
let categorySelectedColor;
let selectorcontactIndex = 0;
let userSelect = [];
let taskCategoryFinaly = [];
let prioritySelect = [];
let subTasks = [];
let userSelected = [];

/**
 * function is called when the page is loading
 */
async function initAddTask() {
  await init();
  highlightNavigation();
  checkLoginStatus();
  getUserTasks();
  showUserLetters();
  getToday();
}

/**
 * gets the current day
 */
function getToday() {
  document.getElementById('add-date').setAttribute('min', today);
}


/**
 * function to add a Task. Calls function to check HTML values, to create and save a task.
 * @param {number} i - index of task
 */
async function addToTask(i, taskStatus) {
  let title = document.getElementById('AddTitle');
  let description = document.getElementById('AddDescription');
  let dueDate = document.getElementById('add-date');
  if (noCategorySelected()) {
    infoChooseCategory();
  } else if (noPrioritySelected()) {
    infoChoosePriority();
  } else {
    disableButton('add_task_btn');
    let currentTask = createTaskObject(title, description, dueDate, taskStatus);
    currentUserTasks.push(currentTask);
    await backend.setItem('users', JSON.stringify(users));
    resetTaskSelections();
    checkPage(i);
  }
  resetContactSelector();
}


/**
 * function to create a task JSON-Object
 * @param {string} title 
 * @param {string} description 
 * @param {string} dueDate 
 * @param {string} taskStatus 
 * @returns 
 */
function createTaskObject(title, description, dueDate, taskStatus) {
  currentTask = {
    "id": (new Date().getTime() * Math.random()).toFixed(0),
    "category": {
      Category: taskCategoryFinaly,
      TaskColor: taskCategoryColorFinaly,
    },
    "title": title.value,
    "description": description.value.replace(/\n/g, "<br>\n"),
    "dueDate": dueDate.value,
    "priority": prioritySelect,
    "user": userSelect,
    "subTasks": subTasks,
    'status': taskStatus
  };
  return currentTask;
}


/**
 * function to check on which page the users created a task
 * @param {number} i index 
 */
function checkPage(i) {
  if (userIsOnAddTaskPage(i)) {
    showBoardPage();
    sortTasks();
  } else if (userIsOnBoardPage(i)) {
    closeEditorSideMenu();
    ShowTaskAddedPopUp();
    sortTasks();
  }
}


/**
 * clears the array which are used to create a task.
 */
function resetTaskSelections() {
  prioritySelect = [];
  taskCategoryFinaly = [];
  subTasks = [];
  userSelect = [];
}


/**
 * displays a overlay info when a task was created on board.html. 
 */
function ShowTaskAddedPopUp() {
  document.getElementById('task_added_to_board_img').classList.remove('d-none');
  setTimeout(() => {
    document.getElementById('task_added_to_board_img').classList.add('d-none');
  }, 1000);

}


/**
 * renders the task editor, when user is on board
 * @param {number} i index of task
 * @param {string} taskStatus the current task status
 */
function openAddTaskMask(i, taskStatus) {
  document.getElementById('detail_content').classList.add('d-none');
  document.getElementById('AddTaskMaskBg').classList.remove('d-none');
  document.getElementById('AddTaskMaskContainer').classList.remove('d-none');
  resetSubTaskSelection();
  showEditorMask(i, taskStatus);
  getToday();
}


/**
 * renders the editor mask in task editor menu
 * @param {number} i index of task
 * @param {string} taskStatus the current task status
 */
function showEditorMask(i, taskStatus) {
  document.getElementById('AddTaskMaskContainer').innerHTML = openAddTaskHtml(i, taskStatus);
}


/**
 * renders subtasks in task editor
 */
function renderSubTask() {
  document.getElementById("addSubtaskCheckbox").innerHTML = ``;
  for (let i = 0; i < subTasks.length; i++) {
    let subTask = subTasks[i];
    document.getElementById("addSubtaskCheckbox").innerHTML += showSubtaskCheckbox(subTask, i);
  }
}


/**
 * function to delete a subtask in a current task
 * @param {number} i index of subtask in task
 */
function deleteSubTaskAdd(i) {
  document.getElementById(`subTask_${i}`).innerHTML = ``;
  subTasks.splice(i, 1);
}


/**
 * pushes a subtask in current tasks JSON-array
 */
function pushSubtasks() {
  let text = document.getElementById('new_subtask_text').value;
  let container = document.getElementById('empty_subtask_text');
  container.innerHTML = '';
  isNewSubTask(text);
}


/**
 * get input values and adds calls functions to add a new subtask
 * @param {string} text text from HTML form
 */
function isNewSubTask(text) {
  if (inputFilled(text)) {
    let newSubTask = createSubTaskObject(text);
    subTasks.push(newSubTask)
    renderSubTask();
    clearSubTaskInput();
  } else if (text.length == 0) {
    infoEnterASubTask();
  }
}


/**
 * creates a subTask object and returns it
 * @param {string} text text from HTML form
 * @returns JSON
 */
function createSubTaskObject(text) {
  newSubTask = {
    'title': text,
    'done': false
  }
  return newSubTask;
}


/**
 * displays a short info, if the subtask input is empty
 */
function infoEnterASubTask() {
  let input = document.getElementById("new_subtask_text")
  input.placeholder = 'Please enter a subtask!';
  setTimeout(() => {
    input.placeholder = 'Add a new subtask!';
  }, 2000);
}


/**
 * closes the task editors in board.html and add-task.html
 * @param {number} option 
 */
function closeAddTaskMask(option) {
  resetUserSelection();
  if (option == 1) {
    document.getElementById('AddTaskMaskBg').classList.add('d-none');
    selectorcontactIndex = 0;
  } else if (option == 0) {
    document.getElementById('openContactAddtaskBG').classList.add('d-none');
    selectorcontactIndex = 0;
    resetContactDropdown();
  }
}


/**
 * calls functions to render the contact drop down in task editor
 * @param {number} contact number of contact
 */
function showUsers(contact) {
  let currentUserContact = currentUser.contacts;
  clearUserDropdown();
  if (selectorcontactIndex == 0) {
    clearSelectedContacts();
    selectorcontactIndex++;
    renderUserContactDropdown(currentUserContact);
    checkIfInvitationsfieldSelected(contact);
    checkIfUserSelectedContact(contact);
    addSelectedContactFromDropdown();
  } else {
    showSelectedContactBubbles();
  }
}


/**
 * renders contacts in task editor dropdown
 * @param {array} currentUserContact 
 */
function renderUserContactDropdown(currentUserContact) {
  for (let i = 0; i < currentUserContact.length; i++) {
    document.getElementById('selector_user_dropdown').innerHTML += showContactsDropDown(i, currentUserContact, currentUser);
  }
}


/**
 * checks if the user selected a contact in dropdown and iditifies it
 * @param {number} contact 
 */
function checkIfUserSelectedContact(contact) {
  if (contact == 0) {
    let f = savecontactforaddtask;
    let contactintask = currentUser.contacts[f];
    let contactInitials = contactintask['contactInitials'];
    let contactcolor = contactintask['contactcolor'];
    let contactname = contactintask['contactName'];
    selectedUser(contactInitials, contactcolor, contactname);
  }
}


/**
 * adds a selected contact to the assigned list
 */
function addSelectedContactFromDropdown() {
  if (userSelect.length > 0) {
    for (let j = 0; j < userSelect.length; j++) {
      let contactInitials = userSelect[j]['contactInitials'];
      let contactcolor = userSelect[j]['concolor'];
      let contactname = userSelect[j]['contactname'];
      selectedUserAdd(contactInitials, contactcolor, contactname);
    }
  }
}

/**
 * checks if the user clicked on user invitation. if not, it displays a invite info
 * @param {number} contact 
 */
function checkIfInvitationsfieldSelected(contact) {
  if (!(contact == 0)) {
    document.getElementById('selector_user_dropdown').innerHTML += showInviteNewContact();
  }
}


/**
 * shows the contact bubbles for the selected contacts after closing the drop down menu
 */
function showSelectedContactBubbles() {
  clearUserDropdown();
  for (let i = 0; i < userSelect.length; i++) {
    document.getElementById('selector_user_dropdown_contact').innerHTML += selectedContactHTML(i);
  }
  selectorcontactIndex--;
}


/**
 * clears dropdown in task editor
 */
function resetContactDropdown() {
  let f = savecontactforaddtask;
  let contactintask = currentUser.contacts[f];
  let contactcolor = contactintask['contactcolor'];
  let index = findContactIndex(contactcolor);
  userSelect.splice(index, 1);
  clearUserDropdown();
}


/**
 * gives a contact the status selected
 * @param {string} contactInitials 
 * @param {string} contactcolor 
 * @param {string} contactname 
 */
function selectedUserAdd(contactInitials, contactcolor, contactname) {
  document.getElementById('user_select' + contactInitials + contactcolor + contactname).classList.add('checked');
  document.getElementById('user_select' + contactInitials + contactcolor + contactname).src = 'assets/img/userSelect-selected.png';
}


/**
 * calls function to identify a contact or remove them from dropdown in editor mask
 * @param {string} contactInitials 
 * @param {string} contactcolor 
 * @param {string} contactname 
 */
function selectedUser(contactInitials, contactcolor, contactname) {
  let index = findContactIndex(contactcolor);
  let verify = index - 1;
  if (contactHasCheckedAttribute(contactInitials, contactcolor, contactname)) {
    removeContactFromDropdown(index, contactInitials, contactcolor, contactname);
  } else if (verify < 0) {
    showInfoNoContactSelected();
  } else {
    pushSelectedContact(contactInitials, contactcolor, contactname);
    selectedUserAdd(contactInitials, contactcolor, contactname);
  }
}


/**
 * pushes contact object to user object
 * @param {string} contactInitials 
 * @param {string} contactcolor 
 * @param {string} contactname 
 */
function pushSelectedContact(contactInitials, contactcolor, contactname) {
  userSelect.push({
    'contactInitials': contactInitials,
    'concolor': contactcolor,
    'contactname': contactname
  });
}


/**
 * removes a selected contact from dropdown in editor mask
 * @param {number} index of contact
 * @param {string} contactInitials 
 * @param {string} contactcolor 
 * @param {string} contactname 
 */
function removeContactFromDropdown(index, contactInitials, contactcolor, contactname) {
  userSelect.splice(index, 1)
  document.getElementById('user_select' + contactInitials + contactcolor + contactname).classList.remove('checked');
  document.getElementById('user_select' + contactInitials + contactcolor + contactname).src = 'assets/img/userSelect-img.png';
}


/**
 * gets contact index by colorcode an returns it
 * @param {string} contactcolor 
 * @returns 
 */
function findContactIndex(contactcolor) {
  let index;
  for (let i = 0; i < userSelect.length; i++) {
    if (userSelect[i].concolor == contactcolor)
      index = i;
  }
  return index;
}


/**
 * renders the category dropdown in task editor
 */
function showTaskCategories() {
  if (selectorCategoryIndex == 0) {
    clearCategoryDropdown();
    document.getElementById('selector_Category_Dropdown').innerHTML += showNewCategory();
    for (let i = 0; i < currentUser.category.length; i++) {
      let categorys = currentUser.category[i];
      document.getElementById('selector_Category_Dropdown').innerHTML += showExistingCategories(categorys);
    }
    selectorCategoryIndex++;
  } else {
    clearCategoryDropdown();
    selectorCategoryIndex--;
  }
};



/**
 * gets the selected category
 * @param {string} category 
 * @param {string} color
 */
function selectedCategory(category, color) {
  taskCategoryFinaly = category;
  taskCategoryColorFinaly = color;
  document.getElementById("category_selector").innerHTML = showSelectCategory(category, color);
  clearCategoryDropdown();
  selectorCategoryIndex--;
}


/**
 * displays the input field to add a new category
 */
function changeInputCategory() {
  clearCategoryDropdown();
  document.getElementById('category_selector').innerHTML = showChangeInputCategory();
}


/**
 * closes add-category input field in task editor
 */
function exitCategoryInput() {
  document.getElementById('category_selector').innerHTML = showExitCategoryInput();
  showTaskCategories();
}


/**
 * checks if user selected a color and calls function to add signature color to new category
 * @param {string} color
 */
function addCategoryColor(color) {
  if (categoryColorSelected()) {
    addColorToNewCategory(color);
  } else {
    showInfoPleaseEnterCategory();
  }
}


/**
 * adds color to a new category
 * @param {string} color 
 */
function addColorToNewCategory(color) {
  categorySelectedColor = color;
  document.getElementById("categoryColorCells").innerHTML = ``;
  document.getElementById("categoryColorCells").innerHTML = ` <img class="chosen-color" src="./assets/img/${categorySelectedColor}.png" alt="">`;
  clearCategoryInfoField();
}


/**
 * function to add a new category to tasks
 */
async function addCategory() {
  newCategory = document.getElementById("input-new-category").value;
  if (categorySelectedColor && newCategory) {
    addCategoryToUser(newCategory);
    clearCategoryInfoField();
    hideChooseCategoryField();
    await backend.setItem('users', JSON.stringify(users));
    exitCategoryInput();
    showTaskCategories();
  } else {
    howInfoAddCategoryName();
  }
};


/**
 * adds new category to user object
 * @param {string} newCategory 
 */
function addCategoryToUser(newCategory) {
  currentUser.category.push({
    'taskCategory': newCategory,
    'taskColor': categorySelectedColor
  });
}


/**
 * checks which priority has been assigned to a task
 * @param {number} option selected option
 */
function selectedPriority(option) {
  if (option == 1) {
    prioritySelect = "urgent";
    highlightPriorityUrgentButton();
  }
  if (option == 2) {
    prioritySelect = "medium";
    highlightPriorityMediumButton()
  }
  if (option == 3) {
    prioritySelect = "low";
    highlightPriorityLowButton()
  }
}



//############################### help functions ###############################

function noCategorySelected() {
  return taskCategoryFinaly.length == 0;
}

function noPrioritySelected() {
  return prioritySelect.length == 0;
}

function infoChooseCategory() {
  document.getElementById('chooseCategory').classList.remove('d-none');
}

function infoChoosePriority() {
  document.getElementById('chossePriority').classList.remove('d-none');
}

function resetContactSelector() {
  selectorcontactIndex = 0;
}

function showBoardPage() {
  window.location.href = './board.html';
}

function userIsOnAddTaskPage(i) {
  return i == 0;
}

function userIsOnBoardPage(i) {
  return i == 1;
}

function showInfoNoContactSelected() {
  console.log('no user selected');
}

function closeEditorSideMenu() {
  document.getElementById('AddTaskMaskBg').classList.add('d-none');
  document.getElementById('AddTaskMaskContainer').innerHTML = '';
}

function resetSubTaskSelection() {
  userSelect = [];
  selectedSubtasks = [];
}

function inputFilled(text) {
  return text.length > 0;
}

function clearSubTaskInput() {
  document.getElementById('new_subtask_text').value = ``
}

function clearSubTasks() {
  if (document.getElementById('new_subtask_text').value != null) {
    document.getElementById("new_subtask_text").value = '';
  }
}

function resetUserSelection() {
  userSelect = [];
}

function clearUserDropdown() {
  document.getElementById('selector_user_dropdown').innerHTML = '';
}

function clearSelectedContacts() {
  document.getElementById('selector_user_dropdown_contact').innerHTML = '';
}

function contactHasCheckedAttribute(contactInitials, contactcolor, contactname) {
  return document.getElementById('user_select' + contactInitials + contactcolor + contactname).classList.contains('checked');
}

function clearCategoryDropdown() {
  document.getElementById('selector_Category_Dropdown').innerHTML = '';
}

function showInfoPleaseEnterCategory() {
  document.getElementById('alert_message').innerHTML = `Please enter category first!`;
}

function categoryColorSelected() {
  return document.getElementById("input-new-category").value;
}

function hideChooseCategoryField() {
  document.getElementById('chooseCategory').classList.add('d-none');
}

function clearCategoryInfoField() {
  document.getElementById('alert_message').innerHTML = '';
}

function showInfoAddCategoryName() {
  document.getElementById("alert_message").innerHTML = `Please select a category name and then a color!`;
}

function clearTaskForm() {
  window.location.reload();
}

function highlightPriorityUrgentButton() {
  document.getElementById("priorityUrgent").classList.add('prio-urgent-selected');
  document.getElementById("priorityMedium").classList.remove('prio-medium-selected');
  document.getElementById("priorityLow").classList.remove('prio-low-selected');
  document.getElementById('priorityUrgentImg').src = 'assets/img/prio-urgent-white.png';
  document.getElementById('priorityMediumImg').src = 'assets/img/prio-medium.png';
  document.getElementById('priorityLowImg').src = 'assets/img/prio-low.png';
}

function highlightPriorityMediumButton() {
  document.getElementById("priorityMedium").classList.add('prio-medium-selected');
  document.getElementById("priorityUrgent").classList.remove('prio-urgent-selected');
  document.getElementById("priorityLow").classList.remove('prio-low-selected');
  document.getElementById('priorityUrgentImg').src = 'assets/img/prio-urgent.png';
  document.getElementById('priorityMediumImg').src = 'assets/img/prio-medium-white.png';
  document.getElementById('priorityLowImg').src = 'assets/img/prio-low.png';
}

function highlightPriorityLowButton() {
  document.getElementById("priorityLow").classList.add('prio-low-selected');
  document.getElementById("priorityUrgent").classList.remove('prio-urgent-selected');
  document.getElementById("priorityMedium").classList.remove('prio-medium-selected');
  document.getElementById('priorityUrgentImg').src = 'assets/img/prio-urgent.png';
  document.getElementById('priorityMediumImg').src = 'assets/img/prio-medium.png';
  document.getElementById('priorityLowImg').src = 'assets/img/prio-low-white.png';
}