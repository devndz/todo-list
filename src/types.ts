import { type Request} from "express";

//Need to maintain the genericness for the new authenticated request 
//so we can still define the shape of request body 
export type authenticatedRequest
    <Params = Record<string, string | number>, Body = unknown> 
        = Request<Params, {}, Body> & {
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

export type patchTodoItemRequestBody = {
    name?: string,
    description?: string
}