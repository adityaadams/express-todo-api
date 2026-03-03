import express from "express";
import dotenv from "dotenv";
import todosRouter from "./routers/todos-routers";

dotenv.config();
const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());

app.use("/api/todos", todosRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
