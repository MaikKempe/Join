let currentDraggedElement;
let alreadyEmpty = true;
let tasksFiltered = [];
let currentTask = {};
let isTouchDevice = false;
let taskStatusTitlesShort = ['toDo', 'inProgress', 'awaitingFeedback', 'done'];
let taskStatusTitles = ['To do', 'In Progress', 'Awaiting Feedback', 'Done'];


/**
 * function is called when the page is loading
 */
async function initBoard() {
    await init();
    highlightNavigation();
    checkLoginStatus();
    getUserTasks();
    filterTasks();
    showUserLetters();
    checkDevice();
}


/**
 * gets the current users tasks
 */
function getUserTasks() {
    currentUserTasks = currentUser.tasks;
}


/**
 * function is called by onkey. filters tasks by searchterm.
 */
function filterTasks() {
    let input = document.getElementById('search_input').value.toLowerCase();
    if (inputIsEmpty(input)) {
        tasksFiltered = currentUserTasks;
        sortTasks();
    } else {
        searchTasks(input);
        sortTasks();
    }
}


/**
 * sorts task by status and calls render function
 */
function sortTasks() {
    let statusTodo = tasksFiltered.filter(task => task.status == 'toDo');
    let statusInProgress = tasksFiltered.filter(task => task.status == 'inProgress');
    let statusAwaitingFeedback = tasksFiltered.filter(task => task.status == 'awaitingFeedback');
    let statusDone = tasksFiltered.filter(task => task.status == 'done');
    clearBoard();
    renderBoard(statusTodo, statusInProgress, statusAwaitingFeedback, statusDone);
}


/**
 * filters task by given searchterm
 * @param {string} input search term
 */
function searchTasks(input) {
    tasksFiltered = currentUserTasks.filter(task => {
        return task.title.toLowerCase().includes(input) || task.description.toLowerCase().includes(input);
    })
}


/**
 * clears all containers on board
 */
function clearBoard() {
    document.getElementById('toDo').innerHTML = '';
    document.getElementById('inProgress').innerHTML = '';
    document.getElementById('awaitingFeedback').innerHTML = '';
    document.getElementById('done').innerHTML = '';
}


/**
 * renders task and dragged tasks on mobile and desktop devices
 * @param {array} toDo tasks with status todo
 * @param {array} inProgress tasks with status inProgress
 * @param {array} awaitingFeedback tasks with status awaitingFeedback
 * @param {array} done tasks with status done
 */
function renderBoard(toDo, inProgress, awaitingFeedback, done) {
    renderTasks(toDo, inProgress, awaitingFeedback, done);
    renderAllMovedTasks();
    checkDevice();
}


/**
 * renders all task categorys
 * @param {array} toDo 
 * @param {array} inProgress 
 * @param {array} awaitingFeedback 
 * @param {array} done 
 */
function renderTasks(toDo, inProgress, awaitingFeedback, done) {
    renderTaskCategory(toDo);
    renderTaskCategory(inProgress);
    renderTaskCategory(awaitingFeedback);
    renderTaskCategory(done);
}


/**
 * renders a single task category    
 * @param {array} tasks array 
 */
function renderTaskCategory(tasks) {
    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        let taskStatus = task.status;
        document.getElementById(taskStatus).innerHTML += generateTodoHTML(task);
        renderTaskSubMenu(task);
    }
}

/**
 * calls different functions to render task editor
 * @param {object} task the current task
 */
function renderTaskSubMenu(task) {
    renderProgressBar(task)
    renderContactInTask(task);
    renderTouchMenu(task);
}


/**
 * renders a menu to transfer task in a other category if a touch device is used
 * @param {object} task the current Task
 */
function renderTouchMenu(task) {
    let container = document.getElementById('task-menu-' + task.id);
    for (let i = 0; i < taskStatusTitlesShort.length; i++) {
        let currentStatus = taskStatusTitlesShort[i];
        if (task.status != currentStatus) {
            container.innerHTML += touchMenuEntryHTML(task, currentStatus, i);
        }
    }
}

/**
 * renders all tasks which were moved by drag and drop
 */
