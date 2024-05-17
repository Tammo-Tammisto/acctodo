var jwt = localStorage.getItem("jwt");
if (jwt == null) {
    window.location.href = './login.html';
}

let tasks = [];

async function logTasks() {
    const response = await fetch('http://demo2.z-bit.ee/tasks', {
        method: 'GET',
        headers: {
            'Authorization': "Bearer " + jwt,
        },
    });
    tasks = await response.json();
    tasks.forEach(renderTask);
}
logTasks();

async function refreshTasks() {
    // Remove all old tasks first
    taskList.innerHTML = "";

    const response = await fetch('http://demo2.z-bit.ee/tasks', {
        method: 'GET',
        headers: {
            'Authorization': "Bearer " + jwt,
        },
    });
    tasks = await response.json();
    tasks.forEach(renderTask);
}

function logout() {
    localStorage.removeItem("jwt");
    window.location.href = './login.html';
}

let taskList;
// When the page is loaded in the browser, add the first tasks to the page
window.addEventListener('load', () => {
    taskList = document.querySelector('#task-list');
});

function renderTask(task) {
    const taskRow = createTaskRow(task);
    taskList.appendChild(taskRow);
}

function createTaskRow(task) {
    let taskRow = document.querySelector('[data-template="task-row"]').cloneNode(true);
    taskRow.removeAttribute('data-template');

    // Fill the form fields with data
    const name = taskRow.querySelector("[name='name']");
    name.value = task.title;

    const checkbox = taskRow.querySelector("[name='completed']");
    checkbox.checked = task.marked_as_done;

    const deleteButton = taskRow.querySelector('.delete-task');
    deleteButton.addEventListener('click', () => {
        taskList.removeChild(taskRow);
        tasks.splice(tasks.indexOf(task), 1);
    });

    // Prepare the checkbox for clicking
    hydrateAntCheckboxes(taskRow);

    return taskRow;
}

async function deleteTask(button) {
    const taskRow = button.closest('.ant-list-item');
    const nameInput = taskRow.querySelector("[name='name']");
    console.log(nameInput.value);
    taskRow.remove();

    const taskIndex = tasks.findIndex(task => task.title === nameInput.value);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
    }

    const response = await fetch('http://demo2.z-bit.ee/tasks', {
        method: 'GET',
        headers: {
            'Authorization': "Bearer " + jwt,
        },
    });
    tasks = await response.json();
    const idOfDeletedTask = tasks.find(task => task.title === nameInput.value).id;
    console.log(idOfDeletedTask);

    fetch('http://demo2.z-bit.ee/tasks/' + idOfDeletedTask, {
        method: 'DELETE',
        headers: {
            'Authorization': "Bearer " + jwt,
        },
        body: null
    });
}

function markDone(checkbox) {
    const taskRow = checkbox.closest('.ant-list-item');
    const nameInput = taskRow.querySelector("[name='name']");
    const idOfMarkedTask = tasks.find(task => task.title === nameInput.value).id;

    const data = {
        "title": nameInput.value,
        "marked_as_done": checkbox.checked
    };

    const putMethod = {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': "Bearer " + jwt,
        },
        body: JSON.stringify(data)
    };

    fetch('http://demo2.z-bit.ee/tasks/' + idOfMarkedTask, putMethod);

    console.log(`Task ${checkbox.checked ? 'marked as done' : 'unmarked as done'}: ${nameInput.value}`);
    console.log(idOfMarkedTask);
}

function createAntCheckbox() {
    const checkbox = document.querySelector('[data-template="ant-checkbox"]').cloneNode(true);
    checkbox.removeAttribute('data-template');
    hydrateAntCheckboxes(checkbox);
    return checkbox;
}

function hydrateAntCheckboxes(element) {
    const elements = element.querySelectorAll('.ant-checkbox-wrapper');
    for (let i = 0; i < elements.length; i++) {
        let wrapper = elements[i];

        if (wrapper.__hydrated)
            continue;
        wrapper.__hydrated = true;

        const checkbox = wrapper.querySelector('.ant-checkbox');
        const input = wrapper.querySelector('.ant-checkbox-input');
        if (input.checked) {
            checkbox.classList.add('ant-checkbox-checked');
        }

        input.addEventListener('change', () => {
            checkbox.classList.toggle('ant-checkbox-checked');
        });
    }
}

function addTask() {
    Swal.fire({
        title: 'Add New Task',
        html: `<input type="text" id="task-title" class="swal2-input" placeholder="Task Title">`,
        focusConfirm: false,
        preConfirm: () => {
            const title = Swal.getPopup().querySelector('#task-title').value;
            if (!title) {
                Swal.showValidationMessage('Please enter a task title');
                return false;
            }
            return { title: title };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            submitTask(result.value.title);
        }
    });
}

async function submitTask(title) {
    console.log('Task Title:', title);

    const response = await fetch('http://demo2.z-bit.ee/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': "Bearer " + jwt,
        },
        body: JSON.stringify({ title: title, completed: false })
    });

    if (response.ok) {
        console.log('Task Added:', await response.json());
        refreshTasks();
    } else {
        console.error('Error adding task:', response.statusText);
    }
}
