import api from '@/lib/api'
import { AuthResponse } from '@/types'

export const authService = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        const res = await api.post('/api/auth/login', { email, password })
        return res.data
    },

    register: async (name: string, email: string, password: string): Promise<string> => {
        const res = await api.post('/api/auth/register', { name, email, password })
        return res.data
    },

    logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        window.location.href = '/login'
    }
}