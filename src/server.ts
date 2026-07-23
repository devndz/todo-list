import express, { type Request, type Response } from 'express';
import authRouter from "./routes/authRouter.js";
import todoRouter from "./routes/todoRouter.js";

const app = express();

app.use(express.json());

app.use("/api/todoItems", todoRouter);
app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});