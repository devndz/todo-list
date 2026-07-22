import express, { type Request, type Response } from 'express';
import auth_router from "./api_routes/auth_router.js";
import todo_router from "./api_routes/todo_router.js";

const app = express();

app.use("/api/todo", todo_router);
app.use("api/auth", auth_router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});