

export interface GetUserRes {
    username: string,
    id : number,
    isAdmin: boolean,
    permission: string,
}

export interface User{
    username: string,
    id : number,
    isAdmin: boolean,
    permission: string,
    password: string
}

