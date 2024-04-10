/**
 * task editor template
 * @param {number} i index
 * @param {string} taskStatus toDo, Done etc.
 * @returns HTML
 */
function openAddTaskHtml(i, taskStatus) {
  return /*html*/`
  <form class="addTaskForm" onsubmit="addToTask(${i}, '${taskStatus}'); return false; ">
    <img class="CloseCross" onclick="closeAddTaskMask(${i})" src="assets/img/group11.png" alt="">
    <div class="addTask-top">
      <h2>Add Task</h2>
      <button id="add_task_btn" class="btn">Create Task <img src="assets/img/white-check.png" alt=""></button>
    </div>

    <div class="input-title">
      <input id="AddTitle" type="text" placeholder="Enter a title" autocomplete="off" required>
    </div>

    <div id="user_selector">
      <div class="selector-header"  onclick="showUsers(${i})">
        Select contacts to assign
        <img class="selectorArrow" src="assets/img/blue-dropdown-arrow.png" alt="">
      </div>
    </div>

    <div class="selector-user-dropdown" id="selector_user_dropdown">  </div>
    <div id="selector_user_dropdown_contact" class="display-flex-in-addtask"></div>

    <div class="input border-bottom" style="display:flex; flex-direction: column; align-items:flex-start;">
      <h4>Due Date</h4>
      <div class= "input-date" id="input-date">
        <input id="add-date" class="add-date" placeholder="dd/mm/yy" type="date" required>
      </div>
    </div>

    <h4>Category</h4>  <div class="d-none" class="category-alert" id="chooseCategory">This field is required</div>      
    <div id="category_selector">
      <div id="selected_category" class="selector-header" onclick="showTaskCategories()">
        Select task category
        <img class="selectorArrow" src="assets/img/blue-dropdown-arrow.png" alt="">
      </div>
    </div>

    <div class="selector-Category-Dropdown" id="selector_Category_Dropdown">  </div>
    <span id="chossePriority" class="d-none">This field is required</span>
    <div class="priorityContainer">
      <div class="priority-urgent" onclick="selectedPriority(1)" id="priorityUrgent">
        <p>Urgent</p> 
        <img id="priorityUrgentImg" src="assets/img/prio-urgent.png" alt="">
      </div>

      <div class="priority-medium" id="priorityMedium" onclick="selectedPriority(2)">
        <p>Medium</p> 
        <img id="priorityMediumImg" src="assets/img/prio-medium.png" alt="">
      </div>

      <div class="priority-low" id="priorityLow" onclick="selectedPriority(3)">
        <p>Low</p> 
        <img id="priorityLowImg" src="assets/img/prio-low.png" alt="">
      </div>
    </div>

    <h4>Description</h4>
    <div>
      <textarea class="add-description" id="AddDescription" type="text" placeholder="Enter a Description"></textarea>
    </div>

    <h4>Subtasks</h4>
    <div id="empty_subtask_text">

    </div>

    <div class="input-subtasks" id="newSubtask_select">
      <div class="inputUser pointer">
        <div class="inputfield-new-user">
          <input class="input border-bottom" id="new_subtask_text" type="text" placeholder="Add new subtask">
          <div class="checkAndCrossIconsCategory">
            <img src="./assets/img/blue-cross.png" onclick="clearSubTasks()" class="blue-cross pointer">
            <img src="./assets/img/devider.png">
            <img src="./assets/img/blue-check.png" onclick="pushSubtasks()" class="blue-check pointer">
          </div>
        </div>
      </div>
    </div>

    <div class="new-Subtasks" id="addSubtaskCheckbox">

    </div>
  </form>
`;
}


/**
 * category HTML template
 * @param {string} category category name
 * @param {string} color color code
 * @returns HTML
 */
function showSelectCategory(category, color) {
  return /*html*/`
    <div class="selector-header pointer" onclick="showTaskCategories()" id="selected_category">
      <div class="selected">
        ${category}
        <img src="./assets/img/${color}.png" />
      </div>
      <img class="selectorArrow" src="assets/img/blue-dropdown-arrow.png" alt="">
    </div>
  `;
}


/**
 * template, new category field
 * @returns HTML
 */
function showNewCategory() {
  return /*html*/`
    <div onclick="changeInputCategory()" class="selectorCell pointer">
       <div>New category</div>
         <div class="selectorCellColor"><img src=""></div>
       </div>
    </div>
  `;
}


