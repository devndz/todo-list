import { type Request, type Response, Router } from "express";
import prisma from "../prisma_setup/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import type { authUserRequestBody } from "../types.js";

const authRouter: Router = Router();

//Helpful docs: 
// https://www.prisma.io/docs/orm/reference/error-reference
// https://www.prisma.io/docs/orm/reference/error-reference#error-codes

authRouter.post("/register", async (req: Request<{}, {}, authUserRequestBody>, res: Response) => {
    try{
        const {username, password} = req.body;

        const hashCycles = 11; 
        const hashedPassword = await bcrypt.hash(password, hashCycles);

        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        })
        return res.status(201).json({message: `Created account for ${username} with id: ${newUser.id}`});
    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {

            if (error.code === 'P2002') {
                return res.status(409).json({ error: 'A user with this username already exists.' });
            }
        }

        if (error instanceof Prisma.PrismaClientValidationError) {
            return res.status(400).json({ error: 'email, username or password were not provided.'});
        }

        console.error(error);   
        return res.status(500).json({ error: 'Internal server error' });
    }
} )

//Cannot wait until the new query method from http gets added to express, for now gotta use a post non semantically
authRouter.post("/login", async (req: Request<{}, {}, authUserRequestBody>, res: Response) => {
    try{
        const {username, password} = req.body;

        const exisitngUser = await prisma.user.findUnique({
            where: {username}
        });

        if(!exisitngUser){
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const correctPassword = await bcrypt.compare(password, exisitngUser.password);

        if(!correctPassword){
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        
        const authToken = jwt.sign(
            {id: exisitngUser.id, username: exisitngUser.username},
            process.env.JWT_SECRET as string,
            {expiresIn: "2h"}
        )

        return res.status(200).json({authToken});

    } catch (error: any){
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

export default authRouter;