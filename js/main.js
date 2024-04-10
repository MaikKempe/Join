setURL('https://maik-kempe.developerakademie.net/smallest_backend_ever');
let currentUserEmail = localStorage.getItem('userLoggedInEmail');
let users = [];
let currentUser;
let currentUserTasks = [];
let allTasks = [];
let logoutButtonHidden = true;


/**
 * function is called when the page is loading. Initializes main functions to run Join
 */
async function init() {
    await includeHTML();
    await downloadFromServer();
    users = await JSON.parse(backend.getItem('users')) || [];
    getCurrentUser();
}


/**
 * checks if a user is already logged in and moves him to summary.hmtl, if he is currently on sign-up.hmtl or index.html
 */
function checkLoginStatus() {
    checkRememberMeStatus();
    let loginStatus = sessionStorage.getItem('loggedIn');
    if (isLoggedIn(loginStatus) && isOnStartpage()) {
        showSummaryPage();
    } else if (isLoggedIn(loginStatus) && isOnSignupPage()) {
        showSummaryPage();
    }
}


/**
 * identifies the current user
 */
function getCurrentUser() {
    currentUser = users.find(user => user.email == currentUserEmail);
}


/**
 * checks if the user selected remeberMe and set his login Status to truee
 */
function checkRememberMeStatus() {
    let rememberMeStatus = localStorage.getItem('rememberMe');
    if (remeberMeSelected(rememberMeStatus)) {
        sessionStorage.setItem('loggedIn', 'true')
    }
}


/**
 * logout Button fade in/fade out
 */
function showLogout() {
    if (logoutButtonHidden) {
        showLogoutButton();
        logoutButtonHidden = false;
    } else {
        hideLogoutButton();
        logoutButtonHidden = true;
    }
}


/**
 * logs the user out by removing the keys in session- and localstorage
 * moves user to the index-html.
 */
function logout() {
    localStorage.removeItem('userLoggedInEmail', '');
    localStorage.removeItem('userLoggedInName', '');
    sessionStorage.removeItem('loggedIn');
    localStorage.removeItem('rememberMe');
    showStartPage();
}


/**
 * highlights selected links in navigation
 */
function highlightNavigation() {
    let links = document.getElementById('sidebar').getElementsByTagName('a');
    for (let i = 0; i < links.length; i++)
        if (navLinkSelected(links, i)) {
            highlightSelectedLink(links, i);
        }
}


/**
 * shows the user letters in page header
 */
function showUserLetters() {
    let letter = currentUser['name'].match(/\b(\w)/g).join('');
    let letters = letter.toUpperCase();
    document.getElementById('show-letters').innerHTML = letters;
}


/**
 * initializes help.html and impress.html
 */
async function initSubpages() {
    await init();
    highlightNavigation();
    showUserLetters();
}

/**
 * disables a button
 */
function disableButton(id) {
    document.getElementById(id).disabled = true;
  }

//############################### help functions ###############################

function isLoggedIn(loginStatus) {
    return loginStatus == 'true';
}

function isOnStartpage() {
    return (window.location.pathname == '/src/index.html' || window.location.pathname == '/src/');
}

function isOnSignupPage() {
    return window.location.pathname == '/sign-up.html';
}

function showStartPage() {
    return window.location.href = './index.html';
}

function showSummaryPage() {
    return window.location.href = './summary.html';
}

function remeberMeSelected(rememberMeStatus) {
    return rememberMeStatus == 'true';
}

function showLogoutButton() {
    document.getElementById('header_nav_popup').classList.add('show-logout');
}

function hideLogoutButton() {
    document.getElementById('header_nav_popup').classList.remove('show-logout');
}

function navLinkSelected(links, i) {
    return document.location.href.indexOf(links[i].href) >= 0;
}

function highlightSelectedLink(links, i) {
    return links[i].classList.add('active');
}