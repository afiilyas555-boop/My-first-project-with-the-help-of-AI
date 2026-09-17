// ==============================
// Elements
// ==============================

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const taskCount = document.getElementById("taskCount");
const remainingTasks = document.getElementById("remainingTasks");

const emptyMessage = document.getElementById("emptyMessage");
const clearCompleted = document.getElementById("clearCompleted");

const filters = document.querySelectorAll(".filter");


// ==============================
// Data
// ==============================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


// ==============================
// Save Tasks
// ==============================

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


// ==============================
// Display Tasks
// ==============================

function displayTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {

        filteredTasks = tasks.filter(function(task) {
            return !task.completed;
        });

    }

    if (currentFilter === "completed") {

        filteredTasks = tasks.filter(function(task) {
            return task.completed;
        });

    }


    filteredTasks.forEach(function(task) {

        const li = document.createElement("li");

        li.classList.add("task");

        if (task.completed) {
            li.classList.add("completed");
        }


        li.innerHTML = `
            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? "checked" : ""}
            >

            <span class="task-text">
                ${escapeHTML(task.text)}
            </span>

            <button class="delete-btn">
                🗑️
            </button>
        `;


        // Complete task

        const checkbox = li.querySelector(".task-checkbox");

        checkbox.addEventListener("change", function() {

            toggleTask(task.id);

        });


        // Delete task

        const deleteBtn = li.querySelector(".delete-btn");

        deleteBtn.addEventListener("click", function() {

            deleteTask(task.id);

        });


        taskList.appendChild(li);

    });


    updateUI();

}


// ==============================
// Add Task
// ==============================

function addTask() {

    const text = taskInput.value.trim();


    if (text === "") {

        alert("Please enter a task.");

        return;

    }


    const newTask = {

        id: Date.now(),

        text: text,

        completed: false

    };


    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    displayTasks();

    taskInput.focus();

}


// ==============================
// Toggle Task
// ==============================

function toggleTask(id) {

    tasks = tasks.map(function(task) {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });


    saveTasks();

    displayTasks();

}


// ==============================
// Delete Task
// ==============================

function deleteTask(id) {

    tasks = tasks.filter(function(task) {

        return task.id !== id;

    });


    saveTasks();

    displayTasks();

}


// ==============================
// Update UI
// ==============================

function updateUI() {

    const activeTasks = tasks.filter(function(task) {

        return !task.completed;

    });


    taskCount.textContent = tasks.length;


    remainingTasks.textContent =
        `${activeTasks.length} ${
            activeTasks.length === 1 ? "task" : "tasks"
        } remaining`;


    if (tasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

    }

}


// ==============================
// Filters
// ==============================

filters.forEach(function(button) {

    button.addEventListener("click", function() {

        filters.forEach(function(btn) {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        currentFilter = button.dataset.filter;

        displayTasks();

    });

});


// ==============================
// Clear Completed
// ==============================

clearCompleted.addEventListener("click", function() {

    tasks = tasks.filter(function(task) {

        return !task.completed;

    });


    saveTasks();

    displayTasks();

});


// ==============================
// Enter Key
// ==============================

taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        addTask();

    }

});


// ==============================
// Add Button
// ==============================

addTaskBtn.addEventListener("click", addTask);


// ==============================
// Security
// ==============================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ==============================
// Initial Load
// ==============================

displayTasks();