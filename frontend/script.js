const LOCAL_API_URL = "http://localhost:3000";
const DEPLOY_API_URL = "https://crud-task-mvc-oixj.onrender.com";

const runningLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

const API_URL = runningLocal ? LOCAL_API_URL : DEPLOY_API_URL;

const titleInput = document.getElementById("titleInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const messageBox = document.getElementById("messageBox");

function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = type;

    setTimeout(() => {
        messageBox.textContent = "";
        messageBox.className = "";
    }, 2500);
}

async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks`);

        if (!response.ok) {
            showMessage("Deu erro ao carregar tasks", "error");
            return;
        }

        const tasks = await response.json();
        taskList.innerHTML = "";

        tasks.forEach((task) => {
            const li = document.createElement("li");

            const doneLabel = document.createElement("span");
            doneLabel.textContent = "Concluida:";

            const doneCheckbox = document.createElement("input");
            doneCheckbox.type = "checkbox";
            doneCheckbox.checked = task.done;

            doneCheckbox.addEventListener("change", () => {
                updateTaskDone(task.id, doneCheckbox.checked);
            });

            const text = document.createElement("span");
            text.textContent = task.title;
            text.className = "taskText";

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Deletar";
            deleteButton.className = "actionButton";
            deleteButton.addEventListener("click", () => {
                deleteTask(task.id);
            });

            const updateButton = document.createElement("button");
            updateButton.textContent = "Atualizar";
            updateButton.className = "actionButton";
            updateButton.addEventListener("click", () => {
                updateTask(task);
            });

            li.appendChild(doneLabel);
            li.appendChild(doneCheckbox);
            li.appendChild(document.createTextNode(" | "));
            li.appendChild(text);
            li.appendChild(updateButton);
            li.appendChild(deleteButton);

            taskList.appendChild(li);
        });
    } catch (error) {
        showMessage("Sem conexao com o backend", "error");
    }
}

async function createTask() {
    const title = titleInput.value.trim();

    if (!title) {
        showMessage("Escreve um titulo", "error");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title })
        });

        if (!response.ok) {
            showMessage("Nao consegui criar a task", "error");
            return;
        }

        titleInput.value = "";
        showMessage("Task criada com sucesso", "success");
        loadTasks();
    } catch (error) {
        showMessage("Sem conexao com o backend", "error");
    }
}

async function deleteTask(id) {
    const confirmou = confirm("Quer mesmo deletar essa task?");

    if (!confirmou) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            showMessage("Nao consegui deletar", "error");
            return;
        }

        showMessage("Task deletada", "success");
        loadTasks();
    } catch (error) {
        showMessage("Sem conexao com o backend", "error");
    }
}

async function updateTask(task) {
    const newTitle = prompt("Novo titulo da task:", task.title);

    if (newTitle === null) {
        return;
    }

    if (!newTitle.trim()) {
        showMessage("Titulo nao pode ficar vazio", "error");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks/${task.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: newTitle.trim(),
                done: task.done
            })
        });

        if (!response.ok) {
            showMessage("Nao consegui atualizar", "error");
            return;
        }

        showMessage("Task atualizada", "success");
        loadTasks();
    } catch (error) {
        showMessage("Sem conexao com o backend", "error");
    }
}

async function updateTaskDone(taskId, done) {
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ done })
        });

        if (!response.ok) {
            showMessage("Nao consegui atualizar status", "error");
            return;
        }

        loadTasks();
    } catch (error) {
        showMessage("Sem conexao com o backend", "error");
    }
}

addButton.addEventListener("click", createTask);

titleInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        createTask();
    }
});

loadTasks();

