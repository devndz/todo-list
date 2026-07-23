import { type Request, type Response, Router } from "express";
import prisma from "../prisma_setup/prisma.js"
import type { TodoItem } from "../generated/prisma/index.js";
import type { createTodoItemRequestBody, patchTodoItemRequestBody, authenticatedRequest } from "../types.js";
import {tokenAuthenticator} from "../middlewares/tokenAuthenticator.js"
import { Prisma } from "../generated/prisma/client.js";

const todoRouter: Router = Router();

todoRouter.get("/", async (req: Request, res: Response) => {

    try{
        const todoItems: TodoItem[] = await prisma.todoItem.findMany();

        return res.status(200).json({todoItems})
    } catch (error: any) {
        console.error("Failed to fetch todoItems:", error);
        return res.status(500).json({ error: "An unexpected error occurred." });
    }
});

todoRouter.post("/", tokenAuthenticator, async (req: authenticatedRequest<{}, createTodoItemRequestBody>, res: Response) => {

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

        return res.status(201).json(newTodoItem)

    } catch(error: any){
        console.error("Failed to create todoItem:", error);

        if (error instanceof Prisma.PrismaClientValidationError) {
            return res.status(400).json({ error: "Bad input data." });
        }

        return res.status(500).json({ error: "An unexpected error occurred." });
    }
    
});

todoRouter.delete("/:id", tokenAuthenticator, async (req: authenticatedRequest<{id: string}>, res: Response) => {
    const idToDelete: number = parseInt(req.params.id);
    const userInfo = req.user;

    if(Number.isNaN(idToDelete)){
        return res.status(400).json({ error: "Invalid ID requestsed, id must be a valid integer." });
    }

    if(typeof userInfo?.id !== "number"){
        return res.status(401).json({ error: "Invalid authtoken payload." });
    }

    try{
        const todoItemToDelete = await prisma.todoItem.findUnique({
            where: { id: idToDelete },
            select: { ownerId: true } 
        });

        if(!todoItemToDelete){
            return res.status(404).json({ error: `todoItem with id: ${idToDelete} was not found.` });
        }

        if(todoItemToDelete.ownerId !== userInfo.id){
            return res.status(403).json({ error: "Forbidden: You do not own this todoItem." });
        }

        await prisma.todoItem.delete({
            where: {
                id: idToDelete,
            }
        });

        res.status(204)

    } catch(error: any){
        console.error(error); 
        return res.status(500).json({ error: "Unexpected server error." });
    }
});

todoRouter.patch("/:id", tokenAuthenticator, async (req: authenticatedRequest<{id: string}, patchTodoItemRequestBody>, res: Response) => {
    const idToUpdate: number = parseInt(req.params.id);
    const userInfo = req.user;
    const updatedFields: patchTodoItemRequestBody = req.body;

    if(Object.keys(updatedFields).length === 0){
        return res.status(400).json({ error: 'Request body is empty.' });
    }

    if(Number.isNaN(idToUpdate)){
        return res.status(400).json({ error: "Invalid ID requestsed, id must be a valid integer." });
    }

    if(typeof userInfo?.id !== "number"){
        return res.status(401).json({ error: "Invalid authtoken payload." });
    }

    try{
        const todoItemToUpdate = await prisma.todoItem.findUnique({
            where: { id: idToUpdate }, 
            select: { ownerId: true } 
        });

        if(!todoItemToUpdate){
            return res.status(404).json({ error: `todoItem with id: ${idToUpdate} was not found.` });
        }

        if(todoItemToUpdate.ownerId !== userInfo.id){
            return res.status(403).json({ error: "Forbidden: You do not own this todoItem." });
        }

        const updatedTodoItem = await prisma.todoItem.update({
            where: {id: idToUpdate},
            data: updatedFields
        });

        return res.status(200).json(updatedTodoItem);

    } catch(error: any){
        console.error(error); 
        return res.status(500).json({ error: "Unexpected server error." });
    }
});

export default todoRouter;