import { Router } from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from "../controllers/task.controller";

// crio um router so das rotas de task
const taskRoutes = Router();

// lista tudo
taskRoutes.get("/", getAllTasks);

// busca por id
taskRoutes.get("/:id", getTaskById);

// cria
taskRoutes.post("/", createTask);

// atualiza
taskRoutes.put("/:id", updateTask);

// deleta
taskRoutes.delete("/:id", deleteTask);

// exporto pra usar no server
export default taskRoutes;
