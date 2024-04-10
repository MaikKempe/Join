/**
 * function is called when the page is loading
 */
async function initResetPw() {
    await init();
    listenForPwIconChange();
    listenForConfirmIconChange();
}

/**
 * Checks if a reset-password request has expired
 */
async function resetPw() {
    let url = new URL(window.location.href);
    let userEmail = url.searchParams.get('email');
    let timestamp = url.searchParams.get('timestamp') / 60;
    let timePassed = Date.now() / 1000 / 60;
    let timeout = timePassed - timestamp;
    if (timeLimitNotExceeded(timeout)) {
        await executeReset(userEmail);
    } else {
        clearPwContainer();
    }
}

/**
 * identiies the user who requested a password reset by checking his email
 * @param {string} usersEmail
 */
async function executeReset(usersEmail) {
    let userIdentified = users.find(user => user.email == usersEmail);
    if (userIdentified) {
        await saveNewPw(userIdentified);
    } else {
        infoEmailNotRegistered();
    }
}


/**
 * performs a password validation and saves the new password to the server
 */
async function saveNewPw(user) {
    let newPw = document.getElementById('user_password').value;
    let pwConfirm = document.getElementById('new_password_confirm').value;
    if (newPw === pwConfirm) {
        user.password = pwConfirm;
        infoResetWasSuccessful();
        await backend.setItem('users', JSON.stringify(users));
    } else {
        infoPWsDoNotMatch();
    }
}

//############################### help functions ###############################

function clearPwContainer() {
    document.getElementById('reset_password_container').innerHTML = passwordTimeoutTemplate();
}

function timeLimitNotExceeded(timeout) {
    return timeout < 1440;
}

function infoResetWasSuccessful() {
    document.getElementById('reset_password_container').innerHTML = passwordResetedTemplate();
}

function infoEmailNotRegistered() {
    document.getElementById('email_check').classList.remove('display-none');
}

function infoPWsDoNotMatch() {
    document.getElementById('password_check').classList.remove('display-none');
}