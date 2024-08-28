export interface LoginInterface {
    email: string;
    password: string;
}

export interface UserResponse {
    accessToken: string;
    email: string;
    emailVerified: boolean;
    uid: number;
}

export interface UserResponseErrorInterface {
    code: string;
    message: string;
}
