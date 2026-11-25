
// 1. Get HTML Elements

const taskInput = document.getElementById("taskInput");
const searchInput = document.getElementById("searchInput");
const taskList = document.getElementById("taskList");
const selectAll = document.getElementById("selectAll");
const deleteSelected = document.getElementById("deleteSelected");

const allCount = document.getElementById("allCount");
const completedCount = document.getElementById("completedCount");
const deletedCount = document.getElementById("deletedCount");


// 2. Application Data

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

let selectedTasks = new Set();


// 3. Save Tasks in Local Storage

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// 4. Add New Task

taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        const taskText = taskInput.value.trim();

        if (taskText === "") return;

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
            deleted: false
        };

        tasks.push(newTask);

        taskInput.value = "";

        saveTasks();
        renderTasks();
    }

});


// 5. Display Tasks

function renderTasks() {

    taskList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();

    const filteredTasks = tasks.filter(function(task) {

        const matchesSearch = task.text.toLowerCase().includes(searchText);

        if (currentFilter === "deleted") {
            return task.deleted && matchesSearch;
        }

        if (currentFilter === "completed") {
            return !task.deleted && task.completed && matchesSearch;
        }

        if (currentFilter === "active") {
            return !task.deleted && !task.completed && matchesSearch;
        }

        return !task.deleted && matchesSearch;

    });


    filteredTasks.forEach(function(task) {

        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        // Select Checkbox
        const selectCheckbox = document.createElement("input");
        selectCheckbox.type = "checkbox";
        selectCheckbox.className = "task-select";
        selectCheckbox.checked = selectedTasks.has(task.id);
        selectCheckbox.disabled = task.deleted;

        // Complete Checkbox
        const completeCheckbox = document.createElement("input");
        completeCheckbox.type = "checkbox";
        completeCheckbox.className = "task-complete";
        completeCheckbox.checked = task.completed;
        completeCheckbox.disabled = task.deleted;

        // Task Text
        const span = document.createElement("span");
        span.textContent = task.text;

        // Action Button
        const actionButton = document.createElement("button");

        if (task.deleted) {
            actionButton.textContent = "Restore";
            actionButton.dataset.action = "restore";
        } else {
            actionButton.textContent = "Delete";
            actionButton.dataset.action = "delete";
        }

        actionButton.className = "task-action";

        // Add Elements
        li.append(
            selectCheckbox,
            completeCheckbox,
            span,
            actionButton
        );

        li.dataset.id = task.id;

        taskList.appendChild(li);

    });

    updateCounters();
}


// 6. Complete Individual Task

taskList.addEventListener("change", function(event) {

    const li = event.target.closest("li");

    if (!li) return;

    const taskId = Number(li.dataset.id);

    const task = tasks.find(function(task) {
        return task.id === taskId;
    });

    if (!task) return;

    if (event.target.classList.contains("task-complete")) {

        task.completed = event.target.checked;

    }

    if (event.target.classList.contains("task-select")) {

        if (event.target.checked) {
            selectedTasks.add(taskId);
        } else {
            selectedTasks.delete(taskId);
        }

    }

    saveTasks();
    renderTasks();

});


// 7. Delete and Restore Tasks

taskList.addEventListener("click", function(event) {

    const button = event.target.closest("button");

    if (!button) return;

    const li = button.closest("li");

    const taskId = Number(li.dataset.id);

    const task = tasks.find(function(task) {
        return task.id === taskId;
    });

    if (!task) return;

    if (button.dataset.action === "delete") {

        task.deleted = true;
        selectedTasks.delete(taskId);

    }

    if (button.dataset.action === "restore") {

        task.deleted = false;

    }

    saveTasks();
    renderTasks();

});


// 8. Mark All Tasks as Complete

selectAll.addEventListener("change", function() {

    tasks.forEach(function(task) {

        if (!task.deleted) {
            task.completed = selectAll.checked;
        }

    });

    saveTasks();
    renderTasks();

});


// 9. Delete Selected Tasks

deleteSelected.addEventListener("click", function() {

    tasks.forEach(function(task) {

        if (selectedTasks.has(task.id) && !task.deleted) {
            task.deleted = true;
        }

    });

    selectedTasks.clear();

    saveTasks();
    renderTasks();

});


// 10. Search Tasks

searchInput.addEventListener("input", function() {

    renderTasks();

});


// 11. Filter Tasks

document.querySelector(".filters").addEventListener("click", function(event) {

    const button = event.target.closest("button");

    if (!button) return;

    currentFilter = button.dataset.filter;

    renderTasks();

});


// 12. Update Counters

function updateCounters() {

    allCount.textContent = tasks.length;

    completedCount.textContent = tasks.filter(function(task) {
        return task.completed && !task.deleted;
    }).length;

    deletedCount.textContent = tasks.filter(function(task) {
        return task.deleted;
    }).length;

}


// 13. Initial Display

renderTasks();
