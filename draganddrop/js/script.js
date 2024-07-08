let tasks = [];

const addTaskButton = document.getElementById('add');
const taskInput = document.getElementById('task');
const assignedTasksZone = document.getElementById('assigned-tasks');
const processingTasksZone = document.getElementById('processing-tasks');
const completedTasksZone = document.getElementById('completed-tasks');

addTaskButton.addEventListener('click', addTask);

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const newTask = {
        id: new Date().getTime(),
        task: taskText,
        assignedAt: new Date().toLocaleString(),
        status: 'assigned'
    };

    tasks.push(newTask);
    taskInput.value = '';

    displayTasks();
}

function displayTasks() {
    assignedTasksZone.innerHTML = '';
    processingTasksZone.innerHTML = '';
    completedTasksZone.innerHTML = '';

    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        const dropzone = getDropzoneElement(task.status);
        dropzone.appendChild(taskElement);
    });

    addDragListeners();
}

function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.id = task.id;
    taskElement.classList.add('task');
    taskElement.draggable = true;
    taskElement.innerHTML = `
        <p>${task.task}</p>
        <label>Assigned At: ${task.assignedAt}</label>
    `;
    return taskElement;
}

function getDropzoneElement(status) {
    switch (status) {
        case 'assigned':
            return assignedTasksZone;
        case 'processing':
            return processingTasksZone;
        case 'completed':
            return completedTasksZone;
        default:
            return assignedTasksZone;
    }
}

function addDragListeners() {
    const tasksElements = document.querySelectorAll('.task');
    tasksElements.forEach(task => {
        task.addEventListener('dragstart', dragStart);
    });

    const dropzones = document.querySelectorAll('.dropzone');
    dropzones.forEach(dropzone => {
        dropzone.addEventListener('dragover', dragOver);
        dropzone.addEventListener('drop', drop);
    });
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    const taskElement = document.getElementById(taskId);
    const dropzoneId = event.target.id;

    if (dropzoneId === 'assigned-tasks' || dropzoneId === 'processing-tasks' || dropzoneId === 'completed-tasks') {
        const dropzone = document.getElementById(dropzoneId);
        dropzone.appendChild(taskElement);

        tasks.forEach(task => {
            if (task.id.toString() === taskId) {
                task.status = dropzoneId.replace('-tasks', '');
            }
        });

        if(tasks.filter(task => task.status === "completed").length > 0){
            document.querySelector(".clear-task-div").style.display = "block"
        }

        console.log(tasks);
    }
}

document.querySelector("#clearTask").addEventListener("click", (event)=>{
    event.preventDefault();
    tasks = tasks.filter(task => task.status !== "completed")
    console.log(tasks);
    document.querySelector("#completed-tasks").innerHTML = ""
    document.querySelector(".clear-task-div").style.display = "none"
})