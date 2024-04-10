/**
 * contact detail card template
 * @param {object} contact contact object
 * @param {string} letters the contact initials
 * @param {number} index index of contact
 * @returns HTML
 */
function contactDetailHtml(contact, letters, index) {
    return /*html*/`
        <div class="contact-detail-main-side animationFadeInRight" id="${index}">
            <div class="back-in-media-contact">
                <img onclick="closeMediaContact(${index})" src="./assets/img/arrow-back.png" alt="">
            </div>
            <div class="contact-detail-head">
                <div style="background-color: ${contact['contactcolor']}" class="contact-detail-big-letter">${letters}</div>
                <div class="contact-detail-name-task">
                    <p class="contact-detail-big-name">${contact['contactName']}</p>
                    <p class="contact-detail-add-task" onclick="OpenContactAddTask('0', ${index})"><img src="./assets/img/blue-plus.png" alt="">Add Task</p>
                </div>
            </div>
            <div class="contact-detail-info-main">
                <p class="contact-detail-info">Contact Information</p>
                <p class="contact-detail-edit" onclick="editContact('${index}', '${letters}')"><img class="icon-edit-contact" src="./assets/img/icon_edit_contact.png" alt=""> Edit Contact</p>
            </div>
            <div>
                <div>
                    <p class="contact-detail-email-number">Email</p>
                    <a href="mailto:${contact['contactEmail']}"><span>${contact['contactEmail']}</span></a>
                </div>
                <div>
                    <p class="contact-detail-email-number">Mobile</p>
                    <p>${contact['contactNumber']}</p>
                </div>
            </div>
            
        </div>`
}


/**
 * Contact preview template
 * @param {object} contact contact object
 * @param {string} letters the contact initials
 * @param {number} index index of contact
 * @returns HTML
 */
function contactChildHtml(contact, letters, index) {
    return /*html*/`
    <div class="contact-child-div" onclick="openDetailContact('${index}', '${letters}' )" id="${index}">
        <div style="background-color: ${contact['contactcolor']}" class="contact-child">
            <p>${letters}</p>
        </div>
        <div>
            <p class="contact-child-name">${contact['contactName']}</p>
            <p class="contact-child-email">${contact['contactEmail']}</p>
        </div>
    </div>
    `
}


/**
 * Conctact book element template
 * @param {string} letter the contact initials
 * @returns HTML
 */
function contactBarHtml(letter) {
    return /*html*/`
    <div class="contact-letter-main" >
        <h4  class="contact-letter">${letter}</h4>
        <div id="${letter}"></div>
    </div>
    `
}


/**
 * add contact mask template
 * @param {number} option selected option
 * @returns HTML
 */
function addNewContactHtml(option) {
    return /*html*/`
    <div class="add-contact animationFadeIn" onclick="doNotClose(event)">
    <div class="add-contact-head">
        <div class="add-contact-cross" >
            <img class="img-cross" onclick="closeAddContact(${option})" src="./assets/img/pngegg.png" alt="">
        </div>
        <div class="add-contact-header-info" >           
            <div class="add-contact-h">
                Add contact
            </div>
            <div class="add-contact-text">
                Tasks are better with a team!
            </div>
        </div>
    </div>
    <div class="add-contact-main">
        <div class="contact-member"><img src="./assets/img/contact-member.png" alt="">
        </div>
        <form onsubmit="createContact(${option}); return false;" onreset="closeAddContact(${option})">
            <div class="input-add-contact-container">
                <div class="input-contact">
                    <input placeholder="  Name" required  type="text" id="contactName" class="input-contact-name">
                    <img src="./assets/img/signup-user.png" alt="">
                </div>
                <div class="input-contact">
                    <input placeholder="  Email" required type="email" id="contactEmail" class="input-contact-name">
                    <img src="./assets/img/login-email.png" alt="">
                </div>
                <div  id="emailDone" class="d-none contact-email-done">This Email already exists</div>
                <div class="input-contact">
                    <input placeholder="  Phone" required type="text" pattern="[0-9]+"id="contactNumber" class="input-contact-name">
                    <img src="./assets/img/phone.png" alt="">
                </div>
            </div>
            <div class="button-container">
                <button class="button-cancel" type="reset" >Cancel <img src="./assets/img/cancel.png" alt=""></button>
                <button id="create_contact_btn" class="button-create" type="submit">Create contact <img src="./assets/img/rithe.png" alt=""></button>
            </div>
        </form>
    </div>
</div>
    `
}


/**
 * edit contact mask template
 * @param {object} contact contact object
 * @param {string} letters the contact initials
 * @param {number} index index of contact
 * @returns HTML
 */
function editContactHtml(contact, letters, index) {
    return /*html*/`
        <div class="add-contact animationFadeIn" onclick="doNotClose(event)">
            <div class="add-contact-head">
                <div class="add-contact-cross" onclick="hideAddContacts()">
                    <img class="img-cross" src="./assets/img/pngegg.png" alt="">
                </div>
                <div class="add-contact-header-info" >
                    <div class="add-contact-h">
                        Edit contact
                    </div>                   
                </div>
            </div>
            <div class="add-contact-main">
                <div style="background-color: ${contact['contactcolor']}" class="contact-detail-big-letter">
                    <p>${letters}</p>
                </div>
                    <form onsubmit="inviteContact('${contact['contactEmail']}', '${index}', '${letters}'); return false">
                        <div>
                            <div class="input-contact">
                                <input  required  type="text" id="contactEditName" class="input-contact-name">
                                <img src="./assets/img/signup-user.png" alt="">
                            </div>
                            <div class="input-contact">
                                <input  required type="email" id="contactEditEmail" class="input-contact-name">
                                <img src="./assets/img/login-email.png" alt="">
                            </div>
                            <div class="input-contact">
                                <input required type="text" id="contactEditNumber" class="input-contact-name">
                                <img src="./assets/img/phone.png" alt="">
                            </div>
                        </div>
                        <div class="button-container">
                            <button class="button-cancel" type="button" onclick="deleteContacts(${index})">Delete <img src="./assets/img/cancel.png" alt=""></button>
                            <button class="button-create" type="submit">Save <img src="./assets/img/rithe.png" alt=""></button>
                        </div>
                    </form>
            </div>
        </div>
    `
}

/**
 * user letter template
 * @param {string} color contact signature color
 * @param {string} letter contact inital letters
 * @returns 
 */
function userLetterTemplate(color, letter) {
    return `<div style="background-color: ${color}" class="user">${letter}</div>`;
}