import { type Request, type Response, Router } from "express";
import prisma from "../prisma_setup/prisma.js"
import type { TodoItem } from "../generated/prisma/index.js";
import type { createTodoItemRequestBody, authenticatedRequest } from "../types.js";
import {tokenAuthenticator} from "../middlewares/tokenAuthenticator.js"

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {

    try{
        const todoItems: TodoItem[] = await prisma.todoItem.findMany();

        return res.status(200).json({todoItems})
    } catch (error: any) {
        console.error("Failed to fetch todos:", error);
        return res.status(500).json({ error: "An unexpected error occurred." });
    }
});


router.post("/create", tokenAuthenticator, async (req: authenticatedRequest<{}, createTodoItemRequestBody>, res: Response) => {

    try{
        const {name, description} = req.body;
        const userInfo = req.user;

        if(typeof userInfo?.id !== "number"){
            return res.status(401).json({ error: "Invalid authtoken payload." });
        }

        const newTodoItem = await prisma.todoItem.create({
            data: {
                    name,
                    description: description ?? null,
                    ownerId: userInfo?.id
                }
        })

        res.status(201).json(newTodoItem)

    } catch(error: any){
        console.error("Failed to fetch todos:", error);

        return res.status(500).json({ error: "An unexpected error occurred." });
    }
    
});

router.delete("/:id",  async (req: Request, res: Response) => {

});

router.patch("/:id",  async (req: Request, res: Response) => {

});

export default router;