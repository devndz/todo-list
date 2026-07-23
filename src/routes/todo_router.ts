import { type Request, type Response, Router } from "express";
import prisma from "../prisma_setup/prisma.js"
import type { TodoItem } from "../generated/prisma/index.js";

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {

    try{
        const todoItems: TodoItem[] = await prisma.todoItem.findMany();

        return res.status(200).json({todoItems})
    } catch (err: any) {
        console.error("Failed to fetch todos:", err);

        return res.status(500).json({ error: "An unexpected error occurred." });
    }
    
});

router.post("/create", async (req: Request, res: Response) => {

});

router.delete("/:id",  async (req: Request, res: Response) => {

});

router.patch("/:id",  async (req: Request, res: Response) => {

});

export default router;