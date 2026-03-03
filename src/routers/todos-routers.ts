import { Router } from "express";
import { todosController } from "../controllers/todos-controllers";

const todosRouter = Router();

todosRouter.get("/", todosController.getAllTodo);
todosRouter.get("/:id", todosController.getTodoById);
todosRouter.post("/", todosController.createTodo);
todosRouter.put("/:id", todosController.updateTodo);
todosRouter.delete("/:id", todosController.deleteTodo);

export default todosRouter;