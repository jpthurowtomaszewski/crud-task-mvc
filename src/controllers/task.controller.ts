import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// agora eu uso o prisma pronto que vem do arquivo lib/prisma

// listar todas as tasks
export async function getAllTasks(req: Request, res: Response): Promise<void> {
  try {
    // pega tudo da tabela Task
    const tasks = await prisma.task.findMany({
      // ordena por id crescente pra ficar organizado
      orderBy: { id: "asc" }
    });

    // retorna lista
    res.status(200).json(tasks);
  } catch (error) {
    // erro generico se der problema no banco
    res.status(500).json({ message: "Erro ao listar tasks" });
  }
}

// buscar 1 task por id
export async function getTaskById(req: Request, res: Response): Promise<void> {
  // converto id da rota pra numero
  const id = Number(req.params.id);

  // valida se o id realmente virou numero
  if (Number.isNaN(id)) {
    res.status(400).json({ message: "Id invalido" });
    return;
  }

  try {
    // tenta achar no banco
    const task = await prisma.task.findUnique({
      where: { id }
    });

    // se nao achar, 404
    if (!task) {
      res.status(404).json({ message: "Task nao encontrada" });
      return;
    }

    // se achar, retorna
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar task" });
  }
}

// criar task
export async function createTask(req: Request, res: Response): Promise<void> {
  // pego title do body
  const { title } = req.body;

  // valida simples
  if (!title || typeof title !== "string") {
    res.status(400).json({ message: "Informe um title valido" });
    return;
  }

  try {
    // cria no banco
    const newTask = await prisma.task.create({
      data: {
        title,
        done: false
      }
    });

    // retorna criada
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar task" });
  }
}

// atualizar task
export async function updateTask(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const { title, done } = req.body;

  if (Number.isNaN(id)) {
    res.status(400).json({ message: "Id invalido" });
    return;
  }

  try {
    // primeiro vejo se existe
    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      res.status(404).json({ message: "Task nao encontrada" });
      return;
    }

    // monto os dados que vao ser alterados
    // (so entra no update o que realmente veio)
    const dataToUpdate: { title?: string; done?: boolean } = {};

    if (typeof title === "string") {
      dataToUpdate.title = title;
    }

    if (typeof done === "boolean") {
      dataToUpdate.done = done;
    }

    // se nao veio nada valido pra atualizar
    if (Object.keys(dataToUpdate).length === 0) {
      res.status(400).json({ message: "Nada valido para atualizar" });
      return;
    }

    // atualiza no banco
    const updatedTask = await prisma.task.update({
      where: { id },
      data: dataToUpdate
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar task" });
  }
}

// deletar task
export async function deleteTask(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ message: "Id invalido" });
    return;
  }

  try {
    // confiro se existe antes de deletar
    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      res.status(404).json({ message: "Task nao encontrada" });
      return;
    }

    // deleta no banco
    await prisma.task.delete({ where: { id } });

    res.status(200).json({ message: "Task removida" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover task" });
  }
}
