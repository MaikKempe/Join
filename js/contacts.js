let savecontactforaddtask;
let contactsInitials;

/**
 * function is called when the page is loading
 */
async function initContacts() {
    await init();
    highlightNavigation();
    checkLoginStatus();
    renderAllContacts()
    getUserTasks();
    showUserLetters();
}


/**
 * calls functions to render the contactsbook and contacts
 */
function renderAllContacts() {
    createContactBook();
    renderLettersInContactBook();
}


/**
 * calls function to open menu for adding oder inviting a contact.
 */
function openAddContact(option) {
    if (option == 1) {
        showAddContactMenu(option);
    } else if (option == 0) {
        showInviteContactMenu(option);
    }
}


/**
 * renders menu to add a contact
 * @param {number} option selected option
 */
function showAddContactMenu(option) {
    document.getElementById('AddTaskMaskContact').classList.remove('d-none');
    document.getElementById('detail_content').classList.add('d-none');
    document.getElementById('AddTaskMaskContact').innerHTML = '';
    document.getElementById('AddTaskMaskContact').innerHTML = addNewContactHtml(option);
}


/**
 * renders menu to invite a contact
 * @param {number} option selected option
 */
function showInviteContactMenu(option) {
    document.getElementById('opencontact').classList.remove('d-none');
    document.getElementById('opencontact').innerHTML = '';
    document.getElementById('opencontact').innerHTML = addNewContactHtml(option);
}


/**
 * calls functions to close menus for adding oder inviting a contact
 * @param {number} option selected option
 */
function closeAddContact(option) {
    if (option == 0) {
        hideInviteContactMenu();
    } else if (option == 1) {
        hideAddContactMenu();
    }
}


/**
 *  gets values from HTML form and calls function to create and push contact object in to the current users data set
 * @param {number} option selected option 
 */
function createContact(option) {
    let nameInput = document.getElementById('contactName').value;
    let email = document.getElementById('contactEmail').value;
    let phone = document.getElementById('contactNumber').value;
    let name = nameInput.charAt(0).toUpperCase() + nameInput.slice(1);
    let letters = name.charAt(0);
    let randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    let initials = name.match(/\b(\w)/g).join('').toUpperCase();
    let contactTask = createContactObject(name, email, phone, letters, randomColor, initials);
    let userIndex = checkContactEmail(contactTask);
    disableButton('create_contact_btn');
    checkContact(userIndex, name, contactTask, option);
}

/**
 * creates contact object and returns it
 * @param {*} name 
 * @param {*} email 
 * @param {*} phone 
 * @param {*} letters 
 * @param {*} randomColor 
 * @param {*} initials 
 * @returns JSON object
 */
function createContactObject(name, email, phone, letters, randomColor, initials) {
    contactTask = {
        'contactName': name,
        'contactEmail': email,
        'contactNumber': phone,
        'contactletter': letters,
        'contactcolor': randomColor,
        'contactInitials': initials
    };
    return contactTask;
}


/**
 * checks if a user is registered. Calls function to add new user and creates or updates userlettes in contactbook
 * @param {number} userIndex 
 * @param {string} contactName 
 * @param {object} contactTask the contacts task object
 * @param {number} option selected option
 */
function checkContact(userIndex, contactName, contactTask, option) {
    if (userNotRegistered(userIndex)) {
        addNewContact(contactTask);
        if (option == 0) {
            fillAllTasks(contactName, option);
        }
        if (option == 1) {
            createLetterInContact(contactName, option);
        }
    } else {
        infoEmailExists();
    }
}


/**
 * gets first letter from contact name and calls function to 
 * @param {string} contactName
 * @param {number} option selected option
 */
function createLetterInContact(contactName, option) {
    let letter = contactName.charAt(0);
    if (currentUser.lettertask.includes(letter)) {
        // updateContactBar(option);
    } else {
        saveLetterInContact(letter);
    }
    closeAddContact(option);
    selectorcontactIndex = 0;
    showUsers(option);
}


/**
 * pushes new contact into the current users data and saves it in backend
 * @param {string} contactTask the contacts task object
 */
