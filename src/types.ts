import { type Request} from "express";

//Need to maintain the genericness for the new authenticated request 
//so we can still define the shape of request body 
export type authenticatedRequest
    <Params = Record<string, string | number>, Body = unknown> 
        = Request<Params, {}, Body> & {
    user?: userInfo;
};

export type userInfo = {
    id: number,
    username: string
}

export type authUserRequestBody = {
  username: string;
  password: string;
};

export type createTodoItemRequestBody = {
    name: string,
    description?: string,
    category?: string,
    ownerId?: number //Id will not ever be passed with body but we will want to append it
}

export type patchTodoItemRequestBody = {
    name?: string,
    description?: string
    category?: string,
    isCompleted?: boolean
}

export type searchFilters = {
    name?: string,
    ownerId?: string,
    ownerUsername?: string,
    category?: string,
    isCompleted?: string,
}