function renderAllMovedTasks() {
    renderMovedTask('toDo');
    renderMovedTask('inProgress');
    renderMovedTask('awaitingFeedback');
    renderMovedTask('done');
}


/**
 * renders a task category, when a task was moved by drag and drop
 * @param {string} status toDo, done etc.
 */
function renderMovedTask(status) {
    document.getElementById(status).innerHTML += draggedElementTemplate(status);
}


/**
 * renders all contacts in the task editor menu
 * @param {*} element 
 */
function renderContactInTask(contact) {
    for (let i = 0; i < contact.user.length; i++) {
        let letter = contact.user[i]['contactInitials'];
        let color = contact.user[i]['concolor'];
        let id = contact.id;
        document.getElementById("contacts" + id).innerHTML += userLetterTemplate(color, letter);
    }
}


/**
 * renders a progressbar which displays how many subtask are finished
 * @param {object} task the current task
 */
function renderProgressBar(task) {
    let subTasks = task.subTasks;
    let subTasksDone = subTasks.filter((subTask) => {
        return subTask.done == true;
    });
    if (subTasksExist(subTasks)) {
        setStyleOnProgressBar(task.id, subTasksDone, subTasks);
    }
}



/**
 * sets style on the subtask progressbar
 * @param {number} id selected tasks id
 * @param {array} subTasksDone all subtasks which status 'done'
 * @param {array} subTasks all subTasks in the selected task
 */
function setStyleOnProgressBar(id, subTasksDone, subTasks) {
    document.getElementById('task_progress_' + id).innerHTML += progressBarTemplate(id);
    document.getElementById('fill' + id).style.width = `${subTasksDone.length / subTasks.length * 100}%`;
    document.getElementById('fill-text' + id).innerHTML = `${subTasksDone.length}/${subTasks.length} Done`;
}




/**
 * identifies a dragged task
 * @param {number} id selected tasks id
 */
function startDragging(draggedTaskId) {
    for (i = 0; i < currentUserTasks.length; i++) {
        let taskId = currentUserTasks[i]['id'];
        if (taskId == draggedTaskId) {
            currentDraggedElement = i;
        }
    }
}


/**
 * Allows the task to be dropped and sets css classes
 * @param {*} e dragevent
 */
function allowDrop(e) {
    e.preventDefault();
    let draggedTask = document.querySelectorAll('.drag-template');
    draggedTask.forEach(draggedTasks => {
        draggedTasks.classList.add('drag-template-start');
        draggedTasks.classList.remove('d-none');
    });
}


/**
 * changes the status of the task according to the dropped area
 * @param {string} status - the tasks current status
 */
async function moveTo(status) {
    currentUserTasks[currentDraggedElement]['status'] = status;
    sortTasks();
    saveChanges();
}

/**
 * save changes to the backend
 */
async function saveChanges() {
    await backend.setItem('users', JSON.stringify(users));
}


/**
 * checks if the uses a touch or desktop device, when user is wokring with the task data
 */
function checkDevice() {
    let tasks = document.querySelectorAll('.todo');
    tasks.forEach(task => {
        checkIfTouchDevice(task);
        checkIfDesktopDevice(task);
    });
}


/**
 * starts a eventlistener to check if the user uses a touch device
 * @param {object} task selected task
 */
function checkIfTouchDevice(task) {
    task.addEventListener('touchstart', (e) => {
        userTouched(e, task);
    }, false);
}


/**
 * starts a eventlistener to check if the user uses a desktop device
 * @param {*} task 
 */
function checkIfDesktopDevice(task) {
    task.addEventListener('click', (e) => {
        userClicked(e, task);
    }, false);
}


/**
 * stops touchevent and calls function to render a touch menu
 * @param {*} e touchevent 
 * @param {object} task selected object
 */
function userTouched(e, task) {
    showTaskTouchMenu(task.id);
    e.preventDefault();
}


/**
 * stops touchevent and calls function to render a touch menu
 * @param {object} e clickevent 
 * @param {object} task selected task  
 */
function userClicked(e, task) {
    showTaskDetails(task.id);
    e.preventDefault();
}


/**
 * displays touch menu and hide it after a short timespace
 * @param {number} id of the selected task
 */
