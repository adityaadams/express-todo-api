import { Request, Response } from "express";
import { readTodos, writeTodos, Todo } from "../helpers/todoHelper";

export const todosController = {
  getAllTodo(req: Request, res: Response) {
    try {
      const { category, search, page = "1", limit = "5" } = req.query;
      const currentPage = Number(page);
      const MAX_LIMIT = 20;
      const perPage = Math.min(Number(limit), MAX_LIMIT);

      if (
        isNaN(currentPage) ||
        isNaN(perPage) ||
        currentPage < 1 ||
        perPage < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid pagination params",
        });
      }

      let todos = readTodos().filter((todo: Todo) => !todo.deletedAt);

      // filter by
      if (category && typeof category === "string") {
        todos = todos.filter(
          (todo: Todo) =>
            todo.category.toLowerCase() === category.toLowerCase(),
        );
      }

      // search by
      if (search && typeof search === "string") {
        const keyword = search.toLowerCase();
        todos = todos.filter(
          (todo: Todo) =>
            todo.title.toLowerCase().includes(keyword) ||
            todo.description.toLowerCase().includes(keyword),
        );
      }

      // pagination
      const totalData = todos.length;
      const totalPages = Math.ceil(totalData / perPage);
      const startIndex = (currentPage - 1) * perPage;
      const endIndex = startIndex + perPage;
      const Paginatedtodos = todos.slice(startIndex, endIndex);

      res.status(200).json({
        success: true,
        message: "Get todos successfully",
        meta: {
          totalData,
          totalPages,
          currentPage,
          perPage,
        },
        data: Paginatedtodos,
      });
    } catch (error) {
      console.error("Get todo failed:", error);

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
  getTodoById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const todoId = Number(id);
      if (isNaN(todoId) || todoId < 1) {
        return res.status(400).json({
          success: false,
          message: "Invalid id",
        });
      }

      const todos = readTodos();

      const todo = todos.find((todo) => todo.id === todoId && !todo.deletedAt);

      if (!todo) {
        return res.status(404).json({
          success: false,
          message: "Todo not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Get todo successfully",
        data: todo,
      });
    } catch (error) {
      console.error("Get todo failed:", error);

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
  createTodo(req: Request, res: Response) {
    try {
      const { title, description, category } = req.body;

      // validasi input
      if (
        typeof title !== "string" ||
        typeof description !== "string" ||
        typeof category !== "string" ||
        !title.trim() ||
        !description.trim() ||
        !category.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid input data",
        });
      }

      const todos = readTodos();

      // generate id terurut
      const maxId = todos.reduce(
        (max, todo) => (todo.id > max ? todo.id : max),
        0,
      );

      const newTodo: Todo = {
        id: maxId + 1,
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        isDone: false,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        deletedAt: null,
      };

      todos.push(newTodo);
      writeTodos(todos);

      return res.status(201).json({
        success: true,
        message: "Create todo successfully",
        data: newTodo,
      });
    } catch (error) {
      console.error("Create todo failed:", error);

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
  updateTodo(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const todoId = Number(id);

      if (isNaN(todoId) || todoId < 1) {
        return res.status(400).json({
          success: false,
          message: "Invalid id",
        });
      }
      const todos = readTodos();
      const todoIndex = todos.findIndex(
        (todo) => todo.id === todoId && !todo.deletedAt,
      );

      if (todoIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Todo not found",
        });
      }

      const { title, description, category, isDone } = req.body;

      // validasi isDone
      if (isDone !== undefined && typeof isDone !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "isDone must be boolean",
        });
      }
      // validasi input
      if (
        (title !== undefined && (typeof title !== "string" || !title.trim())) ||
        (description !== undefined &&
          (typeof description !== "string" || !description.trim())) ||
        (category !== undefined &&
          (typeof category !== "string" || !category.trim()))
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid input data",
        });
      }

      const updatedTodo: Todo = {
        ...todos[todoIndex],
        title: title !== undefined ? title.trim() : todos[todoIndex].title,
        description:
          description !== undefined
            ? description.trim()
            : todos[todoIndex].description,
        category:
          category !== undefined ? category.trim() : todos[todoIndex].category,
        isDone: isDone !== undefined ? isDone : todos[todoIndex].isDone,
        updatedAt: new Date().toISOString(),
      };

      todos[todoIndex] = updatedTodo;
      writeTodos(todos);

      return res.status(200).json({
        success: true,
        message: "Update todo successfully",
        data: updatedTodo,
      });
    } catch (error) {
      console.error("Update todo failed:", error);

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
  deleteTodo(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const todoId = Number(id);

      // validasi id
      if (isNaN(todoId) || todoId < 1) {
        return res.status(400).json({
          success: false,
          message: "Invalid id",
        });
      }

      const todos = readTodos();

      const todoIndex = todos.findIndex(
        (todo) => todo.id === todoId && !todo.deletedAt,
      );

      if (todoIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Todo not found",
        });
      }
      
      todos[todoIndex].deletedAt = new Date().toISOString();
      writeTodos(todos);

      return res.status(200).json({
        success: true,
        message: "Delete todo successfully",
      });
    } catch (error) {
      console.error("Delete todo failed:", error);

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
};
