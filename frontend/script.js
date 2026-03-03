// nao se espanta com a quantidade de comentario aqui kkk assim gravo melhor as coisas
// aqui fica o endereco do backend que ta no render
const API_URL = "https://crud-task-mvc.onrender.com";
const titleInput = document.getElementById("titleInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
// Listar minhas tasks na tela
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
        // monto o texto que vai aparecer na linha
        li.textContent = `${task.title} - done: ${task.done}`;
        // adiciono esse <li> dentro da ul
        taskList.appendChild(li);    
}); 
}
// Criar uma task nova
// funcao chamada quando clica no botao adicionar
async function createTask() {
    // pega o texto digitado e tira espacos no comeco/fim
    const title = titleInput.value.trim();
    // se vier vazio, nao deixa continuar
    if (!title) {
        alert("Escreve um título ae");
        return;
    }
    // faz requisicao POST /tasks pra criar no banco
    await fetch(`${API_URL}/tasks`, {
        method: "POST",
        // avisando que o body vai em json
        headers: { "Content-Type": "application/json" },
        // mando o titulo em formato json
        body: JSON.stringify({title})
    });
    // limpa input depois de criar
    titleInput.value = "";
    // recarrega lista pra mostrar a task nova
    loadTasks();
}
// quando clicar no botao, chama createTask
addButton.addEventListener("click", createTask);
// ja busca as tasks assim que a pagina abre
loadTasks();