function showTaskTouchMenu(id) {
    letTouchMenuPopIn(id);
    setTimeout(() => {
        letTouchMenuPopOut(id);
    }, 3000);
}


/**
 * changes the task status, when the user is using a touch device
 * @param {number} id of the selected task
 * @param {string} status of the selected task 
 */
async function moveTaskOnTouchDevice(id, status) {
    currentTask = currentUserTasks.filter((task) => {
        return task.id == id;
    });
    currentTask = currentTask[0];
    currentTask.status = status;
    saveChanges();
    filterTasks();
    checkDevice();
}


/**
 * displays information in the task editor
 * @param {number} selectedTaskId id of the selected task
 */
function showTaskDetails(selectedTaskId) {
    hideTaskContainerBg();
    for (let i = 0; i < tasksFiltered.length; i++) {
        currentTask = tasksFiltered[i];
        if (currentTask.id == selectedTaskId) {
            showTaskDetailContainer();
            showTaskDetailMenu();
            renderAssignedContacts();
            renderAssignedSubTasks(selectedTaskId);
        }
    }
}


/**
 * render all assinged conttacs in the seleted task
 */
function renderAssignedContacts() {
    let container = document.getElementById('detail_assigned_contacts');
    for (let i = 0; i < currentTask.user.length; i++) {
        let letter = currentTask.user[i]['contactInitials'];
        let color = currentTask.user[i]['concolor'];
        let contact = currentTask.user[i]['contactname'];
        container.innerHTML += assignedUserTemplate(color, letter, contact);
    }
}


/**
 * renders subtasks in the task editor
 * @param {number} id is the id of a task
 */
function renderAssignedSubTasks(id) {
    let container = document.getElementById('detail_subTasks');
    for (let i = 0; i < currentTask.subTasks.length; i++) {
        let subTask = currentTask.subTasks[i];
        container.innerHTML += renderAssignedSubTasksTemplate(subTask, i, id);
        checkIfSubTaskIsFinished(subTask, i);
    }
}


/**
 * checks if a task is done and calls function to set HTML attributes and styles
 * @param {object} subtask selected subtask
 * @param {number} i index of the selected task
 */
function checkIfSubTaskIsFinished(subtask, i) {
    if (subtask.done) {
        setAttributeChecked(i);
        setStyleTitleCrossedOut(i);
    } else {
        removeAttributeChecked(i);
        removeStyleTitleCrossedOut(i);
    }
}


/**
 * gives a subtask the status "done" and calls function to set styles and savey changes to the backend
 * @param {number} id is the id of a task
 */
async function setSubTaskDone(id) {
    currentTask = tasksFiltered.filter((currentTask) => {
        return currentTask.id == id;
    });
    markSubTaskDone(currentTask[0].subTasks);
    saveChanges();
}


/**
 * sets style on subtasks
 * @param {object} subTasks subtaks in selected task
 */
function markSubTaskDone(subTasks) {
    for (let i = 0; i < subTasks.length; i++) {
        let subTask = subTasks[i];
        let checkbox = document.getElementById('subTask_' + i);
        if (checkbox.checked) {
            subTask.done = true;
            setStyleTitleCrossedOut(i);
        } else {
            subTask.done = false;
            removeStyleTitleCrossedOut(i);
        }
    }
}


/**
 * updates the task editor
 * @param {number} id - id of selected task
 */
function editTask(id) {
    let container = document.getElementById('detail_content');
    for (let i = 0; i < tasksFiltered.length; i++) {
        currentTask = tasksFiltered[i];
        if (currentTask.id == id) {
            userSelect = currentTask.user;
            container.innerHTML = editTaskTemplate(id);
            showCurrentPriority();
            changeSubTask(id);
        }
    }
    getToday();
}


/**
 * displays the current urgency on a task template
 */
function showCurrentPriority() {
    if (currentTask.priority == "urgent") {
        prioritySelect = "urgent";
        showPriorityUrgent();
    }
    if (currentTask.priority == "medium") {
        prioritySelect = "medium";
        showPriorityMedium();
    }
    if (currentTask.priority == "low") {
        prioritySelect = "low";
        showPriorityLow()
    }
}


