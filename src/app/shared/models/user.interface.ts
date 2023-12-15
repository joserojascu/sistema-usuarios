export type Roles = 'basic' | 'admin' | null;

export interface User{
    firstName: String;
    password: string;
}

export interface UserResponse extends User{
    message:string;
    token: string;
    userId: number;
    rol: Roles;
}