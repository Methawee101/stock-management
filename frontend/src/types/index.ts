export interface AuthResponse {
    token: string
    email: string
    role: string
}

export interface User {
    id: string
    name: string
    email: string
    role: string
}