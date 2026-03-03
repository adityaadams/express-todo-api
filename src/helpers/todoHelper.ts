import fs from "fs";
import path from "path";

const todosPath = path?.join(__dirname, "../db/todos.json");

interface Todo {
    id: number;
    title: string;
    description: string;
    category: string;
    isDone: boolean;
    createdAt: string;
    updatedAt: string | null;
    deletedAt: string | null;
}

const readTodos = () : Todo[] => {
    try {
        if (!fs.existsSync(todosPath)) {
            fs.writeFileSync(todosPath, JSON.stringify([], null, 2));
            return [];
        }
        const data = fs.readFileSync(todosPath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        throw new Error("Failed to read todos");
    }
};

const writeTodos = (todos: Todo[]) => {
    try {
        fs.writeFileSync(todosPath, JSON.stringify(todos, null, 2));
    } catch (error) {
        throw new Error("Failed to write todos");
    }
};

export { readTodos, writeTodos, Todo };