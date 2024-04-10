/**
 * task card template
 * @param {object} element a task object
 * @returns HTML
 */
function generateTodoHTML(element) {
    return /*html*/`
    <div onclick="checkDevice()" draggable="true" ondragstart="startDragging(${element['id']})" class="todo" id="${element['id']}">
        <div id="task-menu-${element.id}" class="task-menu d-none">
            <div ontouchstart="showTaskDetails(${element.id})" class="task-menu-edit">Edit</div>
            <div id="touch-move-${element.id}" class="task-menu-move">Move to:</div>
            
        </div>   
      <span class="${element['category']['TaskColor']}">${element['category']['Category']}</span>
      <div class=titleAndText>
          <h4 class="title">${element['title']}</h4>
          <div class="text">${element['description']}</div>
      </div>

      <div id="task_progress_${element['id']}" class="task-progress">
       
      </div>

      <div class="UserAndPriority" id="user_and_priority">
        <div class="contacts-in-task" id="contacts${element['id']}"></div>
        
        <div class="priority"><img src="assets/img/prio-${element['priority']}.png" alt=""></div>
      </div>
    </div>`;
}


/**
 * progress bar template
 * @param {number} taskId id of the current task
 * @returns HTML
 */
function progressBarTemplate(taskId) {
    return /*html*/ `
         <div class="progress-bar">
            <div class="progress-bar-fill" id="fill${taskId}"></div>
        </div>
        <span class="progress-bar-text" id="fill-text${taskId}"> Done</span>
    `;
}


/**
 * dragged element template
 * @param {string} status toDo, done etc.
 * @returns HTML
 */
function draggedElementTemplate(status) {
    return /*html*/ `<div id="drop_template_${status}" class="drag-template d-none"></div>`;
}


/**
 * touch menu template for moving tasks
 * @param {object} task current Task
 * @param {string} currentTaskState task status 
 * @param {number} i index
 * @returns HTML
 */
function touchMenuEntryHTML(task, currentTaskState, i) {
    return /*html*/ `
        <div ontouchstart="moveTaskOnTouchDevice(${task.id}, '${currentTaskState}')" class="task-menu-move-entry">${taskStatusTitles[i]}</div>`;
}


/**
 * task detail card template on board
 * @returns HTML
 */
function detailContentTemplate() {
    return /*html*/`
        <img class="CloseCross-DetailTask pointer" onclick="closeTaskEditor()" src="assets/img/group11.png" alt="">
        <div class="detail-category ${currentTask.category.TaskColor}">
            ${currentTask.category.Category}
        </div>
        <h2 class="detail-title">${currentTask.title}</h2>
        <div class="detail-text">
            ${currentTask.description}
        </div>
        <div class="detail-dueDate"> 
            <h5>Due date:</h5>  
            <p>${currentTask.dueDate}</p>
        </div>
        <div class="detail-priority">
            <h5> Priority:</h5> 
            <img src="assets/img/detail-prio-${currentTask.priority}.png" alt="">
        </div>
        <div class="detail-assignedTo"> 
            <h5>Assigned To:</h5> 
            <div id="detail_assigned_contacts">
                
            </div> 
        </div>
        <img id="edit_button" class="edit-button pointer" src="assets/img/edit-button.png" onclick="editTask(${currentTask.id})">
        <div class="detail-subTasks" id="detail_subTasks">
        <h5>Subtasks:</h5>
        </div>
    `;
}


/**
 * task editor template
 * @param {number} id task id
 * @returns HTML
 */