async function addNewContact(contactTask) {
    currentUser.contacts.push(contactTask);
    currentUser.contacts.sort((a, b) => a.contactName.localeCompare(b.contactName));
    await backend.setItem('users', JSON.stringify(users));
}


/**
 * checks if a contact is already assinged to a task and customizes the user index
 * @param {string} contactTask the contacts task object
 * @returns number
 */
function checkContactEmail(contactTask) {
    let email = contactTask['contactEmail'];
    let userindex = -1;
    for (i = 0; i < currentUser.contacts.length; i++) {
        if (emailFound(email)) {
            userindex = i;
        }
    }
    return userindex;
}


/**
 * checks which users exists and updates letters ins contactbook
 * @param {string} contactName name of the contact
 */
function fillAllTasks(contactName, option) {
    let letter = contactName.charAt(0);
    closeAddContact(option);
    fadeInInfoContactChangesSaved();
    if (currentUser.lettertask.includes(letter)) {
        updateContactBar(option);
    } else {
        resetContactBook();
        saveLetterInContact(letter);
        createContactBook();
        renderLettersInContactBook();
    }
}


/**
 * push letter in currentuser
 * @param {string} letter first letter of the name
 */
async function saveLetterInContact(letter) {
    currentUser.lettertask.push(letter);
    currentUser.lettertask.sort();
    await backend.setItem('users', JSON.stringify(users));

}

/**
 * displays the information for a short time that changes have been made to a contact
 */
function fadeInInfoContactChangesSaved() {
    document.getElementById('popup-ContactBar').classList.remove('d-none');
    setTimeout(() => {
        document.getElementById('popup-ContactBar').classList.add('d-none');
    }, 1100);
}


/**
 * clears, upates and renders the contact book
 * @param {number} option selected option 
 */
function updateContactBar(option) {
    if (option == 0) {
        for (let i = 0; i < currentUser.lettertask.length; i++) {
            let letter = currentUser.lettertask[i];
            let letterHTML = document.getElementById(letter)
            while (letterHTML.lastChild) {
                letterHTML.removeChild(letterHTML.lastChild);
            }
        }
        renderLettersInContactBook();
    }
}


/**
 * displays letters of the users contacts
 */
function renderLettersInContactBook() {
    for (let index = 0; index < currentUser.contacts.length; index++) {
        let i = currentUser.contacts[index];
        let lettersFB = currentUser.contacts[index]['contactInitials'];
        let letter = currentUser.contacts[index]['contactletter'];
        let contactchildsid = document.getElementById(letter);
        contactchildsid.innerHTML += contactChildHtml(i, lettersFB, index);
    }
}


/**
 * displays the whole contactbook
 */
function createContactBook() {
    let contactBook = document.getElementById('contactbar');
    contactBook.innerHTML = '';
    for (let i = 0; i < currentUser.lettertask.length; i++) {
        let letter = currentUser.lettertask[i];
        contactBook.innerHTML += contactBarHtml(letter);
    }
}


/**
 * renders the contacts detail overlay
 * @param {number} i index
 * @param {string} letters the contact intial letter
 */
function openDetailContact(i, letters) {
    changeColorInContact(i);
    let contact = currentUser.contacts[i];
    let mediaQuery = window.matchMedia('(max-width: 1120px)')
    if (mediaQuery.matches) {
        hideDesktopContactBook();
        showResponsiveContactBook();
    }
    clearContactDetails();
    renderContactDetails(contact, letters, i);
}


/**
 * changes the contacts signature color when clicking
 * @param {number} i index
 */
function changeColorInContact(i) {
    for (let i = 0; i < currentUser.contacts.length; i++) {
        document.getElementById(i).classList.remove('contact-child-div-klick')
    }
    document.getElementById(i).classList.add('contact-child-div-klick');
}


/**
 * calls functions the open the contact editor
 * @param {number} i index
 * @param {string} letters the contact intial letter
 */
function editContact(i, letters) {
    let contact = currentUser.contacts[i];
    showContactEditor();
    clearContactEditor();
    renderContactToEdit(contact, letters, i);
}


