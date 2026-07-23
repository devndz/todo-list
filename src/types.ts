import { type Request} from "express";

export interface tokenAuthenticationRequest extends Request {
    // user field always starts null and will be appeneded to req if authentication is successful 
    user?: jwtPayload
}

export type jwtPayload = {
    id: number,
    username: string
}

export type authUserRequestBody = {
  username: string;
  password: string;
};

export type createTodoRequestBody = {
    
}