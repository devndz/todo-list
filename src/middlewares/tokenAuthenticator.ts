import type {Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type {authenticatedRequest, userInfo} from "../types.js";
import "dotenv/config";

//Middle ware which authenticate the JWT tokens of any route it's attached to.
//Routes authenticated byt this middleware will receive the custom request type authenticatedRequest, defiend in types.ts
//Which adds a user field to req containing a user's id and username.
export function tokenAuthenticator(req: authenticatedRequest, res: Response, next: NextFunction){
    const authHeader = req.get("authorization");
    //Assuming user uses the standard bearer token format
    const authToken = authHeader?.split(" ")[1];

    if(!authToken){
        return res.status(401).json({ error: 'No Token was provided in the request.' });
    }

    try{
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET as string);

        if (typeof decoded === "string") {
            return res.status(401).json({ error: "Invalid authtoken payload." });
        }

        if (typeof decoded.id !== "number") {
            return res.status(401).json({ error: "Invalid authtoken payload." });
        }

        if (typeof decoded.username !== "string"){
            return res.status(401).json({ error: "Invalid authtoken payload." });
        }

        const decodedJwtPayload: userInfo = decoded as userInfo;

        req.user = decodedJwtPayload;

        next();
    
    } catch(error: unknown){
        console.error(error); 
        return res.status(401).json({ error: 'Token is invalid or has expired.' });
    }
}