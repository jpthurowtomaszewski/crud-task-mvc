import { useEffect, useState } from "react";

// Local URL is used while testing in localhost.
// Deploy URL is used when opening the deployed frontend.
const LOCAL_API_URL = "http://localhost:3000";
const DEPLOY_API_URL = "https://crud-task-mvc-oixj.onrender.com";

const runningLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const API_URL = runningLocal ? LOCAL_API_URL : DEPLOY_API_URL;

function App() {
  // tasks: list from API
  // title: input value for new task
  // message/messageType: feedback text under the form
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // text: message content
  // type: "success" or "error" to change color in CSS
  function showMessage(text, type) {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 2500);
  }

  async function loadTasks() {
    try {
      const response = await fetch(`${API_URL}/tasks`);

      if (!response.ok) {
        showMessage("Deu erro ao carregar tasks", "error");
        return;
      }

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      showMessage("Sem conexao com o backend", "error");
    }
  }

  async function createTask(event) {
    event.preventDefault();

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      showMessage("Escreve um titulo", "error");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: cleanTitle })
      });

      if (!response.ok) {
        showMessage("Nao consegui criar a task", "error");
        return;
      }

      setTitle("");
      showMessage("Task criada com sucesso", "success");
      loadTasks();
    } catch (error) {
      showMessage("Sem conexao com o backend", "error");
    }
  }

  // id: task id in database
  async function deleteTask(id) {
    const confirmou = window.confirm("Quer mesmo deletar essa task?");

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

  // task: current task object
  async function updateTask(task) {
    const newTitle = window.prompt("Novo titulo da task:", task.title);

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

  // taskId: task id in database
  // done: true/false from checkbox
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

  // Load tasks once after the first render.
  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <main className="page">
      <h1>Minhas Tasks</h1>

      <form className="form-row" onSubmit={createTask}>
        <input
          type="text"
          placeholder="Digite um titulo"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <button type="submit">Adicionar</button>
      </form>

      <p className={`message-box ${messageType}`}>{message}</p>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id}>
            <span>Concluida:</span>
            <input
              type="checkbox"
              checked={task.done}
              onChange={(event) => updateTaskDone(task.id, event.target.checked)}
            />
            <span className="task-text">{task.title}</span>
            <button className="action-button" type="button" onClick={() => updateTask(task)}>
              Atualizar
            </button>
            <button className="action-button" type="button" onClick={() => deleteTask(task.id)}>
              Deletar
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