function editTaskTemplate(id) {
    return /*html*/`
        <form onsubmit="saveChangedTask(${currentTask.id}); return false;" class="editTask">
            <img class="CloseCross-DetailTask pointer" onclick="closeTaskEditor()" src="assets/img/group11.png" alt="">
        
            <div class="input-title">
                <input id="changed_title" type="text" value="${currentTask.title}" autocomplete="off" required>
            </div>

            <div>
                <h4>Description</h4>
                <textarea class="add-description" id="changed_description" placeholder="Enter a Description">${currentTask.description.replace(/<br\s*\/?>/ig, "")}</textarea>
            </div>

            <div class="input border-bottom" style="display:flex; flex-direction: column; align-items:flex-start;">
                <h4>Due Date</h4>
                <div class= "input-date" id="input-date">
                    <input id="add-date" class="add-date" value="${currentTask.dueDate}" type="date">
                </div>
            </div>

            <div class="priorityContainer">
                    <div class="priority-urgent" onclick="changePriority(1)" id="editPriorityUrgent">
                        <p>Urgent</p> 
                        <img id="editPriorityUrgentImg" src="assets/img/prio-urgent.png" alt="">
                    </div>
                <div class="priority-medium" id="editPriorityMedium" onclick="changePriority(2)">
                    <p>Medium</p> 
                    <img id="editPriorityMediumImg" src="assets/img/prio-medium.png" alt="">
                </div>
                <div class="priority-low" id="editPriorityLow" onclick="changePriority(3)">
                    <p>Low</p> 
                    <img id="editPriorityLowImg" src="assets/img/prio-low.png" alt="">
                </div>
            </div>

            <div id="user_selector">
                <div class="selector-header" onclick="showUsers(${currentTask.id})">
                    Select contacts to assign
                    <img class="selectorArrow" src="assets/img/blue-dropdown-arrow.png" alt="">
                </div>
            </div>
            <div class="selector-user-dropdown" id="selector_user_dropdown"></div>
            <div id="selector_user_dropdown_contact" class="display-flex-in-addtask"></div>

            <div class="detail-subTasks" id="edit_subTasks2">
                <h4>Subtasks:</h4>
                <div id="empty_subtask_text">
          
                </div>
                <div class="inputUser pointer">
                    <div class="inputfield-new-user">
                        <input class="input border-bottom" id="new_subtask_text" type="text" placeholder="Add new subtask">
                        <div class="checkAndCrossIconsCategory">
                            <img src="./assets/img/blue-cross.png" onclick="clearSubTasks()" class="blue-cross pointer">
                            <img src="./assets/img/devider.png">
                            <img src="./assets/img/blue-check.png" onclick="addNewSubTask(${id})" class="blue-check pointer">
                        </div>
                    </div>
                </div>
                <div class="new-Subtasks" id="edit_subTasks">
  
                </div>
            </div>
            <div class="task-edit-btns">
                <div onclick="deleteTask(${currentTask.id})" class="btn trash-button"><img class="trash" src="assets/img/trash.ico" alt=""></div>
                <button class="btn ok">Ok <img src="assets/img/white-check.png" alt=""></button>
            </div>
        </form>`;
}


/**
 * subtask template for dropdown
 * @param {object} subTask current subtask
 * @param {number} i index of subtask
 * @param {number} id id of subtask
 * @returns HTML
 */
function renderAssignedSubTasksTemplate(subTask, i, id) {
    return /*html*/ `
        <div>
            <input id="subTask_${i}" onchange="setSubTaskDone(${id}, ${i})" type="checkbox" class="pointer">    
            <span id="subTask_title_${i}">${subTask.title}</span>
        </div>
    `;
}


/**
 * assigend user template
 * @param {string} color color code
 * @param {string} letter 
 * @param {string} contact users contact name
 * @returns html
 */
function assignedUserTemplate(color, letter, contact) {
    return `
         <div class="detailforcontactintask">
              <div style="background-color: ${color}" class="user">${letter}</div>
              <div>${contact}</div>
         </div>`;
}


/**
 * subtask editor mask template
 * @param {object} currentSubTask current subtask
 * @param {number} i index of subtask
 * @param {number} id id of subtask
 * @returns HTML
 */
function subTaskTemplate(subTask, i, id) {
    return /*html*/ `
        <div id="${i}" class="subtaskList" >  
          <input id="subTask_${i}" onchange="setSubTaskDone(${id})" class="subtaskCheckbox pointer" type="checkbox">
          <span id="subTask_title_${i}">${subTask.title}</span>
          <img src="./assets/img/trash-blue.png" onclick="deleteSubTask(${id}, ${i})" class="subtasks-trash" alt="trash"> 
        </div>`;
}