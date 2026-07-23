import {type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import {type tokenAuthenticationRequest, type jwtPayload} from "../types.js";
import "dotenv/config";

export function tokenAuthenticator(req: tokenAuthenticationRequest, res: Response, next: NextFunction){
    const authHeader = req.get("authorization");
    //Assuming user uses the standard bearer format
    const authToken = authHeader?.split(" ")[1];

    if(!authToken){
        return res.status(401).json({ error: 'No Token was provided in the request.' });
    }

    try{
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET as string);

        if (typeof decoded === "string") {
            return res.status(401).json({ error: "Invalid token payload." });
        }

        if (typeof decoded.id !== "number") {
            return res.status(401).json({ error: "Invalid token payload." });
        }

        if (typeof decoded.username !== "string"){
            return res.status(401).json({ error: "Invalid token payload." });
        }

        const decodedJwtPayload: jwtPayload = decoded as jwtPayload;

        req.user = decodedJwtPayload;

        next();
    
    }catch(error: any){
        res.status(401).json({ error: 'Token is invalid or has expired.' });
    }
}