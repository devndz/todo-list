import { type Request} from "express";

//Need to maintain the genericness of the new request type 
//so we can still define the shape of request body on already authenticated requets
export type authenticatedRequest<Params = Record<string, string>, Body = unknown> = Request<Params, {}, Body> & {
    user?: jwtPayload;
};

export type jwtPayload = {
    id: number,
    username: string
}

export type authUserRequestBody = {
  username: string;
  password: string;
};

export type createTodoItemRequestBody = {
    name: string,
    description?: string
}