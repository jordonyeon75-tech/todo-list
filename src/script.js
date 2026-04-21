let tasks = [];
let editId = null;

const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const saveBtn = document.getElementById('saveBtn');

function saveTask() {
    const titleInput = document.getElementById('taskTitle');
    const title = titleInput.value.trim();
    const desc = document.getElementById('taskDesc').value.trim();
    const priority = document.getElementById('taskPriority').value;

    if (!title) {
        showToast("Please enter a task title.", "warning"); // Warning type
        return;
    }

    if (editId) {
        tasks = tasks.map(t => t.id === editId ? { ...t, title, desc, priority } : t);
        editId = null;
        saveBtn.innerText = "Add Task";
        showToast("Task updated successfully!"); // Success message
    } else {
        const newTask = {
            id: Date.now(),
            title: title,
            desc: desc,
            priority: priority,
            completed: false
        };
        tasks.push(newTask);
        showToast("Task added successfully!");
    }

    clearInputs();
    render();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    render();
    showToast("Task deleted.", "success"); // Feedback for deletion
}

function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    render();
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDesc').value = task.desc;
    document.getElementById('taskPriority').value = task.priority;
    editId = id;
    saveBtn.innerText = "Update Task";

    // Smooth scroll to top so user sees the edit form
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function clearInputs() {
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDesc').value = '';
    document.getElementById('taskPriority').value = 'Low';
}

function render() {
    taskList.innerHTML = '';
    taskCount.innerText = `${tasks.length} Tasks`;

    // Sort: Pending tasks first
    const sortedTasks = [...tasks].sort((a, b) => a.completed - b.completed);

    sortedTasks.forEach(task => {
        const div = document.createElement('div');
        div.className = `task-item ${task.completed ? 'completed' : ''}`;

        div.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${task.id})">
            <div class="task-content">
                <div class="task-title">${task.title}</div>
                <div class="task-desc">${task.desc}</div>
                <span class="badge ${task.priority}">${task.priority}</span>
            </div>
            <div class="actions">
                <button class="btn-edit" onclick="editTask(${task.id})">Edit</button>
                <button class="btn-delete" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        taskList.appendChild(div);
    });
}
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMessage');
    const toastIcon = toast.querySelector('.toast-icon');

    // Set content and style
    toastMsg.innerText = message;
    toastIcon.innerText = type === 'success' ? '✅' : '⚠️';

    // Remove old classes and add new ones
    toast.classList.remove('toast-hidden', 'success', 'warning');
    toast.classList.add(type);

    // Show toast
    setTimeout(() => toast.classList.remove('toast-hidden'), 10);

    // Auto-hide after 2.5 seconds
    setTimeout(() => {
        toast.classList.add('toast-hidden');
    }, 2500);
}
