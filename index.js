var jwt = localStorage.getItem("jwt");
if (jwt == null) {
  window.location.href = './login.html'
}
let tasks = []
async function logTasks() {
    const response = await fetch('http://demo2.z-bit.ee/tasks', {
        method: 'GET',
        headers: {
            'Authorization': "Bearer "+jwt,
        },
    })
    tasks = await response.json();

    tasks.forEach(renderTask);
}
logTasks()

async function refreshTasks() {
    // Remove all old tasks first
    taskList.innerHTML = "";

    const response = await fetch('http://demo2.z-bit.ee/tasks', {
        method: 'GET',
        headers: {
            'Authorization': "Bearer " + jwt,
        },
    })
    tasks = await response.json();

    tasks.forEach(renderTask);
}

function logout() {
    localStorage.removeItem("jwt");
    window.location.href = './login.html'
}
let taskList;
// kui leht on brauseris laetud siis lisame esimesed taskid lehele
window.addEventListener('load', () => {
    taskList = document.querySelector('#task-list');
});

function renderTask(task) {
    const taskRow = createTaskRow(task);
    taskList.appendChild(taskRow);
}

function createTask() {

    const task = {
        title: 'Task ',
        completed: false
    };
    tasks.push(task);
    return task;
}

function createTaskRow(task) {
    let taskRow = document.querySelector('[data-template="task-row"]').cloneNode(true);
    taskRow.removeAttribute('data-template');

    // Täidame vormi väljad andmetega
    const name = taskRow.querySelector("[name='name']");
    name.value = task.title;

    const checkbox = taskRow.querySelector("[name='completed']");
    checkbox.checked = task.marked_as_done;

    const deleteButton = taskRow.querySelector('.delete-task');
    deleteButton.addEventListener('click', () => {
        taskList.removeChild(taskRow);
        tasks.splice(tasks.indexOf(task), 1);
    });

    // Valmistame checkboxi ette vajutamiseks
    hydrateAntCheckboxes(taskRow);

    return taskRow;
}


function createAntCheckbox() {
    const checkbox = document.querySelector('[data-template="ant-checkbox"]').cloneNode(true);
    checkbox.removeAttribute('data-template');
    hydrateAntCheckboxes(checkbox);
    return checkbox;
}

/**
 * See funktsioon aitab lisada eridisainiga checkboxile vajalikud event listenerid
 * @param {HTMLElement} element Checkboxi wrapper element või konteiner element mis sisaldab mitut checkboxi
 */
function hydrateAntCheckboxes(element) {
    const elements = element.querySelectorAll('.ant-checkbox-wrapper');
    for (let i = 0; i < elements.length; i++) {
        let wrapper = elements[i];

        // Kui element on juba töödeldud siis jäta vahele
        if (wrapper.__hydrated)
            continue;
        wrapper.__hydrated = true;


        const checkbox = wrapper.querySelector('.ant-checkbox');

        // Kontrollime kas checkbox peaks juba olema checked, see on ainult erikujundusega checkboxi jaoks
        const input = wrapper.querySelector('.ant-checkbox-input');
        if (input.checked) {
            checkbox.classList.add('ant-checkbox-checked');
        }

        // Kui inputi peale vajutatakse siis uuendatakse checkboxi kujundust
        input.addEventListener('change', () => {
            checkbox.classList.toggle('ant-checkbox-checked');
        });
    }
}

function addTask() {
    // Open a new window or popup
    var taskWindow = window.open('', 'Add Task', 'width=300,height=200');

    // Basic HTML structure for the new window
    taskWindow.document.write('<html><head><title>Add New Task</title></head><body>');

    // Form for adding a task
    taskWindow.document.write('<form id="taskForm">');
    taskWindow.document.write('Title: <input type="text" id="title" name="title"><br>');
    // Add the window close function to the onclick event
    taskWindow.document.write('<input type="button" value="Add Task" onclick="opener.submitTask(document.getElementById(\'title\').value); window.close();">');
    taskWindow.document.write('</form>');

    // Close the HTML document
    taskWindow.document.write('</body></html>');
    taskWindow.document.close(); // Close the document for further writing
}


function submitTask(title) {
    // Process task submission, e.g., send it to a server or log it
    console.log('Task Title:', title);

    // Here, add your logic to send task to the backend server
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://demo2.z-bit.ee/tasks", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader("Authorization", "Bearer " + jwt);
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            console.log('Task Added:', this.responseText);
            // Optionally, reload or update task list in the original window
            window.location.reload();
        }
    };
    xhttp.send(JSON.stringify({ title: title }));
    refreshTasks();
}