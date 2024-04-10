/**
 * function is called when the page is loading.
 */
async function initLogin() {
    await init();
    checkLoginStatus();
    listenForPwIconChange();
}


/**
 * get userdata from HTML-input and starts loginsession
 */
function userLogin() {
    let enteredMail = document.getElementById('user_email').value;
    let enteredPw = document.getElementById('user_password').value;
    checkLoginData(enteredMail, enteredPw);
}


/**
 * Checks if a user exists by comparing the email- and nameindex.
 * Initializes login or displays an error message.
 * @param {string} enteredMail example@gmail.com
 * @param {string} enteredPw
 */
function checkLoginData(enteredMail, enteredPw) {
    let indexEmail = users.findIndex(user => user.email == enteredMail);
    let indexPw = users.findIndex(user => user.password == enteredPw);
    if (dataIsDoesNotExist(indexEmail, indexPw)) {
        infoDataDoesNotExist();
    } else {
        userLogIn(indexEmail);
    }
}


/**
 * User gets logged in and directed to summary page. Checks if rememberMe is selected and saves the status
 * @param {string} indexEmail -1 oder 0, 1, 2 etc.
 */
function userLogIn(indexEmail) {
    let rememberMeSelected = document.getElementById('remember_me');
    if (rememberMeSelected.checked) {
        saveRemeberMeStatus();
    }
    saveLoginStatus(indexEmail);
    showSummaryPage();
}


/**
 * saves the user's login status to the local- and sessionsstorage
 * @param {string} indexEmail -1 oder 0, 1, 2 etc.
 */
function saveLoginStatus(indexEmail) {
    localStorage.setItem('userLoggedInName', users[indexEmail].name);
    localStorage.setItem('userLoggedInEmail', users[indexEmail].email);
    sessionStorage.setItem('loggedIn', 'true');
}


/**
 * Executes a guest login that non-registered users can use the software
 */
function guestLogin() {
    avoidFormValidation();
    clearInfoFields();
    checkLoginData('heinemann@aol.de', '1234');
}


/**
 * checks if the passwords inputs are filled by using an eventlistener and changes the input icons.
 */
function listenForPwIconChange() {
    let input = document.getElementById('user_password');
    input.addEventListener('input', () => {
        if (inputFilled(input)) {
            hideRegularPwIcon();
            showPwHiddenIcon();
        } else {
            showRegularPwIcon();
            hidePwHiddenIcon();
        }
    })
}


/**
 * checks if the confirm inputs are filled by using an eventlistener and changes the input icons.
 */
function listenForConfirmIconChange() {
    let input = document.getElementById('new_password_confirm');
    input.addEventListener('input', () => {
        if (inputFilled(input)) {
            hideRegularConfirmIcon();
            showConfirmIconHidden();
        } else {
            showRegularConfirmIcon();
            hideConfirmIconHidden();
        }
    })
}


/**
 * sets visibility on password by changing the HTML-element type to 'text'
 */
function pwVisibilitiyON() {
    hidePwHiddenIcon();
    showPwVisibleIcon();
    setInputTypeText('user_password');
}


/**
 * hides password by changing the HTML-element type to 'password'
 */
function pwVisibilitiyOFF() {
    hidePwUnvisibleIcon();
    showPwHiddenIcon();
    setInputTypePw('user_password');
}


/**
 * sets visibility on confirm-password by changing the HTML-element type to 'text'
 */
function confirmFieldVisibilitiyON() {
    hideConfirmIconHidden();
    showConfirmIconVisible();
    setInputTypeText('new_password_confirm');
}


/**
 * hides confirm-password by changing the HTML-element type to 'password'
 */
function confirmFieldVisibilitiyOFF() {
    hideConfirmIconVisible();
    showConfirmIconHidden();
    setInputTypePw('new_password_confirm');
}


//############################### help functions ###############################

function dataIsDoesNotExist(index1, index2) {
    return index1 == -1 || index2 == -1;
}

function infoDataDoesNotExist() {
    document.getElementById('data_check').classList.remove('display-none');
}

function clearInfoFields() {
    document.getElementById('data_check').innerHTML = '';
}

function avoidFormValidation() {
    document.getElementById('login_form').setAttribute('novalidate', 'true');
}

function saveRemeberMeStatus() {
    localStorage.setItem('rememberMe', 'true');
}

function hideRegularConfirmIcon() {
    document.getElementById('user_password_confirm_icon').classList.add('display-none');
}

function showRegularConfirmIcon() {
    document.getElementById('user_password_confirm_icon').classList.remove('display-none');
}

function showConfirmIconHidden() {
    document.getElementById('user_password_confirm_hidden').classList.remove('display-none');
}

function hideConfirmIconHidden() {
    document.getElementById('user_password_confirm_hidden').classList.add('display-none');
}

function showConfirmIconVisible() {
    document.getElementById('user_password_confirm_visible').classList.remove('display-none');
}

function hideConfirmIconVisible() {
    document.getElementById('user_password_confirm_visible').classList.add('display-none');
}

function showPwHiddenIcon() {
    document.getElementById('user_password_hidden').classList.remove('display-none');
}

function hidePwHiddenIcon() {
    document.getElementById('user_password_hidden').classList.add('display-none');
}

function showPwVisibleIcon() {
    document.getElementById('user_password_visible').classList.remove('display-none');
}

function hidePwUnvisibleIcon() {
    document.getElementById('user_password_visible').classList.add('display-none');
}

function hideRegularPwIcon() {
    document.getElementById('user_password_icon').classList.add('display-none');
}

function showRegularPwIcon() {
    document.getElementById('user_password_icon').classList.remove('display-none');
}

function inputFilled(input) {
    return input.value.length > 0;
}

function setInputTypeText(id) {
    document.getElementById(id).type = 'text';
}

function setInputTypePw(id) {
    document.getElementById(id).type = 'password';
}
