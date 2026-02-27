import { Request, Response } from "express";
import { tasks, Task } from "../models/task.model";

// lista todas as tasks
export function getAllTasks(req: Request, res: Response): void {
  res.status(200).json(tasks);
}

// busca task por id
export function getTaskById(req: Request, res: Response): void {
  // converto o id da rota pra número
  const id = Number(req.params.id);

  // acho a task no array
  const task = tasks.find((t) => t.id === id);

  // se não achar, retorno erro
  if (!task) {
    res.status(404).json({ message: "Task nao encontrada" });
    return;
  }

  // se achar, retorno ela
  res.status(200).json(task);
}

// cria task
export function createTask(req: Request, res: Response): void {
  const { title } = req.body;

  // valida se veio um title válido
  if (!title || typeof title !== "string") {
    res.status(400).json({ message: "Informe um title valido" });
    return;
  }

  // gerar id único
  const newTask: Task = {
    id: Date.now(),
    title,
    done: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
}

// atualiza task
export function updateTask(req: Request, res: Response): void {
  const id = Number(req.params.id);
  const { title, done } = req.body;

  // pego a task no array
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    res.status(404).json({ message: "Task nao encontrada" });
    return;
  }

  // muda os campos que vieram
  if (typeof title === "string") {
    task.title = title;
  }

  if (typeof done === "boolean") {
    task.done = done;
  }

  res.status(200).json(task);
}

// deleta task
export function deleteTask(req: Request, res: Response): void {
  const id = Number(req.params.id);

  // acho a posição da task
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    res.status(404).json({ message: "Task nao encontrada" });
    return;
  }

  tasks.splice(index, 1);
  res.status(200).json({ message: "Task removida" });
}