/**
 * changes a task urgency and displays it on the task template
 * @param {number} option - which urgency needs to be changed
 */
function changePriority(option) {
    if (option == 1) {
        prioritySelect = "urgent";
        showPriorityUrgent();
    }
    if (option == 2) {
        prioritySelect = "medium";
        showPriorityMedium();
    }
    if (option == 3) {
        prioritySelect = "low";
        showPriorityLow();
    }
}


/**
 * renders subtask in task editor
 * @param {number} id id of selected task
 */
function changeSubTask(id) {
    let container = document.getElementById('edit_subTasks')
    container.innerHTML = '';
    for (let i = 0; i < currentTask.subTasks.length; i++) {
        let subTask = currentTask.subTasks[i];
        container.innerHTML += subTaskTemplate(subTask, i, id);
        checkIfSubTaskIsFinished(subTask, i);
    }
}


/**
 * functions to add new subtasks
 * @param {number} id id of selected task
 */
function addNewSubTask(id) {
    let text = document.getElementById('new_subtask_text').value;
    clearSubTaskInput();
    currentTask = tasksFiltered.filter((currentTask) => {
        return currentTask.id == id;
    });
    currentTask = currentTask[0];
    checkSubTaskInput(text, id);
}


/**
 * checks the subttask input and calls other functions
 * @param {string} text input text
 * @param {number} id id of selected task
 */
function checkSubTaskInput(text, id) {
    if (text.length > 0) {
        createNewSubTask(text, id);
    } else {
        messageSubTaskTitleNeeded();
    }
}


/**
 * creates new subtask and pushes it into the selected task
 * @param {*} text input text
 * @param {*} id id of selected task
 */
function createNewSubTask(text, id) {
    let newSubTask = {
        'title': text,
        'done': false
    }
    currentTask.subTasks.push(newSubTask);
    clearSubTaskInput();
    editTask(id);
}


/**
 * deletes a subtask
 * @param {number} id id of selected task
 * @param {number} i index of selected subtask
 */
async function deleteSubTask(id, i) {
    let currentSubTasks = getSubTaskToDelete(id);
    currentSubTasks.splice(i, 1);
    changeSubTask(id);
    saveChanges();
}


/**
 * gets the subtask which has to be deleted
 * @param {number} id id of selected task
 * @returns array
 */
function getSubTaskToDelete(id) {
    currentTask = tasksFiltered.filter((currentTask) => {
        return currentTask.id == id;
    });
    currentTask = currentTask[0];
    return currentTask.subTasks;
}


/**
 * updates task and saves it to the backend
 * @param {number} currentTaskId id of selected task
 */
function saveChangedTask(currentTaskId) {
    selectorcontactIndex = 0;
    let title = document.getElementById('changed_title').value;
    let description = document.getElementById('changed_description').value.replace(/\n/g, "<br>\n");
    let dueDate = document.getElementById('add-date').value;
    let task = tasksFiltered.find((taskId) => taskId.id == currentTaskId);
    executeTaskChange(title, description, dueDate, task);
    clearUserSelection();
    clearSelectedPriority();
    saveChanges();
    // closeDetailTask();
    closeTaskEditor();
}

/**
 * execute taks changes after using the task editor
 * @param {string} title text of title
 * @param {string} description subtext
 * @param {string} dueDate date
 * @param {object} task selected task
 */
function executeTaskChange(title, description, dueDate, task) {
    task.user = [];
    task.user = userSelect;
    task.title = title;
    task.description = description;
    task.dueDate = dueDate;
    task.priority = prioritySelect;
}


/**
 * deletes a task
 * @param {number} currentTaskId id of selected task
 */
async function deleteTask(currentTaskId) {
    let taskToDelete = tasksFiltered.findIndex((taskId) => taskId.id == currentTaskId);
    tasksFiltered.splice(taskToDelete, 1);
    saveChanges();
    clearSelectedPriority();
    taskCategoryFinaly = [];
    // closeDetailTask();
    closeTaskEditor();
}


/**
 * Closes the Detail Window
 */
function closeDetailTask() {
    clearUserSelection();
    hideDetailWindow();
    sortTasks();
    checkDevice();
}


