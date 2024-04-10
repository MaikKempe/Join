/**
 * function is called when the page is loading
 */
async function initSignUp() {
    await init();
    checkLoginStatus();
    listenForPwIconChange();
}


/**
 * gets values from input fields and calls other functions to start registration
 */
function registerUser() {
    let enteredName = document.getElementById('user_name').value;
    let enteredEmail = document.getElementById('user_email').value;
    hideNameAlreadyExistInfo();
    hideEmailAlreadyExistInfo();
    checkUserData(enteredName, enteredEmail);
}


/**
 * Gets the user's index, if the entered name and email exists in the user data
 * @param {string} enteredName Firstname Lastname
 * @param {string} enteredEmail example@gmail.com
 */
function checkUserData(enteredName, enteredEmail) {
    let indexName = users.findIndex(user => user.name.toLowerCase() == enteredName.toLowerCase());
    let indexEmail = users.findIndex(user => user.email.toLowerCase() == enteredEmail.toLowerCase());
    checkIfUserExist(indexName, indexEmail);
}


/**
 * Checks if a user exists by comparing the email- and nameindex.
 * Initializes registration or displays an error message.
 * @param {number} indexName -1 or 0, 1, 2 etc.
 * @param {number} indexEmail -1 or 0, 1, 2 etc.
 */
function checkIfUserExist(indexName, indexEmail) {
    let name = document.getElementById('user_name').value;
    let email = document.getElementById('user_email').value;
    let pw = document.getElementById('user_password').value;
    checkIfNameExist(indexName);
    checkIfEmailExist(indexEmail);
    if (dataIsAvailable(indexName, indexEmail)) {
        addUser(name, email, pw);
    }
}


/**
 * Checks if the name-index can be assigned to a user
 * @param {number} index -1 or 0, 1, 2 etc.
 */
function checkIfNameExist(index) {
    if (dataAlreadyExists(index)) {
        showNameAlreadyExistInfo();
    }
}


/**
 * Checks whether the email-index can be assigned to a user
 * @param {number} index -1 or 0, 1, 2 etc.
 */
function checkIfEmailExist(index) {
    if (dataAlreadyExists(index)) {
        showEmailAlreadyExistInfo();
    }
}


/**
 * registers the user by saving the given data into the system
 * @param {string} name Firstname Lastname
 * @param {string} email example@gmail.com
 * @param {string} pw password
 */
function addUser(name, email, pw) {
    createUserData(name, email, pw);
    backend.setItem('users', JSON.stringify(users));
    sessionStorage.setItem('loggedIn', 'false');
    localStorage.setItem('rememberMe', 'false');
    registrationIsCompleteInfo();
}


/**
 * creates user object and pushes it into users array
 * @param {string} name Firstname Lastname
 * @param {string} email example@gmail.com
 * @param {string} pw password
 */
function createUserData(name, email, pw) {
    users.push({
        'name': name,
        'email': email,
        'password': pw,
        'tasks': [],
        'contacts': [],
        'lettertask': [],
        'category':
            [{ taskCategory: 'Sales', taskColor: 'purpleCategory' },
            { taskCategory: 'Backoffice', taskColor: 'blueCategory' }]
    });
}


//############################### help functions ###############################

function registrationIsCompleteInfo() {
    document.getElementById('sign_up').innerHTML = registrationCompleteTemplate();
}

function hideNameAlreadyExistInfo() {
    document.getElementById('name_assign').classList.add('display-none');
}

function showNameAlreadyExistInfo() {
    document.getElementById('name_assign').classList.remove('display-none');
}

function hideEmailAlreadyExistInfo() {
    document.getElementById('email_assign').classList.add('display-none');
}

function showEmailAlreadyExistInfo() {
    document.getElementById('email_assign').classList.remove('display-none');
}

function dataAlreadyExists(index) {
    return index != -1;
}

function dataIsAvailable(index1, index2) {
    return index1 == -1 && index2 == -1;
}