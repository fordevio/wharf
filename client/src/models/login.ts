export interface IsAdminAvailableRes {
    username: string ,
    userId: string
}

export interface LoginRes {
    token: string,
    username: string,
    userId: string
}

export interface AdminPasswordRes{
    password: string
}