/**
 * closes the task editor after a short timeout
 */
function closeTaskEditor() {
    setTimeout(() => {
        document.getElementById("AddTaskMaskBg").classList.add("d-none");
        document.getElementById("detail_container").classList.add("d-none");
        document.getElementById('AddTaskMaskContact').classList.add("d-none");
        document.getElementById('AddTaskMaskContact').classList.add("d-none");
    }, 250);
    filterTasks();
    checkDevice();
}


/**
 * stops auto closing after clickevent
 * @param {*} event clickevent
 */
function doNotClose(event) {
    event.stopPropagation();
}


//############################### help functions ###############################

function inputIsEmpty(input) {
    return input.length == 0;
}

function subTasksExist(subTasks) {
    return subTasks.length > 0;
}

function letTouchMenuPopIn(id) {
    document.getElementById(`task-menu-${id}`).classList.remove('d-none');
}

function letTouchMenuPopOut(id) {
    document.getElementById(`task-menu-${id}`).classList.add('d-none');
}

function hideTaskContainerBg() {
    document.getElementById('AddTaskMaskContainer').classList.add('d-none');
}

function showTaskDetailContainer() {
    document.getElementById('AddTaskMaskBg').classList.remove('d-none');
}

function showTaskDetailMenu() {
    document.getElementById('detail_content').classList.remove('d-none');
    document.getElementById('detail_content').innerHTML = detailContentTemplate();
}

function setAttributeChecked(i) {
    document.getElementById('subTask_' + i).setAttribute('checked', true);
}

function removeAttributeChecked(i) {
    document.getElementById('subTask_' + i).removeAttribute('checked', true);
}

function setStyleTitleCrossedOut(i) {
    document.getElementById('subTask_title_' + i).classList.add('crossed-out');
}

function removeStyleTitleCrossedOut(i) {
    document.getElementById('subTask_title_' + i).classList.remove('crossed-out');
}

function showPriorityUrgent() {
    document.getElementById("editPriorityUrgent").classList.add('prio-urgent-selected');
    document.getElementById("editPriorityMedium").classList.remove('prio-medium-selected');
    document.getElementById("editPriorityLow").classList.remove('prio-low-selected');
    document.getElementById('editPriorityUrgentImg').src = 'assets/img/prio-urgent-white.png';
    document.getElementById('editPriorityMediumImg').src = 'assets/img/prio-medium.png';
    document.getElementById('editPriorityLowImg').src = 'assets/img/prio-low.png';
}

function showPriorityMedium() {
    document.getElementById("editPriorityMedium").classList.add('prio-medium-selected');
    document.getElementById("editPriorityUrgent").classList.remove('prio-urgent-selected');
    document.getElementById("editPriorityLow").classList.remove('prio-low-selected');
    document.getElementById('editPriorityUrgentImg').src = 'assets/img/prio-urgent.png';
    document.getElementById('editPriorityMediumImg').src = 'assets/img/prio-medium-white.png';
    document.getElementById('editPriorityLowImg').src = 'assets/img/prio-low.png';
}

function showPriorityLow() {
    document.getElementById("editPriorityLow").classList.add('prio-low-selected');
    document.getElementById("editPriorityUrgent").classList.remove('prio-urgent-selected');
    document.getElementById("editPriorityMedium").classList.remove('prio-medium-selected');
    document.getElementById('editPriorityUrgentImg').src = 'assets/img/prio-urgent.png';
    document.getElementById('editPriorityMediumImg').src = 'assets/img/prio-medium.png';
    document.getElementById('editPriorityLowImg').src = 'assets/img/prio-low-white.png';
}

function clearSubTaskInput() {
    document.getElementById('new_subtask_text').value = '';
}

function messageSubTaskTitleNeeded() {
    document.getElementById('empty_subtask_text').innerHTML = 'Please enter a title for the subtask';
}

function hideDetailWindow() {
    document.getElementById('detail_content').innerHTML = '';
    document.getElementById('detail_container').classList.add('d-none');
}

function clearUserSelection() {
    userSelect = [];
}

function clearSelectedPriority() {
    prioritySelect = [];
}