/**
 * category dropdown template
 * @param {object} staticCategorys users category object
 * @returns HTML
 */
function showExistingCategories(staticCategorys) {
  return /*html*/`  
    <div onclick="selectedCategory('${staticCategorys['taskCategory']}','${staticCategorys['taskColor']}')" class="selectorCell pointer">
      <div>${staticCategorys['taskCategory']}
      </div>

      <div>
        <img src="./assets/img/${staticCategorys['taskColor']}.png" </div>
    </div>
  `;
}


/**
 * category editor mask
 * @returns HTML
 */
function showChangeInputCategory() {
  return /*html*/`
    <div class="inputCategory">
      <div id="alert_message"></div>
        <div class="inputfield-new-category">
          <input class="input border-bottom" id="input-new-category" type="text" placeholder="New category name" required>
          <div class="checkAndCrossIconsCategory">
              <img src="./assets/img/blue-cross.png" onclick="exitCategoryInput()" class="blue-cross pointer">
              <img src="./assets/img/devider.png">
              <img src="./assets/img/blue-check.png" onclick="addCategory()" id="input-new-category" class="blue-check pointer">
          </div>
        </div>
      <div id="categoryColorCells"style="margin-top: 10px; margin-left: 20px; ">
        <img onclick="addCategoryColor('lightblueCategory')" class="categoryColor pointer" style="margin-right: 20px;" src="./assets/img/lightblueCategory.png">
        <img onclick="addCategoryColor('redCategory')" class="categoryColor pointer" style="margin-right: 20px;" src="./assets/img/redCategory.png">
        <img onclick="addCategoryColor('greenCategory')" class="categoryColor pointer" style="margin-right: 20px;" src="./assets/img/greenCategory.png">
        <img onclick="addCategoryColor('orangeCategory')" class="categoryColor pointer" style="margin-right: 20px;" src="./assets/img/orangeCategory.png">
        <img onclick="addCategoryColor('purpleCategory')" class="categoryColor pointer" style="margin-right: 20px;" src="./assets/img/purpleCategory.png">
        <img onclick="addCategoryColor('blueCategory')" class="categoryColor pointer" src="./assets/img/blueCategory.png">
      </div>
    </div>`;
}


/**
 * selected category template
 * @returns HTML
 */
function showExitCategoryInput() {
  return /*html*/`
    <div id="selected_category" class="selector-header pointer" onclick="showTaskCategories()">Select task category <img class="selectorArrow" src="assets/img/blue-dropdown-arrow.png">
    
    </div>
    <div class="selector-Category-Dropdown" id="selector_Category_Dropdown">

    </div>`;
}


/**
 * subtask checkbox template
 * @param {object} subTask subtask object
 * @param {number} subTaskIndex 
 * @returns HTML
 */
function showSubtaskCheckbox(subTask, subTaskIndex) {
  return /*html*/ `
  <div id="subTask_${subTaskIndex}" class="subtasks">
    <span>${subTask.title}</span> 
    <img src="./assets/img/trash-blue.png" onclick="deleteSubTaskAdd(${subTaskIndex})" class="subtasks-trash" alt="trash"> 
  </div>`;
}


/**
 * 
 * @returns HTML
 */
function showInviteNewContact() {
  return /*html*/ `
  <div class="selectorCell pointer" onclick="openAddContact(1)">
    <div>Invite new contact</div>
    <div><img src="./assets/img/newContact-img.png"></div>
  </div>`;
}


/**
 * contact signature color template
 * @param {number} i index of contact
 * @returns HTML
 */
function selectedContactHTML(i) {
  return `<div style="background-color:${userSelect[i]['concolor']}" class="user">${userSelect[i]['contactInitials']}</div>`;
}


/**
 * contact droptown element template
 * @param {index} i index of contact
 * @param {array} activUserContact users contacts
 * @param {object} currentUser current user
 * @returns HTML
 */
function showContactsDropDown(i, activUserContact, currentUser) {
  return /*html*/`
  <div onclick="selectedUser('${currentUser.contacts[i]['contactInitials']}', '${currentUser.contacts[i]['contactcolor']}', '${currentUser.contacts[i]['contactName']}')" class="selectorCell pointer">
      <div>${activUserContact[i].contactName}</div>
      <div><img id="user_select${currentUser.contacts[i]['contactInitials']}${currentUser.contacts[i]['contactcolor']}${currentUser.contacts[i]['contactName']}" src="./assets/img/userSelect-img.png"></div>
  </div>`;
}