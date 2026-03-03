// nao se espanta com a quantidade de comentario aqui kkk assim gravo melhor as coisas
// aqui fica o endereco do backend que ta no render
const API_URL = "https://crud-task-mvc.onrender.com";

// pegando elementos do html
const titleInput = document.getElementById("titleInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");

// funcao que busca no backend e desenha a lista na tela
async function loadTasks() {
    // faz requisicao GET /tasks
    const response = await fetch(`${API_URL}/tasks`);

    // converte resposta pra json
    const tasks = await response.json();

    // limpa a lista antes de renderizar de novo
    taskList.innerHTML = "";

    // percorro cada task que veio da api
    tasks.forEach((task) => {
        // crio um item de lista <li>
        const li = document.createElement("li");

        // crio um texto base da task
        const text = document.createElement("span");
        text.textContent = `${task.title} - done: ${task.done}`;

        // botao de deletar
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Deletar";

        // quando clicar, chama a funcao de deletar passando id
        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });

        // botao de atualizar
        const updateButton = document.createElement("button");
        updateButton.textContent = "Atualizar";

        // quando clicar, chama a funcao de atualizar passando a task inteira
        updateButton.addEventListener("click", () => {
            updateTask(task);
        });

        // coloco o texto e os botoes dentro do li
        li.appendChild(text);
        li.appendChild(document.createTextNode(" "));
        li.appendChild(updateButton);
        li.appendChild(document.createTextNode(" "));
        li.appendChild(deleteButton);

        // adiciono esse <li> dentro da ul
        taskList.appendChild(li);
    });
}

// funcao chamada quando clica no botao adicionar
async function createTask() {
    // pega o texto digitado e tira espacos no comeco/fim
    const title = titleInput.value.trim();

    // se vier vazio, nao deixa continuar
    if (!title) {
        alert("Escreve um titulo ae");
        return;
    }

    // faz requisicao POST /tasks pra criar no banco
    await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
    });

    // limpa input depois de criar
    titleInput.value = "";

    // recarrega lista pra mostrar a task nova
    loadTasks();
}

// funcao pra deletar task
async function deleteTask(id) {
    // confirmacao simples pra nao apagar sem querer
    const confirmou = confirm("É pra essa task jogar no vasco?");

    if (!confirmou) {
        return;
    }

    // faz requisicao DELETE /tasks/:id
    await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE"
    });

    // recarrega lista depois de deletar
    loadTasks();
}

// funcao pra atualizar task
async function updateTask(task) {
    // pego novo titulo com prompt (bem simples estilo iniciante)
    const novoTitulo = prompt("Novo titulo da task:", task.title);

    // se cancelar o prompt, nao faz nada
    if (novoTitulo === null) {
        return;
    }

    // se vier vazio, nao atualiza
    if (!novoTitulo.trim()) {
        alert("Titulo nao pode ficar vazio");
        return;
    }

    // movimento de genio: inverter done toda vez que atualizar
    const novoDone = !task.done;

    // faz requisicao PUT /tasks/:id
    await fetch(`${API_URL}/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: novoTitulo.trim(),
            done: novoDone
        })
    });

    // recarrega lista depois de atualizar
    loadTasks();
}

// quando clicar no botao, chama createTask
addButton.addEventListener("click", createTask);

// ja busca as tasks assim que a pagina abre
loadTasks();
