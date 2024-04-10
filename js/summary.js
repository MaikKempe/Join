/**
 * function is called when the page is loading
 */
async function initSummary() {
    checkLoginStatus();
    await init();
    highlightNavigation();
    showDashboard();
    showUserLetters();
}

/**
 * calls functions to display dashbord
 */
function showDashboard() {
    showCurrentUserName();
    greetingAfterLogin();
    getUsersDeadlines();
    showDashboardNumbers();
}

/**
 * displays all task categorys numbers in the dashboard
 */
function showDashboardNumbers() {
    showAllTasks();
    showTaskNumbers('number_of_tasks_urgent', 'priority', 'urgent');
    showTaskNumbers('number_of_tasks_todo', 'status', 'toDo');
    showTaskNumbers('number_of_tasks_in_progress', 'status', 'inProgress');
    showTaskNumbers('number_of_tasks_awaiting_feedback', 'status', 'awaitingFeedback');
    showTaskNumbers('number_of_tasks_done', 'status', 'done');
}


/**
 * displays username in the dashbord
 */
function showCurrentUserName() {
    document.getElementById('current_user_name').innerHTML = currentUser.name;
}


/**
 * displays a user greeting after login
 */
function greetingAfterLogin() {
    let greeting = document.getElementById('user_greeting');
    let hour = new Date().getHours();
    if (isMorning(hour)) {
        greeting.innerHTML = 'Good morning,';
    } else if (isAfternoon(hour)) {
        greeting.innerHTML = 'Good afternoon,';
    } else {
        greeting.innerHTML = 'Good evening,';
    }
}


/**
 * gets a users task-deadlines
 */
function getUsersDeadlines() {
    let tasksNotDone = currentUser.tasks.filter((tasksStatus) => {
        return tasksStatus.status != 'done';
    });
    let dueDates = tasksNotDone.map((dueDates) => {
        return dueDates.dueDate;
    });
    dates = dueDates.sort();
    showNextDeadline(dates);
}


/**
 * displays the next due date
 * @param {array} dates all due dates
 */
function showNextDeadline(dates) {
    let container = document.getElementById('upcoming_deadline');
    if (deadlineUpcoming(dates)) {
        let nextDeadline = getNextDueDate(dates);
        container.innerHTML = nextDeadline;
    } else {
        container.innerHTML = 'No upcoming deadline';
    }
}


/**
 * gets the users next due date
 * * @param {array} dates all due dates
 */
function getNextDueDate(dates) {
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let dueDate = new Date(dates[0]);
    let month = months[dueDate.getMonth()];
    let nextDueDate = month + ' ' + dueDate.getDate() + ', ' + dueDate.getFullYear();
    return nextDueDate;
}


/**
 * displays number of all tasks
 */
function showAllTasks() {
    let numberOfTasksContainer = document.getElementById('number_of_tasks');
    let numberOfTasks = currentUser.tasks.length;
    numberOfTasksContainer.innerHTML = numberOfTasks;
}


/**
 * displays number of a task category
 * @param {string} elementID HTML element Id
 * @param {string} path path in Users object
 * @param {string} category urgent, awaiting Feedback, etc.
 */
function showTaskNumbers(elementID, path, category) {
    let container = document.getElementById(elementID);
    let tasks = currentUser.tasks.filter(t => t[path] == category);
    container.innerHTML = tasks.length;
}


//############################### help functions ###############################

function isMorning(hour) {
    return hour < 12;
}

function isAfternoon(hour) {
    return hour < 18;
}

function deadlineUpcoming(dates) {
    return dates.length > 0 && dates[0] != '';
}