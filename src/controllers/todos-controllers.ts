import express, { Request, Response } from "express";
import { readTodos, writeTodos, Todo } from "../helpers/todoHelper";
import path from "path";

const todosPath = path?.join(__dirname, "../db/todos.json");

export const todosController = {
  getAllTodo(req: Request, res: Response) {
    try {
      const todos = readTodos().filter((todo) => !todo.deletedAt);
      res.status(200).json({
        success: true,
        message: "Get todos successfully",
        data: todos,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Get todos failed",
        error,
      });
    }
  },
  getTodoById(req: Request, res: Response) {
    try {
      const todos = readTodos();
      const id = req.params.id;

      if (isNaN(Number(id))) {
        return res.status(400).json({
          success: false,
          message: "invalid id",
        });
      }
      const todo = todos.find(
        (todo) => todo.id === Number(id) && !todo.deletedAt,
      );

      if (!todo) {
        return res.status(404).json({
          success: false,
          message: "Todo not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Get todo successfully",
        data: todo,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Get todo failed",
        error,
      });
    }
  },
  createTodo(req: Request, res: Response) {
    try {
      const { title, description, category } = req.body;
      if (!title || !description || !category) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }
      const todos = readTodos();
      const newTodo: Todo = {
        id: todos.length ? todos[todos.length - 1].id + 1 : 1,
        title,
        description,
        category,
        isDone: false,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        deletedAt: null,
      };
      todos.push(newTodo);
      writeTodos(todos);

      res.status(201).json({
        success: true,
        message: "Create todo successfully",
        data: newTodo,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Create todo failed",
        error,
      });
    }
  },
  updateTodo(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (isNaN(Number(id))) {
        return res.status(400).json({
          success: false,
          message: "invalid id",
        });
      }
      const todos = readTodos();
      const todoIndex = todos.findIndex(
        (todo) => todo.id === Number(id) && !todo.deletedAt,
      );
      if (todoIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Todo not found",
        });
      }
      const { title, description, category, isDone } = req.body;
      const updatedTodo = {
        ...todos[todoIndex],
        title: title ?? todos[todoIndex].title,
        description: description ?? todos[todoIndex].description,
        category: category ?? todos[todoIndex].category,
        isDone: isDone ?? todos[todoIndex].isDone,
        updatedAt: new Date().toISOString(),
      };
      todos[todoIndex] = updatedTodo;
      writeTodos(todos);
      res.status(200).json({
        success: true,
        message: "Update todo successfully",
        data: updatedTodo,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Update todo failed",
        error,
      });
    }
  },
  deleteTodo(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (isNaN(Number(id))) {
        return res.status(400).json({
          success: false,
          message: "Invalid id",
        });
      }
      const todos = readTodos();
      const todoIndex = todos.findIndex(
        (todo) => todo.id === Number(id) && !todo.deletedAt,
      );
      if (todoIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Todo not found",
        });
      }
      todos[todoIndex].deletedAt = new Date().toISOString();
      writeTodos(todos);
      res.status(200).json({
        success: true,
        message: "Delete todo successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Delete todo failed",
        error,
      });
    }
  },
};
