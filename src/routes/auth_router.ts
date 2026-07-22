import { type Request, type Response, Router } from "express";
import prisma from "../prisma_setup/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import bcrypt from 'bcrypt';

const router: Router = Router();

//Helpful docs: 
// https://www.prisma.io/docs/orm/reference/error-reference
// https://www.prisma.io/docs/orm/reference/error-reference#error-codes

router.post("/registerUser", async (req: Request, res: Response) => {
    try{
        const {username, password} = req.body;

        const hashCycles = 11; 
        const hashedPassword = await bcrypt.hash(password, hashCycles);

        const newTodoItem = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        })
        res.status(201).json({message: `Created account for ${username} with id: ${newTodoItem.id}`});
    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {

            if (error.code === 'P2002') {
                return res.status(409).json({ error: 'A user with this username already exists.' });
            }
        }

        if (error instanceof Prisma.PrismaClientValidationError) {
            return res.status(400).json({ error: 'email, username or password were not provided.' });
        }

        console.error(error);   
        res.status(500).json({ error: 'Internal server error' });
    }

    
} )

export default router;