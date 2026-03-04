// nao se espanta com a quantidade de comentario aqui kkk assim gravo melhor as coisas
// aqui fica o endereco do backend que ta no render
const API_URL = "https://crud-task-mvc.onrender.com";

// pegando elementos do html
const titleInput = document.getElementById("titleInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const messageBox = document.getElementById("messageBox");

// funcao pra mostrar mensagem na tela
function showMessage(text, type) {
    // texto da mensagem
    messageBox.textContent = text;

    // classe pra mudar cor (sucesso ou erro)
    messageBox.className = type;

    // limpa depois de 2.5 segundos
    setTimeout(() => {
        messageBox.textContent = "";
        messageBox.className = "";
    }, 2500);
}

// função que busca no backend e lista na tela
async function loadTasks() {
    try {
        // faz requisicao GET /tasks
        const response = await fetch(`${API_URL}/tasks`);

        // se der erro http, aviso e paro
        if (!response.ok) {
            showMessage("Deu erro ao carregar tasks", "error");
            return;
        }

        // converte resposta pra json
        const tasks = await response.json();

        // limpa a lista antes de renderizar de novo
        taskList.innerHTML = "";

        // percorro cada task que veio da api
        tasks.forEach((task) => {
            // crio um item de lista <li>
            const li = document.createElement("li");

            // checkbox pra marcar concluida
            const doneLabel = document.createElement("span");
            doneLabel.textContent = "Task Concluida:";

            const doneCheckbox = document.createElement("input");
            doneCheckbox.type = "checkbox";
            doneCheckbox.checked = task.done;

            // quando marca/desmarca, atualiza so o done
            doneCheckbox.addEventListener("change", () => {
                updateTaskDone(task.id, doneCheckbox.checked);
            });

            // crio um texto base da task
            const text = document.createElement("span");
            text.textContent = `Task: ${task.title}`;
            text.className = "taskText";

            // botao de deletar
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Deletar";
            deleteButton.className = "actionButton";

            // quando clicar, chama a funcao de deletar passando id
            deleteButton.addEventListener("click", () => {
                deleteTask(task.id);
            });

            // botao de atualizar
            const updateButton = document.createElement("button");
            updateButton.textContent = "Atualizar";
            updateButton.className = "actionButton";

            // quando clicar, chama a funcao de atualizar passando a task inteira
            updateButton.addEventListener("click", () => {
                updateTask(task);
            });

            // coloco o texto e os botoes dentro do li
            li.appendChild(doneLabel);
            li.appendChild(doneCheckbox);
            li.appendChild(document.createTextNode(" | "));
            li.appendChild(document.createTextNode(" "));
            li.appendChild(text);
            li.appendChild(document.createTextNode(" "));
            li.appendChild(updateButton);
            li.appendChild(document.createTextNode(" "));
            li.appendChild(deleteButton);

            // adiciono esse <li> dentro da ul
            taskList.appendChild(li);
        });
    } catch (error) {
        // erro de rede/conexao
        showMessage("Sem conexao com o backend", "error");
    }
}

// funcao chamada quando clica no botao adicionar
async function createTask() {
    // pega o texto digitado e tira espacos no comeco/fim
    const title = titleInput.value.trim();

    // se vier vazio, nao deixa continuar
    if (!title) {
        showMessage("Escreve um titulo ae", "error");
        return;
    }

    try {
        // faz requisicao POST /tasks pra criar no banco
        const response = await fetch(`${API_URL}/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title })
        });

        // se deu erro http, aviso
        if (!response.ok) {
            showMessage("Nao consegui criar a task", "error");
            return;
        }

        // limpa input depois de criar
        titleInput.value = "";

        // mostra mensagem de sucesso
        showMessage("Task criada com sucesso", "success");

        // recarrega lista pra mostrar a task nova
        loadTasks();
    } catch (error) {
        showMessage("Sem conexao com o backend", "error");
    }
}

// funcao pra deletar task
async function deleteTask(id) {
    // confirmacao simples pra nao apagar sem querer
    const confirmou = confirm("É pra essa task jogar no vasco?");

    if (!confirmou) {
        return;
    }

    try {
        // faz requisicao DELETE /tasks/:id
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: "DELETE"
        });

        // se deu erro http, aviso
        if (!response.ok) {
            showMessage("Nao consegui deletar", "error");
            return;
        }

        // mostra mensagem de sucesso
        showMessage("Task deletada", "success");

        // recarrega lista depois de deletar
        loadTasks();
    } catch (error) {
        showMessage("Sem conexao com o backend", "error");
    }
}

// funcao pra atualizar task
async function updateTask(task) {
    // pego novo titulo com prompt
    const newTitle = prompt("Novo titulo da task:", task.title);

    // se cancelar o prompt, nao faz nada
    if (newTitle === null) {
        return;
    }

    // se vier vazio, nao atualiza
    if (!newTitle.trim()) {
        showMessage("Titulo nao pode ficar vazio", "error");
        return;
    }

    // aqui mantem o done atual (nao muda o status no update de titulo)
    const newDone = task.done;

    try {
        // faz requisicao PUT /tasks/:id
        const response = await fetch(`${API_URL}/tasks/${task.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: newTitle.trim(),
                done: newDone
            })
        });

        // se deu erro http, aviso
        if (!response.ok) {
            showMessage("Nao consegui atualizar", "error");
            return;
        }

        // mostra mensagem de sucesso
        showMessage("Task atualizada", "success");

        // recarrega lista depois de atualizar
        loadTasks();
    } catch (error) {
        showMessage("Sem conexao com o backend", "error");
    }
}

// funcao pra atualizar done
async function updateTaskDone(taskId, done) {
    await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done })
    });

    loadTasks();
}

// quando clicar no botao, chama createTask
addButton.addEventListener("click", createTask);

// ja busca as tasks assim que a pagina abre
loadTasks();