/**
 * renders interface to edit a contact
 * @param {object} contact the contact object
 * @param {string} letters the contact intial letter
 * @param {number} i index
 */
function renderContactToEdit(contact, letters, i) {
    document.getElementById('opencontact').innerHTML = editContactHtml(contact, letters, i);
    document.getElementById('contactEditName').value = contact['contactName'];
    document.getElementById('contactEditEmail').value = contact['contactEmail'];
    document.getElementById('contactEditNumber').value = contact['contactNumber'];
}


/**
 * function is called when users wants to invite or edit a invited user
 * gets values from HTML form and calls function to create and push contact object in to the current users data set.
 * @param {string} formerEmail a contacts former email, if the user wants to change it
 * @param {number} i index
 * @param {string} letters the contact intial letter
 */
function inviteContact(formerEmail, i, letters) {
    let nameInput = document.getElementById('contactEditName').value;
    let email = document.getElementById('contactEditEmail').value;
    let phone = document.getElementById('contactEditNumber').value;
    let name = nameInput.charAt(0).toUpperCase() + nameInput.slice(1);
    let initials = name.match(/\b(\w)/g).join('');
    let firstName = name.charAt(0);
    let contactTask = changeContactObject(name, initials, email, phone, firstName, formerEmail);
    letters = initials;
    updateUser(contactTask, i, letters);
    hideAddContacts();
    renderAllContacts();
    changeColorInContact(i);
}


/**
 * creates a contact object and returns it
 * @param {*} name 
 * @param {*} initials 
 * @param {*} email 
 * @param {*} phone 
 * @param {*} firstName 
 * @param {*} formerEmail 
 * @returns JSON Object
 */
function changeContactObject(name, initials, email, phone, firstName, formerEmail) {
    contactTask = {
        'contactName': name,
        'contactInitials': initials,
        'contactEmail': email,
        'contactNumber': phone,
        'contactletter': firstName,
        'oldEmail': formerEmail
    };
    return contactTask;
}


/**
 * updates the users contacts
 * @param {object} contact contact object
 * @param {number} id 
 * @param {string} letters the users contact initial letters
 */
async function updateUser(contact, id, letters) {
    let formerEmail = contact['oldEmail'];
    let index = getUserIndexForEmail(formerEmail);
    updateContact(contact, index);
    await saveContactChanges();
    closeAddContact();
    openDetailContact(id, letters);
}


/**
 * updates a users contact data
 * @param {object} contact contact object
 * @param {number} i index
 */
function updateContact(contact, i) {
    currentUser.contacts[i]['contactName'] = contact['contactName'];
    currentUser.contacts[i]['contactletter'] = contact['contactletter'];
    currentUser.contacts[i]['contactEmail'] = contact['contactEmail'];
    currentUser.contacts[i]['contactNumber'] = contact['contactNumber'];
    currentUser.contacts[i]['contactInitials'] = contact['contactInitials'];
    buildNewLettertask();
}

/**
 * gets a contact inital letters and returs it
 */
function buildNewLettertask() {
    contactsInitials = currentUser.contacts.map((contactsFirstLetters) => {
        return contactsFirstLetters.contactletter;
    });
    getNewLettertask();
}


/**
 * changes a contact inital letters and saves it 
 */
async function getNewLettertask() {
    let newLettertask = [...new Set(contactsInitials)];
    currentUser.lettertask = newLettertask;
    await backend.setItem('users', JSON.stringify(users));
}


/**
 * save changes in backend
 */
async function saveContactChanges() {
    await backend.setItem('users', JSON.stringify(users));
}


/**
 * function to close contact details, when user is using a smartphone or tablet
 * @param {number} i index
 */
function closeMediaContact(i) {
    clearContactDetails();
    document.getElementById(i).classList.remove('contact-child-div-klick');
    hideMediaMenu();
}

/**
 * function to find a contacts email
 * @param {string} email a contacts email
 * @returns number
 */
function getUserIndexForEmail(email) {
    let userindex = -1;
    for (i = 0; i < currentUser.contacts.length; i++) {
        if (contactEmailFound(i, email)) {
            userindex = i;
        }
    }
    return userindex;
}


/**
 * opens the add Task Editor
 * @param {number} i index of task, where the contact is assigned
 * @param {number} contactIndex index of contact
 */
function OpenContactAddTask(i, contactIndex) {
    savecontactforaddtask = contactIndex;
    document.getElementById('openContactAddtaskBG').classList.remove('d-none');
    document.getElementById('openContactAddtask').innerHTML = openAddTaskHtml(i, 'toDo');
    getToday();
}


/**
 * function to delete a contact
 * @param {number} i position in the array
 */
function deleteContacts(i) {
    closeAddContact(0);
    hideMediaMenu();
    let letter = currentUser.contacts[i]['contactletter'];
    currentUser.contacts.splice(i, 1);
    deleteContactLetters(letter);

}

/**
 * function to delete a contact inital letter
 * @param {string} letter
 */
function deleteContactLetters(letter) {
    let indexofletter = deleteContactletter(letter);
    if (indexofletter == -1) {
        for (let j = 0; j < currentUser.lettertask.length; j++) {
            let element = currentUser.lettertask[j];
            if (element == letter) {
                currentUser.lettertask.splice(j, 1);
                document.getElementById(letter).remove();
            }
        }
    }
    updateContacts();
}


/**
 * updates users contact data and the contact book
 */
function updateContacts() {
    resetContactBook();
    clearContactDetails();
    createContactBook();
    renderLettersInContactBook();
    saveContactChanges();
}


/**
 * function to delete a contacts initial letter in the contact book by getting the index
 * @param {string} letter a contacts inital letter
 * @returns number
 */
function deleteContactletter(letter) {
    let userindex = -1;
    for (i = 0; i < currentUser.contacts.length; i++) {
        let lettersFB = currentUser.contacts[i]['contactName'].charAt(0);
        if (lettersFB == letter) {
            userindex = i;
        }
    }
    return userindex;
}


//############################### help functions ###############################

function hideInviteContactMenu() {
    document.getElementById('opencontact').classList.add('d-none');
    document.getElementById('opencontact').innerHTML = '';
}

function hideAddContactMenu() {
    document.getElementById('AddTaskMaskContact').classList.add('d-none');
    document.getElementById('detail_content').classList.remove('d-none');
    document.getElementById('AddTaskMaskContact').innerHTML = '';
}

function hideAddContacts() {
    document.getElementById('opencontact').classList.add("d-none");
}

function userNotRegistered(userIndex) {
    return userIndex == -1;
}

function emailFound(email) {
    return currentUser.contacts[i]['contactEmail'].toLowerCase() == email.toLowerCase();
}

function infoEmailExists() {
    let container = document.getElementById('emailDone');
    container.classList.remove('d-none');
}

function resetContactBook() {
    document.getElementById('contactbar').innerHTML = '';
}

function hideDesktopContactBook() {
    document.getElementById('contactbar').classList.add('display-contact-none');
}

function showResponsiveContactBook() {
    document.getElementById('contact-detail-in-main').classList.remove('display-contact-none');
}

function clearContactDetails() {
    document.getElementById('contact-detail-in-main').innerHTML = '';
    document.getElementById('contactdetails').innerHTML = '';
}

function renderContactDetails(contact, letters, i) {
    document.getElementById('contact-detail-in-main').innerHTML = contactDetailHtml(contact, letters, i);
    document.getElementById('contactdetails').innerHTML = contactDetailHtml(contact, letters, i);
}

function showContactEditor() {
    document.getElementById('opencontact').classList.remove('d-none');
}

function clearContactEditor() {
    document.getElementById('opencontact').innerHTML = '';
}

function clearContactEditorContainer() {
    document.getElementById('opencontact').innerHTML = '';
}

function clearContactDetails() {
    document.getElementById('contactdetails').innerHTML = '';
}

function contactEmailFound(i, email) {
    return currentUser.contacts[i]['contactEmail'].toLowerCase() == email.toLowerCase();
}

function hideMediaMenu() {
    document.getElementById('contact-detail-in-main').classList.add('display-contact-none');
    document.getElementById('contactbar').classList.remove('display-contact-none');
}